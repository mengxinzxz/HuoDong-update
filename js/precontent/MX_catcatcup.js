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
            cat_re_ganning: ['male', 'wu', 4, ['catqixi', 'fenwei']],
            cat_re_lvmeng: ['male', 'wu', 4, ['catkeji', 'catqinxue']],
            cat_re_zhouyu: ['male', 'wu', 3, ['catyingzi', 'catfanjian']],
            cat_re_luxun: ['male', 'wu', 4, ['catqianxun', 'catlianying']],
            cat_re_caocao: ['male', 'wei', 4, ['catjianxiong']],
            cat_re_xiahoudun: ['male', 'wei', 4, ['catganglie', 'new_qingjian']],
            cat_re_xuzhu: ['male', 'wei', 4, ['catluoyi']],
            cat_re_zhenji: ['female', 'wei', 3, ['catluoshen', 'reqingguo']],
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
                audio: 'guanxing',
                audioname: ['re_zhugeliang'],
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
            //甘宁
            catqixi: {
                audio: 'qixi',
                audioname: ['re_ganning'],
                trigger: { global: 'loseAfter' },
                filter(event, player) {
                    if (!player.hasSkill('fenwei', null, null, false) || player.hasSkill('fenwei')) return false;
                    const evt = event.getParent(3);
                    if (evt.player !== player || evt.name !== 'guohe' || evt.type !== 'card') return false;
                    return evt.getParent().skill === 'catqixi_qixi' && event.cards?.some(card => get.suit(card, event.target) === get.suit(evt.card, player));
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    player.restoreSkill('fenwei');
                    player.popup('fenwei');
                    game.log(player, '复原了技能', `#g【${lib.translate['fenwei']}】`);
                },
                group: 'catqixi_qixi',
                subSkill: {
                    qixi: {
                        audio: 'qixi',
                        inherit: 'qixi',
                    },
                },
            },
            //吕蒙
            catkeji: {
                audio: 'keji',
                inherit: 'keji',
                async content(event, trigger, player) {
                    trigger.cancel();
                    if (!player.hasHistory('useCard', evt => evt.isPhaseUsing())) await player.draw(2);
                },
            },
            catqinxue: {
                audio: 'qinxue',
                inherit: 'qinxue',
                trigger: { player: 'phaseZhunbeiBegin' },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    await player.addSkills('gongxin');
                    player.addTempSkill('catqinxue_paoxiao');
                },
                subSkill: {
                    paoxiao: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '使用牌无次数限制' },
                        mod: { cardUsable: () => Infinity },
                    },
                },
            },
            //周瑜
            catyingzi: {
                audio: 'reyingzi',
                inherit: 'reyingzi',
                async content(event, trigger, player) {
                    trigger.num += (1 + (player.countCards('h') < 2));
                },
            },
            catfanjian: {
                audio: 'refanjian',
                inherit: 'refanjian',
                async content(event, trigger, player) {
                    const { cards, target } = event;
                    await player.showCards(cards, `${get.translation(player)}对${get.translation(target)}发动了【${get.translation(event.name)}】`);
                    await player.give(cards, target);
                    let result, card = cards[0];
                    if (!target.countCards('h')) result = { control: '失去体力', index: 1 };
                    else {
                        result = await target.chooseControl('展示手牌', '失去体力').set('card', card).set('ai', () => {
                            const { player, card } = get.event();
                            const cards = player.getCards('he', { color: get.color(card) });
                            if (cards.length === 1) return 0;
                            if (cards.length >= 2 && cards.some(card => get.tag(card, 'save'))) return 1;
                            if (player.hp === 1) return 0;
                            if (cards.some(card => get.value(card) >= 8)) return 1;
                            if (cards.length > 2 && player.hp > 2) return 1;
                            if (cards.length > 3) return 1;
                            return 0;
                        }).set('prompt', `###${get.translation(event.name)}###<div class="text center">展示手牌并弃置所有${get.translation(get.color(card))}牌，或失去1点体力并随机弃置装备区里的一张牌</div>`).forResult();
                    }
                    if (typeof result?.index !== 'number') return;
                    if (result.index === 0) {
                        await target.showHandcards();
                        const cards = target.getDiscardableCards(target, 'he', { color: get.color(card) });
                        if (cards.length > 0) await target.discard(cards);
                    }
                    else {
                        await target.loseHp();
                        const cards = target.getDiscardableCards(target, 'e');
                        if (cards.length > 0) await target.discard(cards.randomGets(1));
                    }
                },
            },
            //陆逊
            catqianxun: {
                audio: 'reqianxun',
                inherit: 'reqianxun',
                filter(event, player) {
                    if (!player.countCards('h')) return false;
                    if (event.getParent().name === 'phaseJudge') return true;
                    if (event.name === 'judge') return false;
                    if (event.targets && event.targets.length > 1) return false;
                    return event.card && event.player !== player && (event.card.name === 'sha' || get.type(event.card) === 'trick');
                },
                check(event, player) {
                    return get.effect(player, event.card, event.player, player) > 0 || !player.hasCard(card => player.canRespond(event, card), 'h');
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (player === target || !target.hasSkill('catlianying') || !target.hasFriend()) return;
                            const type = get.type(card), nh = Math.min(target.countCards(), game.countPlayer(i => get.attitude(target, i) > 0));
                            if (card.name === 'sha' || type === 'trick') {
                                if (!get.tag(card, 'multitarget') || get.info(card).singleCard) {
                                    if (get.tag(card, 'damage')) return [1.5, nh - 1];
                                    return [1, nh];
                                }
                            }
                            else if (type === 'delay') return [0.5, 0.5];
                        },
                    },
                },
            },
            catlianying: {
                audio: 'relianying',
                inherit: 'relianying',
                async cost(event, trigger, player) {
                    const num = trigger.getl(player).hs.length;
                    event.result = await player.chooseTarget(get.prompt(event.skill), `令至多${get.cnNumber(num)}名角色各摸一张牌`, [1, num]).set('ai', target => {
                        const player = get.player();
                        return get.attitude(player, target) + (player === target ? 10 : 0);
                    }).forResult();
                },
                direct: false,
                async content(event, trigger, player) {
                    const targets = [...event.targets].sortBySeat();
                    await game.asyncDraw(targets);
                    await game.delayx();
                    if (player.hasHistory('gain', evt => {
                        if (evt.getParent(2) !== event) return false;
                        return evt.cards?.some(card => get.type(card, null, false) === 'equip');
                    })) await player.draw();
                },
            },
            //曹操
            catjianxiong: {
                inherit: 'new_rejianxiong',
                async content(event, trigger, player) {
                    const goon = get.itemtype(trigger.cards) === 'cards';
                    await player.draw(1 + (!goon), 'nodelay');
                    if (goon && trigger.cards.someInD()) await player.gain(trigger.cards.filterInD(), 'gain2');
                },
            },
            //夏侯惇
            catganglie: {
                audio: 'reganglie',
                inherit: 'reganglie',
                getIndex: event => event.num || 1,
                async content(event, trigger, player) {
                    const source = trigger.source;
                    const result = await player.judge(card => {
                        return get.color(card) === 'red' ? 1 : 0;
                    }).forResult();
                    switch (result?.color) {
                        case 'red':
                            await source.damage();
                            break;
                        case 'black':
                            await player.discardPlayerCard(source, 'he', true);
                            await player.draw();
                            break;
                    }
                },
            },
            //许褚
            catluoyi: {
                inherit: 'new_reluoyi',
                async content(event, trigger, player) {
                    const next = game.cardsGotoOrdering(get.cards(4));
                    await next;
                    const cards2 = next.cards;
                    if (!cards2?.length) return;
                    await player.showCards(cards2, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
                    const cards = cards2.filter(card => {
                        const type = get.type(card);
                        return type === 'basic' || card.name === 'juedou' || (type === 'equip' && get.subtypes(card).includes('equip1'));
                    }), str = `###${get.translation(event.name)}###<div class="text center">是否放弃摸牌，改为获得${cards.length > 0 ? get.translation(cards) : '棍母'}？</div>`;
                    const result = await player.chooseBool(str).set('choice', cards.length >= trigger.num).forResult();
                    if (result?.bool) {
                        trigger.changeToZero();
                        if (cards.length) await player.gain(cards, 'gain2');
                        player.addTempSkill('catluoyi_buff', { player: 'phaseBegin' });
                        player.addMark('catluoyi_buff', 1, false);
                    }
                },
                subSkill: {
                    buff: {
                        charlotte: true,
                        intro: { content: '【杀】和【决斗】造成的伤害+1' },
                        init(player, skill) {
                            player.addTip(skill, get.translation(skill));
                        },
                        onremove(player, skill) {
                            player.removeTip(skill);
                            delete player.storage[skill];
                        },
                        audio: 'reluoyi',
                        trigger: { source: 'damageBegin1' },
                        filter(event, player) {
                            return event.card && (event.card.name === 'sha' || event.card.name === 'juedou') && event.notLink();
                        },
                        forced: true,
                        logTarget: 'player',
                        async content(event, trigger, player) {
                            trigger.num += player.countMark(event.name);
                        },
                        ai: {
                            damageBonus: true,
                            skillTagFilter(player, tag, arg) {
                                return arg?.card && (arg.card.name === 'sha' || arg.card.name === 'juedou');
                            },
                        },
                    },
                },
            },
            //甄姬
            catluoshen: {
                audio: 'reluoshen',
                trigger: { player: 'phaseZhunbeiBegin' },
                frequent: true,
                async content(event, trigger, player) {
                    while (true) {
                        const result = await player.judge(card => {
                            return get.color(card) === 'black' ? 1 : -1;
                        }).set('callback', function () {
                            if (get.position(card, true) === 'o') {
                                player.addTempSkill('catluoshen_effect');
                                player.gain(card, 'gain2').gaintag.add('catluoshen_effect');
                            }
                        }).forResult();
                        if (result?.bool) {
                            const result2 = await player.chooseBool(`${get.translation(event.name)}：是否继续进行判定？`).set('frequentSkill', event.name).forResult();
                            if (result2?.bool) continue;
                        }
                        break;
                    }
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        onremove(player, skill) {
                            player.removeGaintag(skill);
                        },
                        mod: {
                            ignoredHandcard(card, player) {
                                if (card.hasGaintag('catluoshen_effect')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name === 'phaseDiscard' && card.hasGaintag('catluoshen_effect')) return false;
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
            cat_re_ganning: '甘宁',
            catqixi: '奇袭',
            catqixi_info: `你可以将一张黑色牌当作【过河拆桥】使用。你因以此法转化的【过河拆桥】弃置了与此牌花色相同的牌后重置${get.poptip('fenwei')}。`,
            cat_re_lvmeng: '吕蒙',
            catkeji: '克己',
            catkeji_info: '若你未于本回合出牌阶段使用或打出过【杀】，则你可以跳过弃牌阶段；若你未于本回合出牌阶段使用过牌，则你再摸两张牌。',
            catqinxue: '勤学',
            catqinxue_info: `觉醒技，准备阶段，若你的手牌数减体力值大于等于2，则你减1点体力上限，获得技能${get.poptip('gongxin')}，且本回合使用牌无次数限制。`,
            cat_re_zhouyu: '周瑜',
            catyingzi: '英姿',
            catyingzi_info: '锁定技。你的手牌上限视为你的体力上限；摸牌阶段，你额外摸一张牌（若你的手牌数小于2则改为额外摸两张牌）。',
            catfanjian: '反间',
            catfanjian_info: '出牌阶段限一次，你可以展示一张手牌并交给一名其他角色，其选择一项：①展示所有手牌，弃置所有与此牌颜色相同的牌；②失去1点体力，随机弃置装备区里的一张牌。',
            cat_re_luxun: '陆逊',
            catqianxun: '谦逊',
            catqianxun_info: '当其他角色使用的锦囊牌或【杀】对你生效时，若你是此牌的唯一目标，则你可以将所有手牌置于你的武将牌上直到回合结束。',
            catlianying: '连营',
            catlianying_info: '当你失去最后的手牌后，你可以令至多X名角色各摸一张牌（X为你此次失去的手牌数）；若你因此获得了装备牌，则你再摸一张牌。',
            cat_re_caocao: '曹操',
            catjianxiong: '奸雄',
            catjianxiong_info: '当你受到伤害后，你可以摸一张牌并获得对你造成伤害的牌（若没有造成伤害的牌则改为摸两张牌）。',
            cat_re_xiahoudun: '夏侯惇',
            catganglie: '刚烈',
            catganglie_info: '当你受到1点有来源造成的伤害后，你可进行判定，若结果为：红色，你对伤害来源造成1点伤害；黑色，你弃置伤害来源一张牌并摸一张牌。',
            cat_re_xuzhu: '许褚',
            catluoyi: '裸衣',
            catluoyi_info: '摸牌阶段开始时，你亮出牌堆顶四张牌。然后你可以获得其中的基本牌、武器牌和【决斗】，若如此做，你放弃摸牌，且以你为伤害来源的【杀】或【决斗】造成的伤害+1直到你的下回合开始。',
            cat_re_zhenji: '甄姬',
            catluoshen: '洛神',
            catluoshen_info: '准备阶段，你可以进行判定并获得判定牌（本回合不计入手牌上限），若判定结果为黑色，你可重复此流程。',
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