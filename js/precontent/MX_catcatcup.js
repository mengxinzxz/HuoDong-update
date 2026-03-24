import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    var MX_catcatcup = {
        name: 'MX_catcatcup',
        connect: true,
        /*
        characterSort: {
            MX_catcatcup: {
            },
        },
        */
        character: {
            cat_re_liubei: ['male', 'shu', 4, ['catrende']],
            cat_re_zhugeliang: ['male', 'shu', 3, ['catguanxing', 'kongcheng']],
            cat_re_zhaoyun: ['male', 'shu', 4, ['longdan', 'catyajiao']],
            cat_re_machao: ['male', 'shu', 4, ['mashu', 'cattieji']],
            cat_re_huangyueying: ['male', 'shu', 4, ['catjizhi', 'reqicai']],
        },
        skill: {
            //刘备
            catrende: {
                audio: 'rerende',
                enable: 'phaseUse',
                filterCard: true,
                selectCard: [1, Infinity],
                discard: false,
                lose: false,
                delay: false,
                filterTarget(card, player, target) {
                    return player !== target && !player.getStorage('catrende2').includes(target);
                },
                check(card) {
                    const player = get.player();
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                    if (!ui.selected.cards.length && card.name == 'du') return 20;
                    if (ui.selected.cards.length >= Math.max(2, player.countCards('h') - player.hp)) return 0;
                    if (player.isHealthy() || player.storage.catrende3 || player.countCards('h') <= 1) {
                        if (game.hasPlayer(target => {
                            return target.hasSkill('haoshi') && !target.isTurnedOver() && !target.hasJudge('lebu') && get.attitude(player, target) >= 3 && get.attitude(target, player) >= 3;
                        })) return 11 - get.value(card);
                        if (player.countCards('h') > player.hp) return 10 - get.value(card);
                        if (player.countCards('h') > 2) return 6 - get.value(card);
                        return -1;
                    }
                    return 10 - get.value(card);
                },
                async content(event, trigger, player) {
                    const evt = event.getParent('phaseUse');
                    if (evt?.name === 'phaseUse' && !evt.catrende) {
                        const next = game.createEvent('catrende_clear');
                        event.next.remove(next);
                        evt.after.push(next);
                        evt.catrende = true;
                        next.player = player;
                        next.setContent(function () {
                            delete player.storage.catrende;
                            delete player.storage.catrende2;
                            delete player.storage.catrende3;
                        });
                    }
                    const { target, cards } = event;
                    player.markAuto('catrende2', [target]);
                    await player.give(cards, target);
                    if (!player.storage.catrende3) {
                        player.addMark('catrende', cards.length, false);
                        if (player.countMark('catrende') >= 2) {
                            player.storage.catrende3 = true;
                            const list = get.inpileVCardList(info => {
                                if (info[0] !== 'basic') return false;
                                const card = new lib.element.VCard({ name: info[2], nature: info[3] });
                                return lib.filter.cardUsable(card, player, event.getParent('chooseToUse')) && player.hasUseTarget(card);
                            });
                            if (list.length) {
                                const result = await player.chooseButton(['是否视为使用一张基本牌？', [list, 'vcard']]).set('ai', button => {
                                    const card = new lib.element.VCard({ name: button.link[2], nature: button.link[3] });
                                    return get.player().getUseValue(card);
                                }).forResult();
                                if (result?.bool && result.links?.[0]) {
                                    const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3] });
                                    const next = player.chooseUseTarget(card, true);
                                    if (cards.length > 2) {
                                        next.oncard = function () {
                                            const event = get.event();
                                            event.baseDamage++;
                                            game.log(event.card, '的', '#y伤害值/回复值', '#g+1');
                                        };
                                    }
                                    await next;
                                }
                            }
                        }
                    }
                },
                ai: {
                    threaten: 0.8,
                    fireAttack: true,
                    order(skill, player) {
                        if (player.hp.isDamaged() && !player.storage.catrende3 && player.countMark('catrende') < 2 && player.countCards('h') > 1) return 10;
                        return 4;
                    },
                    result: {
                        target(player, target) {
                            if (target.hasSkillTag('nogain')) return 0;
                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                if (target.hasSkillTag('nodu')) return 0;
                                return -10;
                            }
                            if (target.hasJudge('lebu')) return 0;
                            const nh = target.countCards('h'), np = player.countCards('h');
                            if (player.isHealthy() || player.storage.catrende3 || player.countCards('h') <= 1) {
                                if (nh >= np - 1 && np <= player.hp && !target.hasSkill('haoshi')) return 0;
                            }
                            return Math.max(1, 5 - nh);
                        }
                    },
                    effect: {
                        target(card, player, target) {
                            if (player == target && get.type(card) == 'equip') {
                                if (player.countCards('e', { subtype: get.subtype(card) })) {
                                    if (game.hasPlayer(current => {
                                        return current != player && get.attitude(player, current) > 0;
                                    })) return 0;
                                }
                            }
                        },
                    },
                },
            },
            //诸葛亮
            catguanxing: {
                audio: ['guanxing_re_zhugeliang1.mp3', 'guanxing_re_zhugeliang2.mp3'],
                trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
                filter(event, player) {
                    return event.name !== 'phaseJieshu' || player.hasSkill('catguanxing_on');
                },
                frequent: true,
                async content(event, trigger, player) {
                    const result = await player.chooseToGuanxing(5).set('prompt', '观星：点击或拖动将牌移动到牌堆顶或牌堆底').forResult();
                    if ((!result.bool || !result.moved[0]?.length) && event.triggername == 'phaseZhunbeiBegin') player.addTempSkill('catguanxing_on');
                },
                subSkill: { on: { charlotte: true } },
                ai: { guanxing: true },
            },
            //赵云
            catyajiao: {
                audio: 'reyajiao',
                trigger: { player: ['useCard', 'respond'] },
                filter(event, player) {
                    if (_status.currentPhase === player) return false;
                    return player.hasHistory('lose', evt => {
                        if ((evt.relatedEvent || evt.getParent()) !== event) return false;
                        return event.hs.length > 0;
                    });
                },
                frequent: true,
                async content(event, trigger, player) {
                    const cards = get.cards(1, true);
                    await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                    const result = await player.chooseTarget(`${get.translation(event.name)}：将${get.translation(cards)}交给一名角色`, true).set('ai', target => {
                        const { player, cards } = get.event();
                        return get.attitude(player, target) * cards.reduce((sum, card) => sum + get.value(card), 0);
                    }).set('cards', cards).forResult();
                    if (result?.bool && result.targets?.length) {
                        const target = result.targets[0];
                        player.line(target);
                        const next = target.gain(cards, 'gain2');
                        next.giver = player;
                        await next;
                    }
                },
            },
            //马超
            cattieji: {
                audio: 'retieji',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    return event.card.name === 'sha';
                },
                check(event, player) {
                    return get.attitude(player, event.target) <= 0;
                },
                logTarget: 'target',
                async content(event, trigger, player) {
                    const target = trigger.target;
                    if (!target.hasSkill('fengyin')) target.addTempSkill('fengyin');
                    let result = await player.judge().forResult();
                    const suit = result.suit;
                    if (suit) {
                        result = await target.chooseToDiscard('he', (card, player) => {
                            return get.suit(card) == get.event().suit;
                        }, `${get.translation(event.name)}：弃置一张${get.translation(suit)}牌，否则不能响应${get.translation(trigger.card)}`).set('ai', function (card) {
                            const num = get.event().num;
                            if (!num) return 0;
                            if (card.name === 'shan') return num > 1 ? 2 : 0;
                            return 8 - get.value(card);
                        }).set('suit', suit).set('num', target.countCards('hs', 'shan')).forResult();
                        if (!result?.bool || !result.cards?.length) {
                            trigger.getParent().directHit.add(target);
                            game.log(target, '不能响应', trigger.card);
                        }
                    }
                    const evt2 = trigger.getParent();
                    player.when({ global: 'damageEnd' }).filter(evt => {
                        return evt.card === trigger.card && evt2.addCount !== false;
                    }).step(async (event, trigger, player) => {
                        evt2.addCount = false;
                        const stat = player.stat[player.stat.length - 1].card;
                        if (typeof stat[evt2.card.name] === 'number') stat[evt2.card.name]--;
                        game.log(evt2.card, '不计入次数');
                    });
                },
                ai: {
                    ignoreSkill: true,
                    directHit_ai: true,
                    skillTagFilter(player, tag, arg) {
                        if (!arg || arg.isLink || !arg.card || arg.card.name !== 'sha') return false;
                        const target = arg?.target, skill = arg?.skill;
                        if (!target || get.attitude(player, target) > 0) return false;
                        if (tag === 'directHit_ai') return true;
                        return skill && lib.skill[skill] && lib.skill.fengyin?.skillBlocker(skill, target) && target.getSkills(null, false, false).includes(skill);
                    },
                },
            },
            //黄月英
            catjizhi: {
                audio: 'rejizhi',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return get.type2(event.card) === 'trick';
                },
                frequent: true,
                async content(event, trigger, player) {
                    const result = await player.draw().forResult();
                    if (_status.currentPhase !== player || !result?.cards?.[0]) return;
                    if (get.type(result.cards[0]) === 'basic' && player.countMark('catjizhi_effect') < 3) {
                        player.addTempSkill('catjizhi_effect');
                        player.addMark('catjizhi_effect', 1, false);
                    }
                },
                ai: {
                    threaten: 1.5,
                    noautowuxie: true,
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '手牌上限+#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('catjizhi_effect');
                            },
                        },
                    },
                },
            },
        },
        translate: {
            cat_re_liubei: '刘备',
            catrende: '仁德',
            catrende_info: '出牌阶段，你可以将任意张手牌交给一名其他角色，然后本阶段你不能对其发动此技能。若你本阶段因此给出了至少两张牌，则你可以视为使用一张基本牌（有次数限制，若你本次给出了超出两张牌，则此牌的伤害值/回复值+1）。',
            cat_re_zhugeliang: '诸葛亮',
            catguanxing: '观星',
            catguanxing_info: '准备阶段，你可以观看牌堆顶五张牌，然后以任意顺序放回牌堆顶或牌堆底。若这些牌均放至牌堆底，则你可以在结束阶段再次发动此技能。',
            cat_re_zhaoyun: '赵云',
            catyajiao: '涯角',
            catyajiao_info: '当你于回合外使用或打出手牌时，你可以展示牌堆顶一张牌，然后将此牌交给一名角色。',
            cat_re_machao: '马超',
            cattieji: '铁骑',
            cattieji_info: '当你使用【杀】指定一名角色为目标后，你可以令其本回合非锁定技失效，然后你进行一次判定，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。若此【杀】造成伤害，则此【杀】不计入次数。',
            cat_re_huangyueying: '黄月英',
            catjizhi: '集智',
            catjizhi_info: '当你使用锦囊牌时，你可以摸一张牌。若此牌为基本牌且当前回合角色为你，则你本回合手牌上限+1（至多+3）。',
        },
    };
    for (let i in MX_catcatcup.character) {
        if (Array.isArray(MX_catcatcup.character[i])) MX_catcatcup.character[i] = get.convertedCharacter(MX_catcatcup.character[i]);
        MX_catcatcup.character[i].trashBin ??= [];
        MX_catcatcup.character[i].dieAudios ??= [];
        MX_catcatcup.character[i].tempname ??= [];
        if (!MX_catcatcup.character[i].dieAudios.length) MX_catcatcup.character[i].dieAudios.push(i.slice('cat_'.length));
        if (!MX_catcatcup.character[i].tempname.length) MX_catcatcup.character[i].tempname.push(i.slice('cat_'.length));
        MX_catcatcup.character[i].img = `image/character/${i.slice('cat_'.length)}.jpg`;
        if (MX_catcatcup.translate[i]) {
            MX_catcatcup.translate[i] = `喵喵${MX_catcatcup.translate[i]}`;
            MX_catcatcup.translate[i + '_prefix'] = '喵喵';
        }
    }
    lib.namePrefix.set('喵喵', {
        color: '#fff56a',
        nature: 'IndianRed1',
        showName: '🐱',
    });
    lib.config.all.sgscharacters.push('MX_catcatcup');
    lib.translate['MX_catcatcup_character_config'] = '🐱🐱🏆';
    return MX_catcatcup;
};

export default packs;