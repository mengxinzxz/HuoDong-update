import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MX_catcatcup = {
        name: 'MX_catcatcup',
        connect: true,
        characterSort: {
            MX_catcatcup: {
                cat_shuhanhujiang: ['cat_re_zhaoyun', 'cat_re_machao'],
                cat_xianmingjunzhu: ['cat_re_liubei', 'cat_re_caocao'],
                cat_yongguansanjun: ['cat_re_ganning', 'cat_re_lvmeng', 'cat_re_xiahoudun', 'cat_re_xuzhu'],
                cat_weiwoqianli: ['cat_re_zhugeliang', 'cat_re_zhouyu', 'cat_re_luxun', 'cat_re_huatuo'],
                cat_jinguohongyan: ['cat_re_huangyueying', 'cat_re_zhenji', 'cat_re_diaochan'],
                cat_shenhua_feng: ['cat_re_weiyan', 'cat_ol_xiahouyuan', 'cat_xiaoqiao', 'cat_re_yuji', 'cat_sp_zhangjiao'],
                cat_shenhua_huo: ['cat_dianwei', 'cat_pangtong', 'cat_sp_zhugeliang', 'cat_taishici', 'cat_pangde', 'cat_re_yuanshao'],
                cat_shenhua_lin: ['cat_ol_xuhuang', 'cat_sunjian', 'cat_zhurong', 'cat_jiaxu', 'cat_re_lusu'],
                cat_shenhua_yin: ['cat_yanyan', 'cat_wangping', 'cat_sunliang', 'cat_wangji', 'cat_kuailiangkuaiyue', 'cat_yl_luzhi'],
                cat_shenhua_lei: ['cat_chendao', 'cat_guanqiujian', 'cat_yl_yuanshu'],
            },
        },
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
            cat_re_huatuo: ['male', 'qun', 3, ['catqingnang', 'jijiu']],
            cat_re_diaochan: ['female', 'qun', 3, ['lijian', 'catbiyue']],
            cat_re_weiyan: ['male', 'shu', 4, ['xinkuanggu', 'catqimou']],
            cat_ol_xiahouyuan: ['male', 'wei', 4, ['catshensu', 'shebian']],
            cat_xiaoqiao: ['female', 'wu', 3, ['xintianxiang', 'cathongyan']],
            cat_sp_zhangjiao: ['male', 'qun', 3, ['catleiji', 'guidao']],
            cat_re_yuji: ['male', 'qun', 3, ['catguhuo']],
            cat_dianwei: ['male', 'wei', 4, ['catqiangxi']],
            //荀彧为OL界荀彧
            cat_pangtong: ['male', 'shu', 3, ['catlianhuan', 'catniepan']],
            cat_sp_zhugeliang: ['male', 'shu', 3, ['catbazhen', 'cathuoji', 'rekanpo']],
            cat_taishici: ['male', 'wu', 4, ['cattianyi']],
            cat_pangde: ['male', 'qun', 4, ['mashu', 'catjianchu']],
            //颜良文丑为手杀界颜良文丑
            cat_re_yuanshao: ['male', 'qun', 4, ['luanji', 'catqingchao']],
            cat_ol_xuhuang: ['male', 'wei', 4, ['olduanliang', 'catjiezi']],
            //曹丕为手杀界曹丕
            cat_sunjian: ['male', 'wu', 5, ['gzyinghun']],
            //董卓为OL界董卓
            cat_zhurong: ['female', 'shu', 4, ['juxiang', 'catlieren']],
            cat_jiaxu: ['male', 'qun', 3, ['wansha', 'catluanwu', 'catweimu']],
            cat_re_lusu: ['male', 'wu', 3, ['cathaoshi', 'dimeng']],
            cat_yanyan: ['male', 'shu', 4, ['catjuzhan']],
            cat_wangping: ['male', 'shu', 4, ['catfeijun', 'catbinglve']],
            cat_sunliang: ['male', 'wu', 3, ['catkuizhu', 'catchezheng']],
            cat_wangji: ['male', 'wei', 3, ['catqizhi', 'catjinqu']],
            cat_kuailiangkuaiyue: ['male', 'wei', 3, ['nzry_jianxiang', 'catshenshi']],
            cat_yl_luzhi: ['male', 'qun', 3, ['catmingren', 'catzhenliang']],
            cat_chendao: ['male', 'shu', 4, ['catwanglie']],
            //周妃为欢乐杀周妃
            cat_guanqiujian: ['male', 'wei', 4, ['catzhengrong', 'cathongju']],
            cat_yl_yuanshu: ['male', 'qun', 4, ['catyongsi']],
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
            //华佗
            catqingnang: {
                audio: 'new_reqingnang',
                inherit: 'new_reqingnang',
                usable: 1,
                filter(event, player) {
                    const info = lib.skill.catqingnang;
                    if (!player.hasCard(card => info.filterCard(card, player), info.position)) return false;
                    return game.hasPlayer(target => info.filterTarget(null, player, target));
                },
                filterCard: lib.filter.cardDiscardable,
                position: 'he',
                filterTarget(card, player, target) {
                    return target.isDamaged();
                },
                async content(event, trigger, player) {
                    const { cards, target } = event;
                    await target.recover();
                    if (get.color(cards[0], player) === 'red') {
                        if (typeof player.getStat('skill')?.[event.name] === 'number') delete player.getStat('skill')[event.name];
                    }
                },
            },
            //貂蝉
            catbiyue: {
                audio: 'rebiyue',
                inherit: 'rebiyue',
                async content(event, trigger, player) {
                    await player.draw(1 + (player.countCards('h') < player.getHp()));
                },
            },
            //魏延
            catqimou: {
                limited: true,
                audio: 'qimou',
                enable: 'phaseUse',
                filter(event, player) {
                    return player.hp > 0;
                },
                chooseButton: {
                    dialog(event, player) {
                        return ui.create.dialog(`###${get.translation('catqimou')}###<div class="text center">${get.translation('catqimou_info')}</div>`);
                    },
                    chooseControl(event, player) {
                        return [...Array.from({ length: player.hp }).map((_, index) => `${index + 1}点`), 'cancel2'];
                    },
                    check(event, player) {
                        let num = player.hp - 1;
                        if (player.hasCard(card => player.canSaveCard(card, player), 'hs')) num = player.hp;
                        return num > 0 ? `${num}点` : 'cancel2';
                    },
                    prompt(result) {
                        const str = '失去X点体力，本回合你计算与其他角色的距离-X，且你可以多使用X张【杀】，且你因【杀】造成伤害发动【狂骨】时可多摸一张牌。';
                        return `###${get.translation('catqimou')}###<div class="text center">${str.replaceAll('X', result.control.slice(0, -1))}</div>`;
                    },
                    backup(result) {
                        return {
                            audio: 'qimou',
                            number: Number(result.control.slice(0, -1)),
                            skillAnimation: true,
                            animationColor: 'orange',
                            async content(event, trigger, player) {
                                player.awakenSkill('catqimou');
                                const num = lib.skill[event.name].number;
                                await player.loseHp(num);
                                player.addTempSkill('catqimou_effect');
                                player.addMark('catqimou_effect', num, false);
                            },
                        };
                    },
                },
                ai: {
                    order: 14,
                    result: {
                        player(player) {
                            if (player.hp < 3) return false;
                            let mindist = player.hp;
                            if (player.hasCard(card => player.canSaveCard(card, player), 'hs')) mindist++;
                            return game.countPlayer(current => {
                                if (get.distance(player, current) > mindist) return false;
                                return player.countCards('hs', card => {
                                    if (get.name(card) !== 'sha') return false;
                                    return player.canUse(card, current, false) && get.effect(current, card, player, player) > 0;
                                }) >= mindist - 1;
                            });
                        },
                    },
                },
                subSkill: {
                    backup: {},
                    effect: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '计算与其他角色的距离-#，可以多使用#张【杀】，因【杀】造成伤害发动【狂骨】时可多摸一张牌' },
                        mod: {
                            cardUsable(card, player, num) {
                                if (card.name === 'sha') return num + player.countMark('catqimou_effect');
                            },
                            globalFrom(from, to, distance) {
                                return distance - from.countMark('catqimou_effect');
                            },
                        },
                        audio: 'qimou',
                        trigger: { player: 'gainAfter' },
                        filter(event, player) {
                            if (event.getParent().name !== 'draw' || event.getParent(2).name !== 'chooseDrawRecover') return false;
                            return event.getParent(2).logSkill === 'xinkuanggu' && event.getParent(3)._trigger.card?.name === 'sha';
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            await player.draw();
                        },
                    },
                },
            },
            //夏侯渊
            catshensu: {
                audio: 'shensu1',
                audioname: ['xiahouba', 're_xiahouyuan', 'ol_xiahouyuan'],
                trigger: { player: ['phaseJudgeBefore', 'phaseUseBefore', 'phaseDiscardBefore'] },
                filter(event, player) {
                    const card = new lib.element.VCard({ name: 'sha' });
                    if (!game.hasPlayer(target => {
                        if (target === player) return false;
                        return player.canUse(card, target, false);
                    })) return false;//免得一些神必技能能让自己对自己出杀
                    return event.name !== 'phaseUse' || player.hasCard(card => {
                        if (get.position(card) === 'h' && _status.connectMode) return true;
                        return get.type(card) !== 'basic' && lib.filter.cardDiscardable(card, player);
                    }, 'he');
                },
                async cost(event, trigger, player) {
                    const str = (() => {
                        let str = `跳过${['判定阶段和摸牌', '出牌', '弃牌'][lib.skill[event.skill].trigger.player.indexOf(event.triggername)]}阶段`;
                        switch (trigger.name) {
                            case 'phaseUse': str += '并弃置一张非基本牌'; break;
                            case 'phaseDiscard': str += '并翻面'; break;
                        }
                        return `${str}，视为对一名其他角色使用一张无距离限制的【杀】并摸一张牌。`;
                    })();
                    event.result = await player.chooseCardTarget({
                        prompt: get.prompt(event.skill),
                        prompt2: str,
                        filterCard(card, player) {
                            if (get.event().getTrigger().name !== 'phaseUse') return false;
                            return get.type(card) !== 'basic' && lib.filter.cardDiscardable(card, player);
                        },
                        selectCard() {
                            return get.event().getTrigger().name === 'phaseUse' ? 1 : -1;
                        },
                        filterTarget(牢骚哥经典沉睡, player, target) {
                            const card = new lib.element.VCard({ name: 'sha' });
                            return target !== player && player.canUse(card, target, false);
                        },
                        ai1(card) {
                            if (!get.event().check) return -1;
                            return 7 - get.value(card);
                        },
                        ai2(target) {
                            const { player, check } = get.event();
                            if (!check) return -1;
                            return get.effect(target, new lib.element.VCard({ name: 'sha' }), player, player);
                        },
                        check: (() => {
                            switch (trigger.name) {
                                case 'phaseJudge': return player.countCards('h') > 2;
                                case 'phaseUse': return player.needsToDiscard();
                                case 'phaseDiscard': return player.needsToDiscard() || player.isTurnedOver() || (player.hasSkill('shebian') && player.canMoveCard(true, true));
                            }
                        })(),
                    }).setHiddenSkill(event.skill).forResult();
                },
                preHidden: true,
                async content(event, trigger, player) {
                    trigger.cancel();
                    switch (trigger.name) {
                        case 'phaseJudge': player.skip('phaseDraw'); break;
                        case 'phaseUse': event.cards?.length && await player.discard(event.cards); break;
                        case 'phaseDiscard': await player.turnOver(); break;
                    }
                    const card = new lib.element.VCard({ name: 'sha' }), target = event.targets[0];
                    if (player.canUse(card, target, false)) {
                        const next = player.useCard(card, target, false);
                        next.audio = false;
                        player.when('useCard').filter(evt => evt === next).then(() => player.draw());
                        await next;
                    }
                },
            },
            //小乔
            cathongyan: {
                audio: 'hongyan',
                mod: {
                    suit(card, suit) {
                        if (suit === 'spade') return 'heart';
                    },
                    maxHandcard(player, num) {
                        if (player.countCards('e') > 0) return num + 2;
                    },
                },
            },
            //张角
            catleiji: {
                audio: 'releiji',
                inherit: 'releiji',
                trigger: { player: ['useCard', 'respond', 'addJudgeEnd'] },
                filter(event, player) {
                    return event.card.name === (event.name === 'addJudge' ? 'shandian' : 'shan');
                },
                ai: {
                    useShan: true,
                    effect: {
                        target_use(card, player, target, current) {
                            return lib.skill.xinleiji.ai.effect.target_use(card, player, target, current);
                        },
                    },
                },
            },
            //于吉
            catguhuo: {
                audio: 'xinfu_guhuo',
                derivation: 'chanyuan',
                enable: ['chooseToUse', 'chooseToRespond'],
                hiddenCard(player, name) {
                    if (player.isTempBanned('catguhuo') || !player.countCards('hs')) return false;
                    return get.inpileVCardList(info => {
                        if (player.getStorage('catguhuo_used').includes(info[2])) return false;
                        return info[0] === 'basic' || info[0] === 'trick';
                    }).map(info => info[2]).includes(name);
                },
                filter(event, player) {
                    return get.inpileVCardList(info => {
                        if (player.getStorage('catguhuo_used').includes(info[2])) return false;
                        return info[0] === 'basic' || info[0] === 'trick';
                    }).filter(info => {
                        const vcard = { name: info[2], nature: info[3] };
                        return player.hasCard(card => event.filterCard(get.autoViewAs(vcard, [card]), player, event), 'hs');
                    });
                },
                chooseButton: {
                    dialog(event, player) {
                        const dialog = ui.create.dialog('蛊惑', [get.inpileVCardList(info => {
                            if (player.getStorage('catguhuo_used').includes(info[2])) return false;
                            return info[0] === 'basic' || info[0] === 'trick';
                        }).filter(info => {
                            const vcard = { name: info[2], nature: info[3] };
                            return player.hasCard(card => event.filterCard(get.autoViewAs(vcard, [card]), player, event), 'hs');
                        }), 'vcard']);
                        dialog.direct = true;
                        return dialog;
                    },
                    check(button) {
                        const event = get.event(), player = event.player, rand = event.getParent().getRand('catguhuo');
                        const card = new lib.element.VCard({ name: button.link[2], nature: button.link[3] });
                        const val = event.getParent().type === 'phase' ? player.getUseValue(card) : 1;
                        if (val <= 0) return 0;
                        if (game.hasPlayer(current => {
                            return current !== player && !current.hasSkill('chanyuan') && (get.realAttitude || get.attitude)(current, player) < 0;
                        }) && rand > 0.3) {
                            if (!player.countCards('h', cardx => {
                                if (card.name === cardx.name) {
                                    if (card.name !== 'sha') return true;
                                    return get.is.sameNature(card, cardx);
                                }
                                return false;
                            })) return 0;
                            return 3 * val;
                        }
                        return val;
                    },
                    prompt(links) {
                        const link = links[0], name = link[2], nature = link[3];
                        return `###${get.translation('catguhuo')}###<div class="text center">将一张手牌当作${lib.translate[nature] ?? ''}${lib.translate[name] ?? ''}使用</div>`;
                    },
                    backup(links) {
                        return {
                            audio: 'xinfu_guhuo',
                            filterCard(card, player, target) {
                                let result = true;
                                let suit = card.suit, number = card.number;
                                card.suit = 'none';
                                card.number = null;
                                let mod = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                                if (mod != 'unchanged') result = mod;
                                card.suit = suit;
                                card.number = number;
                                return result;
                            },
                            position: 'hs',
                            viewAs: {
                                name: links[0][2],
                                nature: links[0][3],
                                suit: 'none',
                                number: null,
                            },
                            ignoreMod: true,
                            ai1(card) {
                                const event = get.event(), player = event.player, rand = event.getRand('catguhuo');
                                if (game.hasPlayer(current => {
                                    return current !== player && !current.hasSkill('chanyuan') && (get.realAttitude || get.attitude)(current, player) < 0;
                                }) && rand > 0.3) {
                                    const cardx = lib.skill.catguhuo_backup.viewAs;
                                    if (card.name === cardx.name && (card.name !== 'sha' || get.is.sameNature(card, cardx))) return 10;
                                    return 0;
                                }
                                return 6 - get.value(card);
                            },
                            log: false,
                            popname: true,
                            async precontent(event, trigger, player) {
                                const { result } = event;
                                player.logSkill('catguhuo');
                                player.addTempSkill('catguhuo_guess');
                                player.addTempSkill('catguhuo_used');
                                player.markAuto('catguhuo_used', [event.result.card.name]);
                                const card = result.cards[0];
                                result.card.suit = get.suit(card);
                                result.card.number = get.number(card);
                            },
                        };
                    },
                },
                ai: {
                    save: true,
                    respondSha: true,
                    respondShan: true,
                    skillTagFilter(player, tag, arg) {
                        if (player.isTempBanned('catguhuo')) return false;
                        const hiddenCard = lib.skill.catguhuo.hiddenCard;
                        if (tag === 'save') return hiddenCard(player, 'tao') || (arg && hiddenCard(player, 'jiu') && (arg === player || player.hasSkillTag('jiuOther', null, arg, true)));
                        return hiddenCard(player, tag === 'respondSha' ? 'sha' : 'shan');
                    },
                    order: 10,
                    result: {
                        player(player, target) {
                            if (_status.event.dying) return get.attitude(player, _status.event.dying);
                            return 1;
                        },
                    },
                },
                subSkill: {
                    backup: {},
                    used: {
                        charlotte: true,
                        onremove: true,
                    },
                    guess: {
                        charlotte: true,
                        trigger: { player: ['useCardBefore', 'respondBefore'] },
                        filter(event, player) {
                            return event.skill === 'catguhuo_backup';
                        },
                        silent: true,
                        firstDo: true,
                        async content(event, trigger, player) {
                            const card = trigger.cards[0], fake = card.name !== trigger.card.name || (card.name === 'sha' && !get.is.sameNature(trigger.card, card));
                            trigger.card.number = get.number(card);
                            trigger.card.suit = get.suit(card);
                            const cardTranslate = `${get.translation(trigger.card.nature) || ''}${get.translation(trigger.card.name)}`;
                            player.$throw(trigger.cards.length);
                            player.popup(cardTranslate, trigger.name === 'useCard' ? 'metal' : 'wood');
                            player.line(trigger.targets, get.nature(trigger.card));
                            await player.lose(card, ui.ordering).set('relatedEvent', trigger);
                            game.log(player, '声明了', '#y' + cardTranslate);
                            const targets = game.filterPlayer(current => {
                                return current !== player && !current.hasSkill('chanyuan');
                            }).sortBySeat();
                            let faker;
                            if (targets.length > 0) {
                                for (const target of targets) {
                                    const result = await target.chooseBool(`${get.translation(event.name)}：是否质疑${get.translation(player)}声明的${cardTranslate}？`).set('choice', (() => {
                                        if (target.hp <= 1 || (get.realAttitude || get.attitude)(target, player) >= 0) return false;
                                        return Math.random() <= 0.5;
                                    })()).forResult();
                                    const bool = result?.bool;
                                    target.chat(bool ? '质疑！' : '不质疑');
                                    target.popup(bool ? '质疑' : '不质疑', bool ? 'fire' : 'wood');
                                    game.log(target, bool ? '#y质疑' : '#g不质疑');
                                    await game.delayx();
                                    if (result?.bool) {
                                        target.addExpose(0.2);
                                        faker = target;
                                        break;
                                    }
                                }
                            }
                            await player.showCards(trigger.cards, `${get.translation(player)}发动【${get.translation(event.name)}】扣置`);
                            if (faker?.isIn()) {
                                if (fake) {
                                    faker.popup('质疑正确', 'wood');
                                    game.log(player, '声明的', trigger.card, '作废了');
                                    player.tempBanSkill('catguhuo', null, false);
                                    trigger.cancel();
                                    trigger.getParent().goto(0);
                                    trigger.line = false;
                                }
                                else {
                                    faker.popup('质疑错误', 'fire');
                                    await faker.addSkills('chanyuan');
                                }
                            }
                            await game.delayx();
                        },
                    },
                },
            },
            //典韦
            catqiangxi: {
                audio: 'qiangxi',
                inherit: 'reqiangxi',
                filter(event, player) {
                    return game.hasPlayer(target => lib.skill.catqiangxi.filterTarget(null, player, target));
                },
                filterTarget(card, player, target) {
                    if (target === player || player.getStorage('catqiangxi_used').includes(target)) return false;
                    return player.inRange(target);
                },
                filterCard(card, player) {
                    return get.subtypes(card).includes('equip1') && lib.filter.cardDiscardable(card, player);
                },
                async content(event, trigger, player) {
                    const { cards, target } = event;
                    player.addTempSkill('catqiangxi_used', 'phaseUseAfter');
                    player.markAuto('catqiangxi_used', [target]);
                    if (!cards.length) await player.loseHp();
                    await target.damage('nocard');
                    if (target.hasHistory('damage', evt => {
                        return evt.getParent(event.name) == event && evt._dyinged;
                    })) await player.recover();
                },
                ai: {
                    order: 8.5,
                    result: {
                        target(player, target) {
                            if (!ui.selected.cards.length) {
                                if (player.hp < 2) return 0;
                                if (target.hp >= Math.max(2, player.hp)) return 0;
                            }
                            return get.damageEffect(target, player) * (target.hp <= 1 ? 3 : 1);
                        },
                    },
                },
                subSkill: {
                    used: {
                        charlotte: true,
                        onremove: true,
                    },
                },
            },
            //庞统
            catlianhuan: {
                audio: 'lianhuan',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    if (!event.isFirstTarget || event.card.name !== 'tiesuo') return false;
                    return event.targets.some(target => target.countDiscardableCards(player, 'e') > 0);
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), (card, player, target) => {
                        return get.event().targets.includes(target) && target.countDiscardableCards(player, 'e') > 0;
                    }, '弃置其中一名目标角色装备区里的一张牌').set('ai', target => {
                        const player = get.player();
                        return get.effect(target, { name: 'guohe_copy', position: 'e' }, player, player);
                    }).set('targets', trigger.targets).forResult();
                },
                async content(event, trigger, player) {
                    await player.discardPlayerCard(event.targets[0], 'e', true);
                },
                ai: {
                    effect: {
                        player_use(card, player, target) {
                            if (card?.name === 'tiesuo' && target?.countDiscardableCards(player, 'e') > 0) {
                                return [1, Math.max(get.effect(target, { name: 'guohe_copy', position: 'e' }, player, player), 0)];
                            }
                        },
                    },
                },
                group: 'catlianhuan_lianhuan',
                subSkill: {
                    lianhuan: {
                        audio: 'lianhuan',
                        inherit: 'lianhuan',
                        enable: 'phaseUse',
                        hiddenCard: () => false,
                        filter(event, player) {
                            return player.hasCard(card => lib.skill.lianhuan.filterCard(card, player, event), 'hes');
                        },
                        position: 'hes',
                        prompt: () => '将一张♣牌当作【铁索连环】使用或重铸',
                    },
                },
            },
            catniepan: {
                audio: 'niepan',
                inherit: 'oldniepan',
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.discard(player.getCards('hej'));
                    await player.link(false);
                    await player.turnOver(false);
                    await player.draw(3);
                    await player.recoverTo(3);
                    player.addTempSkill('catniepan_effect');
                },
                ai: {
                    order: 1,
                    skillTagFilter(player, arg, target) {
                        if (player !== target || player.storage.catniepan) return false;
                    },
                    save: true,
                    result: {
                        player(player) {
                            if (player.hp <= 0) return 10;
                            if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
                            return 0;
                        },
                    },
                    threaten(player, target) {
                        if (!target.storage.catniepan) return 0.6;
                    },
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '不能成为其他角色使用牌的目标' },
                        mod: {
                            targetEnabled(card, player, target) {
                                if (player !== target) return false;
                            },
                        },
                    },
                },
            },
            //卧龙诸葛
            catbazhen: {
                audio: 'bazhen',
                trigger: { player: 'judgeEnd' },
                filter(event, player) {
                    const card = event.result.card;
                    if (get.position(card, true) !== 'o') return false;
                    return get.color(card, player) === 'black' && event.skill?.includes('bagua');
                },
                forced: true,
                content() {
                    player.gain(trigger.result.card, 'gain2');
                },
                init(player, skill) {
                    player.addExtraEquip(skill, 'bagua', true, player => player.hasEmptySlot(2) && lib.card['bagua']);
                },
                onremove(player, skill) {
                    player.removeExtraEquip(skill);
                },
                group: 'bazhen_bagua',
            },
            cathuoji: {
                audio: 'huoji',
                trigger: { global: 'dying' },
                filter(event, player) {
                    if (!event.reason) return false;
                    const evt = event.reason.getParent();
                    return evt.name === 'huogong' && evt.type === 'card' && evt.player === player;
                },
                forced: true,
                locked: false,
                logTarget: 'player',
                async content(event, trigger, player) {
                    trigger.player.addTempSkill('cathuoji_effect');
                    trigger.player.markAuto('cathuoji_effect', [trigger]);
                },
                group: 'cathuoji_huoji',
                subSkill: {
                    huoji: {
                        audio: 'huoji',
                        inherit: 'rehuoji',
                    },
                    effect: {
                        charlotte: true,
                        mod: {
                            cardSavable(card, player) {
                                if (!['tao', 'jiu'].includes(card.name)) return;
                                const evt = _status.event?.getParent('dying', true);
                                if (evt && player.getStorage('cathuoji_effect').includes(evt)) return false;
                            },
                        },
                    },
                },
            },
            //太史慈
            cattianyi: {
                audio: 'tianyi',
                inherit: 'tianyi',
                async content(event, trigger, player) {
                    const result = await player.chooseToCompare(event.target).forResult();
                    if (result?.bool) player.addTempSkill('tianyi2');
                    else {
                        const cards = [result.player, result.target].filterInD('d');
                        if (cards.length) await player.gain(cards, 'gain2');
                        player.addTempSkill('tianyi3');
                    }
                },
            },
            //庞德
            catjianchu: {
                audio: 'jianchu',
                inherit: 'jianchu',
                async cost(event, trigger, player) {
                    const list = [event.skill, trigger.target];
                    const next = player.discardPlayerCard(trigger.target, get.prompt2(...list), 'he');
                    next.set('att', get.attitude(player, trigger.target) <= 0);
                    next.set('ai', button => {
                        if (!_status.event.att) return 0;
                        const card = button.link;
                        if (get.position(card) !== 'e') return 1;
                        return get.value(card) * (get.subtypes(card).includes('equip2') ? 5 : 1);
                    });
                    next.logSkill = list;
                    event.result = await next.forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    const target = trigger.target, evt = trigger.getParent();
                    switch (get.type2(event.cards[0], target)) {
                        case 'basic':
                            if (evt.cards?.someInD('od')) await target.gain(evt.cards.filterInD('od'), 'gain2');
                            break;
                        case 'trick':
                            evt.baseDamage++;
                            game.log(evt.card, '造成的伤害', '#y+1');
                            break;
                        case 'equip':
                            evt.directHit.add(target);
                            game.log(target, '不可响应', evt.card);
                            break;
                    }
                },
            },
            //袁绍
            catqingchao: {
                audio: 'xueyi',
                trigger: {
                    player: ['phaseUseBegin', 'loseAfter'],
                    global: ['loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    if (player.countCards('h') >= 2 || player.hasSkill('catqingchao_used') || !player.isPhaseUsing()) return false;
                    let gain = 0, lose = 0;
                    if (event.getg) gain = event.getg(player).length;
                    if (event.getl) lose = event.getl(player).hs.length;
                    return gain !== lose;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt2(event.skill)).set('ai', target => {
                        const player = get.player();
                        return get.damageEffect(target, player, player);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    player.addTempSkill('catqingchao_used', 'phaseUseAfter');
                    await event.targets[0].damage();
                },
            },
            //徐晃
            catjiezi: {
                audio: 'oljiezi',
                inherit: 'jiezi',
                logTarget: 'player',
                async content(event, trigger, player) {
                    await player.draw(1 + (get.distance(player, trigger.player) <= 1));
                },
            },
            //祝融
            catlieren: {
                audio: 'lieren',
                trigger: { player: 'useCardAfter' },
                filter(event, player) {
                    return event.targets?.[0]?.isIn() && player.canCompare(event.targets[0]);
                },
                check(event, player) {
                    return get.attitude(player, event.targets[0]) < 0 && player.countCards('h') > 1;
                },
                logTarget: event => event.targets[0],
                async content(event, trigger, player) {
                    const target = trigger.targets[0];
                    const result = await player.chooseToCompare(target).forResult();
                    if (result?.bool) await player.gainPlayerCard(target, true, 'he');
                },
            },
            //贾诩
            catluanwu: {
                audio: 'luanwu',
                inherit: 'luanwu',
                multitarget: true,
                async content(event, trigger, player) {
                    for (const target of game.filterPlayer().sortBySeat()) {
                        if (target === player) continue;
                        const result = await target.chooseToUse('乱武：使用一张杀或失去1点体力', function (card) {
                            if (get.name(card) !== 'sha') return false;
                            return lib.filter.cardEnabled.apply(this, arguments);
                        }, function (card, player, target) {
                            if (target == player) return false;
                            const dist = get.distance(player, target);
                            if (dist > 1) {
                                if (game.hasPlayer(current => {
                                    return current !== player && get.distance(player, current) < dist;
                                })) return false;
                            }
                            return lib.filter.filterTarget.apply(this, arguments);
                        }).set('ai2', function () {
                            return get.effect_use.apply(this, arguments) + 0.01;
                        }).set('addCount', false).forResult();
                        if (!result?.bool) {
                            await target.loseHp();
                            await player.discardPlayerCard(target, 'he');
                        }
                        await game.delayx();
                    }
                },
            },
            catweimu: {
                audio: 'weimu',
                inherit: 'weimu',
                group: 'catweimu_damage',
                subSkill: {
                    damage: {
                        audio: 'weimu',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            return event.source?.isIn() && event.source !== _status.currentPhase;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            await player.draw(2);
                        },
                        ai: {
                            maixie: true,
                            maixie_hp: true,
                            threaten: 0.75,
                            effect: {
                                target(card, player, target) {
                                    if (player !== _status.currentPhase && get.tag(card, 'damage')) {
                                        if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                        let num = 1;
                                        if (get.attitude(player, target) > 0) num = player.needsToDiscard() ? 0.7 : 0.5;
                                        if (target.hp >= 4) return [1, num * 2];
                                        if (target.hp == 3) return [1, num * 1.5];
                                        if (target.hp == 2) return [1, num * 0.5];
                                    }
                                },
                            },
                        },
                    },
                },
            },
            //鲁肃
            cathaoshi: {
                audio: 'haoshi',
                inherit: 'haoshi',
                check(event, player) {
                    if (player.countCards('h') + event.num <= 3) return true;
                    return game.hasPlayer(current => current !== player && get.attitude(player, current) > 0);
                },
                content() {
                    trigger.num += 2;
                    player.addSkill('cathaoshi_effect');
                },
                subSkill: {
                    effect: {
                        charlotte: true,
                        trigger: { player: 'phaseDrawEnd' },
                        forced: true,
                        popup: false,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                            if (player.countCards('h') <= 5) return;
                            const result = await player.chooseCardTarget({
                                filterCard: true,
                                selectCard: Math.floor(player.countCards('h') / 2),
                                posption: 'h',
                                filterTarget: lib.filter.notMe,
                                prompt: '好施：将一半手牌交给一名其他角色',
                                forced: true,
                                ai1() {
                                    return 1 + Math.random();
                                },
                                ai2(target) {
                                    return get.attitude(_status.event.player, target);
                                },
                            }).forResult();
                            if (result?.bool && result.cards?.length && result.targets?.length) {
                                await player.give(result.cards, result.targets[0]);
                            }
                        },
                    },
                },
            },
            //严颜
            catjuzhan: {
                audio: 'nzry_juzhan',
                trigger: {
                    player: 'phaseZhunbeiBegin',
                    target: 'useCardToTargeted',
                },
                filter(event, player) {
                    if (player.storage.catjuzhan) return false;
                    return event.name === 'phaseZhunbei' || (event.player !== player && event.card.name == 'sha');
                },
                prompt2() {
                    const target = _status.currentPhase;
                    return `摸一张牌${target?.isIn() ? `，然后${get.translation(target)}本回合内不能再对你使用牌` : ''}`;
                },
                async content(event, trigger, player) {
                    player.changeZhuanhuanji('catjuzhan');
                    await player.draw();
                    const target = _status.currentPhase;
                    if (target?.isIn()) {
                        target.addTempSkill('catjuzhan_ban');
                        target.markAuto('catjuzhan_ban', [player]);
                    }
                },
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (!storage) return '准备阶段或当你成为其他角色使用【杀】的目标后，你可以摸一张牌，然后当前回合角色本回合不能对你使用牌';
                        return '当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌';
                    },
                },
                group: 'catjuzhan_gain',
                subSkill: {
                    gain: {
                        audio: 'nzry_juzhan',
                        trigger: { player: 'useCardToPlayered' },
                        filter(event, player) {
                            return player.storage.catjuzhan && event.card.name === 'sha';
                        },
                        async cost(event, trigger, player) {
                            const list = [event.skill, trigger.target];
                            const next = player.gainPlayerCard(trigger.target, get.prompt(...list), 'he');
                            next.prompt2 = `获得其一张牌，然后你本回合内不能再对其使用牌`;
                            next.logSkill = list;
                            event.result = await next.forResult();
                        },
                        popup: false,
                        content() {
                            player.changeZhuanhuanji('catjuzhan');
                            player.addTempSkill('catjuzhan_ban');
                            player.markAuto('catjuzhan_ban', [trigger.target]);
                        },
                    },
                    ban: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '不能对$使用牌' },
                        mod: {
                            playerEnabled(card, player, target) {
                                if (player.getStorage('catjuzhan_ban').includes(target)) return false;
                            },
                        },
                    },
                },
            },
            //王平
            catfeijun: {
                audio: 'nzry_feijun',
                enable: 'phaseUse',
                filter(event, player) {
                    if (!player.hasCard(card => lib.filter.cardDiscardable(card, player), 'he')) return false;
                    return game.hasPlayer(current => {
                        return current.countCards('h') >= player.countCards('h') || current.countCards('e') >= player.countCards('e');
                    });
                },
                filterCard: lib.filter.cardDiscardable,
                selectCard() {
                    const event = get.event(), player = get.player();
                    const func = function (player) {
                        const target = player.storage.catfeijun;
                        if (target?.isIn()) target.prompt('<span class="firetext">上次<br>发动</span>');
                    };
                    if (event.isMine()) func(player);
                    else if (player.isOnline2()) player.send(func, player);
                    return 1;
                },
                position: 'he',
                check(card) {
                    return 7 - get.value(card);
                },
                usable: 1,
                async content(event, trigger, player) {
                    let list = [];
                    if (game.hasPlayer(current => {
                        return current.countCards('h') >= player.countCards('h');
                    })) list.push('令一名手牌数大于你的角色交给你一张牌');
                    if (game.hasPlayer(current => {
                        return current.countCards('e') >= player.countCards('e');
                    })) list.push('令一名装备区内牌数大于你的角色弃置一张装备牌');
                    if (!list.length) return;
                    let index;
                    if (list.length < 2) {
                        index = game.hasPlayer(current => {
                            return current.countCards('h') >= player.countCards('h');
                        }) ? 0 : 1;
                    }
                    else {
                        index = (await player.chooseControl().set('ai', () => {
                            const player = get.player();
                            return game.hasPlayer(current => {
                                return current.countCards('h') >= player.countCards('h') && get.attitude(player, current) < 0;
                            }) ? 0 : 1;
                        }).set('choiceList', list).forResult()).index;
                    }
                    if (typeof index !== 'number') return;
                    let result;
                    if (index === 0) {
                        result = await player.chooseTarget(true, (card, player, target) => {
                            return target !== player && target.countCards('h') >= player.countCards('h');
                        }, '选择一名手牌数大于等于你的角色').set('ai', target => {
                            const player = get.player();
                            return -get.attitude(player, target);
                        }).forResult();
                    }
                    else {
                        result = await player.chooseTarget(true, (card, player, target) => {
                            return target !== player && target.countCards('e') >= player.countCards('e');
                        }, '选择一名装备区里牌数大于等于你的角色').set('ai', target => {
                            const player = get.player();
                            return -get.attitude(player, target);
                        }).forResult();
                    }
                    if (!result?.bool || !result.targets?.length) return;
                    const target = result.targets[0];
                    if (player.storage[event.name] !== target) {
                        event[event.name] = true;
                        player.setStorage(event.name, target, true);
                    }
                    player.line(target, 'green');
                    if (index === 0) await target.chooseToGive(player, 'he', true);
                    else await target.chooseToDiscard({ type: 'equip' }, 'he', true);
                },
                ai: {
                    order: 11,
                    result: {
                        player(player) {
                            const last = player.storage.catfeijun;
                            if (game.hasPlayer(current => {
                                return (current.countCards('h') >= player.countCards('h') || current.countCards('e') >= player.countCards('e')) && get.attitude(player, current) < 0 && current === last;
                            }) || game.hasPlayer(current => {
                                return current.countCards('h') >= player.countCards('h') && get.attitude(player, current) < 0;
                            }) || (player.countCards('h') >= 2 && game.hasPlayer(current => {
                                return current.countCards('e') >= player.countCards('e') && get.attitude(player, current) < 0;
                            }))) return 1;
                            return 0;
                        },
                    },
                },
                intro: { content: 'players' },
            },
            catbinglve: {
                audio: 'nzry_binglve',
                trigger: { player: 'catfeijunAfter' },
                filter(event, player) {
                    return event[event.name];
                },
                forced: true,
                async content(event, trigger, player) {
                    await player.draw(2);
                },
                ai: { combo: 'catfeijun' },
            },
            //孙亮
            catkuizhu: {
                audio: 'nzry_kuizhu',
                trigger: { player: 'phaseDiscardAfter' },
                filter(event, player) {
                    let cards = [];
                    player.getHistory('lose', evt => {
                        if (evt.type === 'discard' && evt.getParent('phaseDiscard') == trigger) cards.addArray(evt.cards2);
                    });
                    const num = cards.length;
                    return num > 0 || game.hasPlayer(target => target.getHp() >= num);
                },
                async cost(event, trigger, player) {
                    let cards = [], result, forced = false;
                    player.getHistory('lose', evt => {
                        if (evt.type === 'discard' && evt.getParent('phaseDiscard') == trigger) cards.addArray(evt.cards2);
                    });
                    const num = cards.length;
                    const str1 = '令至多' + get.cnNumber(num) + '名角色摸一张牌';
                    const str2 = '对一名体力值大于等于' + num + '的角色造成1点伤害';
                    if (!num) result = { control: '选项二', index: 1 };
                    else if (!game.hasPlayer(target => target.getHp() >= num)) result = { control: '选项一', index: 0 };
                    else {
                        forced = true;
                        result = await player.chooseControl('cancel2').set('num', num).set('ai', () => {
                            const { player, num } = get.event();
                            return game.hasPlayer(target => {
                                return get.damageEffect(target, player, player) > 0 && target.getHp() >= num;
                            }) ? 1 : 0;
                        }).set('choiceList', [str1, str2]).set('prompt', get.prompt(event.skill)).forResult();
                    }
                    if (result?.control && result.control !== 'cancel2') {
                        const prompt = forced ? `请选择【${get.translation(event.skill)}】的目标` : get.prompt(event.skill);
                        const prompt2 = [str1, str2][result.index], selectTarget = [[1, num], 1][result.index];
                        event.result = await player.chooseTarget(prompt, (card, player, target) => {
                            const { num, index } = get.event();
                            return index === 0 || target.getHp() >= num;
                        }, forced, selectTarget, prompt2).set('num', num).set('ai', target => {
                            const { player, index } = get.event();
                            return [get.effect(target, { name: 'draw' }, player, player), get.damageEffect(target, player, player)][index];
                        }).set('index', result.index).forResult();
                        if (event.result) event.result.cost_data = result.index === 0;
                    }
                },
                async content(event, trigger, player) {
                    const targets = [...event.targets].sortBySeat();
                    if (event.cost_data) {
                        await game.asyncDraw(targets);
                        await game.delayx();
                    }
                    else await targets[0].damage();
                },
            },
            catchezheng: {
                audio: 'nzry_zhizheng',
                mod: {
                    playerEnabled(card, player, target) {
                        if (player.isPhaseUsing() && target !== player && !target.inRange(player)) return false;
                    },
                },
                trigger: { player: 'phaseUseEnd' },
                filter(event, player) {
                    const targets = game.filterPlayer(target => target !== player && !target.inRange(player));
                    return player.getHistory('useCard', evt => evt.getParent('phaseUse') === event).length <= targets.length && targets.some(target => target.countDiscardableCards(player, 'he') > 0);
                },
                forced: true,
                async content(event, trigger, player) {
                    const result = await player.chooseTarget('请选择〖掣政〗的目标', (card, player, target) => {
                        return target !== player && !target.inRange(player) && target.countDiscardableCards(player, 'he') > 0;
                    }, '弃置任意名攻击范围内不包含你的角色的一张牌', [1, Infinity], true).set('ai', target => {
                        const player = get.player();
                        return get.effect(target, { name: 'guohe_copy2' }, player, player);
                    }).forResult();
                    if (result?.bool && result.targets?.length) {
                        const targets = [...result.targets].sortBySeat();
                        player.line(targets);
                        for (const target of targets) await player.discardPlayerCard(target, 'he', true);
                    }
                },
            },
            //王基
            catqizhi: {
                audio: 'qizhi',
                inherit: 'qizhi',
                filter(event, player) {
                    if (!event.targets?.length || !event.isFirstTarget) return false;
                    return game.hasPlayer(target => !event.targets.includes(target) && target.countCards('he') > 0);
                },
            },
            catjinqu: {
                audio: 'jinqu',
                inherit: 'jinqu',
                check(event, player) {
                    return player.countCards('h') >= player.getRoundHistory('custom', evt => evt.catqizhi).length;
                },
                prompt2(event, player) {
                    return `摸两张牌，然后将手牌弃置至${player.getRoundHistory('custom', evt => evt.catqizhi).length}张`;
                },
                async content(event, trigger, player) {
                    await player.draw(2);
                    const num = player.getRoundHistory('custom', evt => evt.catqizhi).length;
                    if (player.countCards('h') > num) await player.chooseToDiscard(player.countCards('h') - num, true);
                },
            },
            //筷子
            catshenshi: {
                audio: 'nzry_shenshi',
                enable: 'phaseUse',
                filter(event, player) {
                    return !player.storage.catshenshi && player.countCards('he') > 0;
                },
                filterCard: true,
                position: 'he',
                filterTarget: lib.filter.notMe,
                check(card) {
                    return 5 - get.value(card);
                },
                usable: 1,
                prompt: () => lib.skill.catshenshi.intro.content(false),
                discard: false,
                lose: false,
                delay: false,
                async content(event, trigger, player) {
                    player.changeZhuanhuanji('catshenshi');
                    const target = event.target;
                    await player.give(event.cards, target);
                    await target.damage('nocard');
                    if ((!target.isIn() || target.isMinHp()) && game.hasPlayer(target => target.countCards('h') < 4)) {
                        const result = await player.chooseTarget(`${get.translation(event.name)}：是否令一名角色将手牌摸至四张？`, (card, player, target) => {
                            return target.countCards('h') < 4;
                        }).set('ai', target => {
                            const player = get.player();
                            return get.effect(target, { name: 'draw' }, player, player) * (4 - target.countCards('h'));
                        }).forResult();
                        if (result?.bool && result.targets?.length) {
                            player.line(result.targets);
                            await result.targets[0].drawTo(4)
                        }
                    }
                },
                ai: {
                    order: 1,
                    result: { target: -1 },
                },
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (!storage) return '出牌阶段限一次，你可以将一张牌交给一名其他角色，然后对其造成1点伤害，若该角色的体力值为全场最低，则你可以令一名角色将手牌摸至四张';
                        return '其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其任意张牌，此回合结束时，若其未全部失去这些牌，你将手牌摸至四张';
                    },
                },
                group: 'catshenshi_damage',
                subSkill: {
                    damage: {
                        audio: 'nzry_shenshi',
                        trigger: { player: 'damageEnd' },
                        filter(event, player) {
                            if (!player.storage.catshenshi) return false;
                            return player.countCards('he') > 0 && event.source?.isIn() && event.source != player;
                        },
                        logTarget: 'source',
                        prompt2: '观看该角色的手牌，然后交给其任意张牌，其失去此牌后，你将手牌摸至四张',
                        async content(event, trigger, player) {
                            player.changeZhuanhuanji('catshenshi');
                            const target = trigger.source;
                            await player.viewHandcards(target);
                            player.addTempSkill('catshenshi_effect');
                            const skill = 'catshenshi_' + player.playerid;
                            if (!lib.skill[skill]) {
                                game.broadcastAll((initSkill, skill) => {
                                    initSkill(skill);
                                    _status.postReconnect['catshenshi'] ??= [initSkill, []];
                                    _status.postReconnect['catshenshi'][1].add(skill);
                                }, skill => {
                                    lib.skill[skill] = {};
                                    lib.translate[skill] = '审时';
                                }, skill);
                            }
                            const next = player.chooseToGive(target, 'he', [1, Infinity], true);
                            next.gaintag.add(skill);
                            await next;
                        },
                    },
                    effect: {
                        charlotte: true,
                        onremove(player) {
                            game.countPlayer(target => target.removeGaintag('catshenshi_' + player.playerid));
                        },
                        audio: 'nzry_shenshi',
                        trigger: { global: 'phaseEnd' },
                        filter(event, player) {
                            if (player.countCards('h') >= 4) return false;
                            return game.hasPlayer2(current => current.hasCard(card => card.hasGaintag('catshenshi_' + player.playerid), 'h'));
                        },
                        forced: true,
                        content() {
                            player.drawTo(4);
                        },
                    },
                },
            },
            //卢植
            catmingren: {
                drawNum: 1,
                inherit: 'nzry_mingren',
            },
            catzhenliang: {
                audio: ['nzry_zhenliang_11.mp3', 'nzry_zhenliang_12.mp3'],
                enable: 'phaseUse',
                trigger: {
                    player: 'loseAfter',
                    global: ['loseAsyncAfter', 'cardsDiscardAfter'],
                },
                filter(event, player) {
                    const cards = player.getExpansions('nzry_mingren');
                    if (!cards.length) return false;
                    if (event.name === 'chooseToUse') {
                        if (player.storage.catzhenliang || player.hasSkill('catzhenliang_used', null, null, false)) return false;
                        if (!player.hasCard(card => lib.skill.catzhenliang.filterCard(card, player), 'he')) return false;
                        return game.hasPlayer(current => player.inRange(current));
                    }
                    else {
                        if (_status.currentPhase === player || !player.storage.catzhenliang) return false;
                        const cards2 = event.getd?.() ?? [];
                        if (event.name !== 'cardsDiscard') {
                            return event.getl?.(player)?.cards2?.some(card => cards2.includes(card) && get.type2(card) === get.type2(cards[0]));
                        }
                        const evt = event.getParent();
                        if (evt.name !== 'orderingDiscard') return false;
                        const evtx = (evt.relatedEvent || evt.getParent());
                        if (evtx.name === 'judge' || evtx.player !== player) return false;
                        return player.hasHistory('lose', evtxx => {
                            if (evtx !== (evtxx.relatedEvent || evtxx.getParent())) return false;
                            return evtxx.getl?.(player)?.cards2?.some(card => cards2.includes(card) && get.type2(card) === get.type2(cards[0]));
                        });
                    }
                },
                position: 'he',
                filterCard(card, player) {
                    if (!lib.filter.cardDiscardable(card, player)) return false;
                    return get.color(card) === get.color(player.getExpansions('nzry_mingren')[0]);
                },
                filterTarget(card, player, target) {
                    return player.inRange(target);
                },
                check(card) {
                    return 6.5 - get.value(card);
                },
                prompt: '弃置一张与“任”颜色相同的牌，对攻击范围内的一名角色造成1点伤害',
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '令一名角色摸一张牌').set('ai', target => {
                        const player = get.player();
                        return get.effect(target, { name: 'draw' }, player, player);
                    }).forResult();
                },
                async content(event, trigger, player) {
                    player.changeZhuanhuanji('catzhenliang');
                    if (!trigger) {
                        const target = event.target;
                        player.addTempSkill('catzhenliang_used', 'phaseUseAfter');
                        await target.damage('nocard');
                    }
                    else {
                        const targets = [...event.targets].sortBySeat();
                        await game.asyncDraw(targets);
                        await game.delayx();
                    }
                },
                ai: {
                    order: 10,
                    result: {
                        player(player, target) {
                            return get.damageEffect(target, player, player);
                        },
                    },
                    combo: 'catmingren',
                },
                mark: true,
                zhuanhuanji: true,
                marktext: '☯',
                intro: {
                    content(storage) {
                        if (!storage) return '出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害';
                        return '当你于回合外失去的牌进入弃牌堆后，若此牌与“任”类别相同，则你可以令一名角色摸一张牌';
                    },
                },
                subSkill: { used: { charlotte: true } },
            },
            //陈到
            catwanglie: {
                audio: 'drlt_wanglie',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return player.isPhaseUsing();
                },
                async cost(event, trigger, player) {
                    const result = await player.chooseControl('数值+1', '摸两张牌', 'cancel2').set('ai', () => {
                        const player = get.player(), trigger = get.event().getTrigger();
                        if (player.hasCard(card => player.hasValueTarget(card, null, true), 'hs')) return 'cancel2';
                        return (get.tag(trigger.card, 'damage') || get.tag(trigger.card, 'recover')) ? 0 : 1;
                    }).set('prompt', get.prompt(event.skill)).setHiddenSkill(event.skill).forResult();
                    if (result?.control && result.control !== 'cancel2') {
                        event.result = { bool: true, cost_data: result.index };
                    }
                },
                preHidden: true,
                async content(event, trigger, player) {
                    if (event.cost_data === 0) {
                        trigger.baseDamage++;
                        game.log(trigger.card, '的数值', '#y+1');
                    }
                    else await player.draw(2);
                    player.addTempSkill('catwanglie_ban');
                },
                init(player) {
                    if (player.isPhaseUsing()) {
                        const event = _status.event?.getParent('phaseUse', true);
                        if (!player.hasHistory('useCard', evt => {
                            return evt.getParent('phaseUse') === event;
                        })) player.addTempSkill('catwanglie_first', 'phaseUseAfter');
                    }
                },
                group: 'catwanglie_effect',
                subSkill: {
                    effect: {
                        charlotte: true,
                        trigger: { player: 'phaseUseBegin' },
                        silent: true,
                        async content(event, trigger, player) {
                            player.addTempSkill('catwanglie_first', 'phaseUseAfter');
                        },
                    },
                    first: {
                        mod: {
                            targetInRange(card, player, target) {
                                if (card) return true;
                            },
                        },
                        audio: 'drlt_wanglie',
                        trigger: { player: 'useCard1' },
                        forced: true,
                        async content(event, trigger, player) {
                            player.removeSkill(event.name);
                            trigger.nowuxie = true;
                            trigger.directHit.addArray(game.players);
                            game.log(trigger.card, '不可被响应');
                            await game.delayx();
                        },
                        ai: { directHit_ai: true },
                    },
                    ban: {
                        charlotte: true,
                        mark: true,
                        intro: { content: '不能使用牌' },
                        mod: {
                            cardEnabled: () => false,
                            cardSavable: () => false,
                        },
                    },
                },
            },
            //毌丘俭
            catzhengrong: {
                audio: 'drlt_zhenrong',
                inherit: 'drlt_zhenrong',
                filter(event, player) {
                    return event.player !== player && event.player.isIn() && event.player.countCards('he');
                },
                async cost(event, trigger, player) {
                    const target = trigger.player, list = [event.skill, target];
                    const next = player.choosePlayerCard(target, get.prompt2(...list), 'he');
                    next.ai = function () {
                        const { player, target } = get.event();
                        return -get.attitude(player, target) + 1 + Math.random();
                    };
                    event.result = await next.forResult();
                },
                logTarget: 'player',
                onremove(player) {
                    const cards = player.getExpansions('drlt_zhenrong');
                    if (cards.length) player.loseToDiscardpile(cards);
                },
            },
            cathongju: {
                audio: 'drlt_hongju',
                inherit: 'drlt_hongju',
                filter(event, player) {
                    return player.getExpansions('drlt_zhenrong').length >= 3;
                },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    await player.addSkills(lib.skill[event.name].derivation);
                },
                derivation: 'catqingce',
                ai: { combo: 'catzhengrong' },
            },
            catqingce: {
                audio: 'drlt_qingce',
                inherit: 'drlt_qingce',
                async content(event, trigger, player) {
                    const next = player.chooseCardButton(player.getExpansions('drlt_zhenrong'), `${get.translation(event.name)}：请选择你要获得的“荣”`, true);
                    next.ai = button => get.value(button.link);
                    const result = await next.forResult();
                    if (result?.bool && result.links?.length) {
                        await player.gain(result.links, 'gain2');
                        await player.discardPlayerCard(event.target, 'ej', true);
                    }
                },
                ai: {
                    combo: 'catzhengrong',
                    order(item, player) {
                        const order = get.order({ name: 'guohe_copy', position: 'ej' }, player);
                        return order + (order > 0 ? 0.3 : 0);
                    },
                    result: {
                        player(player, target) {
                            return get.effect(target, { name: 'guohe_copy', position: 'ej' }, player, player);
                        },
                    },
                },
            },
            //袁术
            catyongsi: {
                audio: 'drlt_yongsi',
                trigger: { player: 'phaseDiscardBegin' },
                filter(event, player) {
                    let num = 0;
                    player.getHistory('sourceDamage', evt => num += evt.num);
                    if (num === 1) return true;
                    return num > 1 || player.countCards('h') < player.maxHp;
                },
                forced: true,
                async content(event, trigger, player) {
                    if (!player.hasHistory('sourceDamage')) await player.drawTo(player.maxHp);
                    else player.addTempSkill('catyongsi_yingzi');
                },
                group: 'catyongsi_yongsi',
                subSkill: {
                    yongsi: {
                        audio: 'drlt_yongsi',
                        trigger: { player: 'phaseDrawBegin2' },
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        forced: true,
                        async content(event, trigger, player) {
                            trigger.num = game.countGroup();
                        },
                    },
                    yingzi: {
                        charlotte: true,
                        mark: true,
                        markimage: 'image/card/handcard.png',
                        intro: { content: '手牌上限为体力上限' },
                        mod: { maxHandcardBase: player => player.maxHp },
                    },
                },
            },
        },
        dynamicTranslate: {
            catjuzhan(player, skill) {
                let yang = '阳：准备阶段或当你成为其他角色使用【杀】的目标后，你可以摸一张牌，然后当前回合角色本回合不能对你使用牌';
                let yin = '阴：当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌';
                if (player.storage[skill]) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                return `转换技。${yang}；${yin}。`;
            },
            catshenshi(player, skill) {
                let yang = '阳：出牌阶段限一次，你可以将一张牌交给一名其他角色，然后对其造成1点伤害，若该角色的体力值为全场最低，则你可以令一名角色将手牌摸至四张';
                let yin = '阴：其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其任意张牌，此回合结束时，若其未全部失去这些牌，你将手牌摸至四张';
                if (player.storage[skill]) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                return `转换技。${yang}；${yin}。`;
            },
            catzhenliang(player, skill) {
                let yang = '阳：出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害';
                let yin = '阴：当你于回合外失去的牌进入弃牌堆后，若此牌与“任”类别相同，则你可以令一名角色摸一张牌';
                if (player.storage[skill]) yin = `<span class='bluetext'>${yin}</span>`;
                else yang = `<span class='firetext'>${yang}</span>`;
                return `转换技。${yang}；${yin}。`;
            },
        },
        translate: {
            cat_shuhanhujiang: '喵喵杯·蜀汉虎将',
            cat_xianmingjunzhu: '喵喵杯·贤明君主',
            cat_yongguansanjun: '喵喵杯·勇冠三军',
            cat_weiwoqianli: '喵喵杯·帷幄千里',
            cat_jinguohongyan: '喵喵杯·巾帼红颜',
            cat_shenhua_feng: '喵喵杯·神话再临·风',
            cat_shenhua_huo: '喵喵杯·神话再临·火',
            cat_shenhua_lin: '喵喵杯·神话再临·林',
            cat_shenhua_yin: '喵喵杯·神话再临·阴',
            cat_shenhua_lei: '喵喵杯·神话再临·雷',
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
            cat_re_huatuo: '华佗',
            catqingnang: '青囊',
            catqingnang_info: '出牌阶段限一次，你可以弃置一张牌，令一名角色回复1点体力。若你弃置的是红色牌，则你重置本技能发动次数。',
            cat_re_diaochan: '貂蝉',
            catbiyue: '闭月',
            catbiyue_info: '结束阶段，你可以摸一张牌（若你的手牌数小于体力值则改为摸两张牌）。',
            cat_re_weiyan: '魏延',
            catqimou: '奇谋',
            catqimou_info: '限定技，出牌阶段，你可以失去任意点体力，本回合你计算与其他角色的距离-X，且你可以多使用X张【杀】，且你因【杀】造成伤害发动【狂骨】时可多摸一张牌（X为你失去的体力值）。',
            cat_ol_xiahouyuan: '夏侯渊',
            catshensu: '神速',
            catshensu_info: '你可以选择至多三项：1.跳过判定阶段和摸牌阶段；2.跳过出牌阶段并弃置一张非基本牌；3.跳过弃牌阶段并将武将牌翻面。你每选择一项，视为你对一名其他角色使用一张无距离限制的【杀】并摸一张牌。',
            cat_xiaoqiao: '小乔',
            cathongyan: '红颜',
            cathongyan_info: '锁定技，你区域内的黑桃牌和黑桃判定牌均视为红桃；若你的装备区有牌，则你的手牌上限+2。',
            cat_sp_zhangjiao: '张角',
            catleiji: '雷击',
            catleiji_info: '当你使用或打出【闪】时或【闪电】进入你的判定区时，你可令一名其他角色进行判定。若判定结果为：梅花，你回复1点体力，然后对其造成1点雷属性伤害；黑桃，你对其造成2点雷属性伤害。',
            cat_re_yuji: '于吉',
            catguhuo: '蛊惑',
            catguhuo_info: `每回合每种牌名限一次，你可以扣置一张手牌当作一张基本牌或普通锦囊牌使用或打出。其他角色依次选择是否质疑。有角色质疑时，你终止质疑流程并展示此牌：若为假，此牌作废且此技能本回合失效；若为真，质疑角色获得${get.poptip('chanyuan')}。`,
            cat_dianwei: '典韦',
            catqiangxi: '强袭',
            catqiangxi_info: '出牌阶段每名角色限一次，你可以弃置一张武器牌或失去1点体力。对攻击范围内一名其他角色造成1点伤害，若其因此进入濒死状态，则你回复1点体力。',
            cat_pangtong: '庞统',
            catlianhuan: '连环',
            catlianhuan_info: '出牌阶段，你可以将♣牌当作【铁索连环】使用或重铸。当你使用【铁索连环】指定目标后，你可以弃置其中一名目标角色装备区里的一张牌。',
            catniepan: '涅槃',
            catniepan_info: '限定技，当你处于濒死状态时，你可以弃置你区域内的所有牌并复原你的武将牌，然后摸三张牌并将体力回复至3点，且本回合不能成为其他角色使用牌的目标。',
            cat_sp_zhugeliang: '卧龙',
            catbazhen: '八阵',
            catbazhen_info: '锁定技，若你的装备区里没有防具牌，则你视为装备【八卦阵】。你可获得你因【八卦阵】判定生效后的黑色判定牌。',
            cathuoji: '火计',
            cathuoji_info: '你可一张红色牌当作【火攻】使用。你使用【火攻】令一名角色进入濒死状态后，其本次濒死不能使用【桃】和【酒】。',
            cat_taishici: '太史慈',
            cattianyi: '天义',
            cattianyi_info: '出牌阶段限一次，你可以和一名其他角色拼点。若你赢，你获得以下技能效果直到回合结束：你使用【杀】没有距离限制；可额外使用一张【杀】；使用【杀】时可额外指定一个目标。若你没赢，你获得双方的拼点牌，且本回合不能使用【杀】。',
            cat_pangde: '庞德',
            catjianchu: '鞬出',
            catjianchu_info: '当你使用【杀】指定一名角色为目标后，你可以弃置其一张牌，若以此法弃置的牌为：装备牌，此【杀】不可被响应；锦囊牌，此【杀】伤害+1；基本牌，其获得此【杀】。',
            cat_re_yuanshao: '袁绍',
            catqingchao: '倾巢',
            catqingchao_info: '出牌阶段限一次，当你的手牌数少于2时，你可以对一名角色造成1点伤害。',
            cat_ol_xuhuang: '徐晃',
            catjiezi: '截辎',
            catjiezi_info: '锁定技，一名其他角色跳过摸牌阶段后，你摸一张牌。若你与其距离小于等于1，则额外摸一张牌。',
            cat_sunjian: '孙坚',
            cat_zhurong: '祝融',
            catlieren: '烈刃',
            catlieren_info: '当你使用仅指定单目标的牌结算完毕后，你可以与其拼点。若你赢，你获得其一张牌。',
            cat_jiaxu: '贾诩',
            catluanwu: '乱武',
            catluanwu_info: '限定技，出牌阶段，你可令除你外的所有角色依次对与其距离最近的另一名角色使用一张【杀】，否则失去1点体力且你可以弃置其一张牌。',
            catweimu: '帷幕',
            catweimu_info: '锁定技，你不能成为黑色锦囊牌的目标；当你受到不为当前回合角色造成的伤害后，你摸两张牌。',
            cat_re_lusu: '鲁肃',
            cathaoshi: '好施',
            cathaoshi_info: '摸牌阶段，你可以多摸两张牌，然后若你的手牌数大于5，你须将X张手牌交给一名其他角色（X为你手牌数的一半，向下取整）。',
            cat_yanyan: '严颜',
            catjuzhan: '拒战',
            catjuzhan_info: '转换技。准备阶段或当你成为其他角色使用【杀】的目标后，你可以摸一张牌，然后当前回合角色本回合不能对你使用牌；当你使用【杀】指定一名角色为目标后，你可以获得其一张牌，然后你本回合内不能再对其使用牌。',
            cat_wangping: '王平',
            catfeijun: '飞军',
            catfeijun_info: '出牌阶段限一次。你可以弃置一张牌，然后选择一项：⒈令一名手牌数大于等于你的角色交给你一张牌；⒉令一名装备区里牌数大于等于你的角色弃置一张装备牌。',
            catbinglve: '兵略',
            catbinglve_info: `锁定技，当你发动${get.poptip('catfeijun')}后，若目标与你上次发动${get.poptip('catfeijun')}指定的目标不同，则你摸两张牌。`,
            cat_sunliang: '孙亮',
            catkuizhu: '溃诛',
            catkuizhu_info: '弃牌阶段结束后，你可以选择一项：①令至多X名角色各摸一张牌。②对一名体力值大于等于X的角色造成1点伤害（X为你此阶段弃置的牌数）。',
            catchezheng: '掣政',
            catchezheng_info: '锁定技，你的出牌阶段内，攻击范围内不包含你的其他角色不能成为你使用牌的目标。出牌阶段结束时，若你本阶段使用的牌数小于等于这些角色数，则你弃置其中任意名角色各一张牌。',
            cat_wangji: '王基',
            catqizhi: '奇制',
            catqizhi_info: '当你使用牌指定目标后，你可以弃置不是此牌目标的一名角色的一张牌。若如此做，其摸一张牌。',
            catjinqu: '进趋',
            catjinqu_info: `结束阶段，你可以摸两张牌，若如此做，你将手牌弃置至X张（X为你于本轮发动过${get.poptip('catqizhi')}的次数）。`,
            cat_kuailiangkuaiyue: '蒯良蒯越',
            catshenshi: '审时',
            catshenshi_info: '转换技。阳：出牌阶段限一次，你可以将一张牌交给一名其他角色，然后对其造成1点伤害，若该角色的体力值为全场最低，则你可以令一名角色将手牌摸至四张。阴：其他角色对你造成伤害后，你可以观看该角色的手牌，然后交给其任意张牌，此回合结束时，若其未全部失去这些牌，你将手牌摸至四张。',
            cat_yl_luzhi: '卢植',
            catmingren: '明任',
            catmingren_info: '游戏开始时，你摸一张牌，然后将一张手牌称为“任”置于你的武将牌上。结束阶段，你可以用一张手牌替换“任”。',
            catzhenliang: '贞良',
            catzhenliang_info: '转换技。阳：出牌阶段限一次，你可以弃置一张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害；阴：当你于回合外失去的牌进入弃牌堆后，若此牌与“任”类别相同，则你可以令一名角色摸一张牌。',
            cat_chendao: '陈到',
            catwanglie: '往烈',
            catwanglie_info: '出牌阶段，你使用的第一张牌无距离限制且不能被响应。当你于出牌阶段使用牌时，你可选择一项：1.令此牌伤害+1；2.摸两张牌；若如此做，本回合你不能再使用牌。',
            cat_guanqiujian: '毌丘俭',
            catzhengrong: '征荣',
            catzhengrong_info: '当你对其他角色造成伤害后，你可以将其一张牌置于你的武将牌上，称为“荣”。',
            cathongju: '鸿举',
            cathongju_info: `觉醒技，准备阶段，若“荣”的数量大于或等于3，你减1点体力上限并获得${get.poptip('catqingce')}。`,
            catqingce: '清侧',
            catqingce_info: '出牌阶段，你可以获得一张“荣”，然后弃置一名角色场上的一张牌。',
            cat_yl_yuanshu: '袁术',
            catyongsi: '庸肆',
            catyongsi_info: '锁定技，摸牌阶段，你改为摸X张牌（X为存活势力数）。弃牌阶段开始时，若你本回合：1.没有造成伤害，你将手牌摸至体力上限；2.造成伤害数超过1点，你本回合将手牌上限改为体力上限。',
        },
    };
    for (const i in MX_catcatcup.character) {
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