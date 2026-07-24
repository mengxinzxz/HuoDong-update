import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MiNiAppkill = {
        name: 'MiNiAppkill',
        connect: true,
        characterSort: {
            MiNiAppkill: {
                MiNiApp_standard: ['mp_liubei', 'mp_caocao', 'mp_zhaoyun', 'mp_machao', 'mp_ganning', 'mp_xiahoudun', 'mp_xuzhu', 'mp_zhugeliang', 'mp_lvmeng', 'mp_zhouyu', 'mp_luxun', 'mp_simayi', 'mp_huatuo', 'mp_huangyueying', 'mp_zhenji', 'mp_diaochan'],
                MiNiApp_shenhua: ['mp_shen_zhaoyun'],
                MiNiApp_yijiang: [],
                MiNiApp_xinghuo: [],
                MiNiApp_qunying: [],
            },
        },
        character: {
            //魏
            mp_caocao: ['male', 'wei', 4, ['mpjianxiong']],
            mp_xiahoudun: ['male', 'wei', 4, ['mpganglie', 'mpqingjian']],
            mp_xuzhu: ['male', 'wei', 4, ['mpluoyi']],
            mp_simayi: ['male', 'wei', 3, ['mpguicai', 'refankui']],
            mp_zhenji: ['female', 'wei', 3, ['mpluoshen', 'reqingguo']],
            //蜀
            mp_liubei: ['male', 'shu', 4, ['mprende']],
            mp_zhaoyun: ['male', 'shu', 4, ['longdan', 'mpyajiao']],
            mp_machao: ['male', 'shu', 4, ['mashu', 'mptieji']],
            mp_zhugeliang: ['male', 'shu', 3, ['mpguanxing', 'kongcheng']],
            mp_huangyueying: ['female', 'shu', 3, ['mpjizhi', 'mpqicai']],
            //吴
            mp_ganning: ['male', 'wu', 4, ['mpqixi', 'mpfenwei']],
            mp_lvmeng: ['male', 'wu', 4, ['mpkeji', 'mpqinxue']],
            mp_zhouyu: ['male', 'wu', 3, ['mpyingzi', 'mpfanjian']],
            mp_luxun: ['male', 'wu', 3, ['mpqianxun', 'mplianying']],
            //群
            mp_huatuo: ['male', 'qun', 3, ['mpjijiu', 'mpqingnang']],
            mp_diaochan: ['female', 'qun', 3, ['mplijian', 'mpbiyue']],
            //神
            mp_shen_zhaoyun: ['male', 'shen', 2, ['mpjuejing', 'relonghun'], ['shu']],
        },
        skill: {
            //魏
            //曹操
            mpjianxiong: {
                audio: 'jianxiong',
                inherit: 'new_rejianxiong',
                async content(event, trigger, player) {
                    const goon = get.itemtype(trigger.cards) === 'cards';
                    if (goon) {
                        await player.draw();
                        if (trigger.cards.someInD()) {
                            await player.gain(trigger.cards.filterInD(), 'gain2');
                            if ((trigger.cards ?? []).length === 1 && trigger.cards[0].name === 'sha') {
                                const card = trigger.cards[0], source = trigger.source;
                                if (get.owner(card) === player && get.position(card) === 'h' && source?.isIn() && player.getHp() < source.getHp() && player.canUse(card, source, false)) {
                                    const result = await player.chooseBool(`${get.translation(event.name)}：是否对${get.translation(source)}使用${get.translation(card)}？`).set('choice', (() => {
                                        return get.effect(card, source, player, player) > 0;
                                    })()).forResult();
                                    if (result?.bool) await player.useCard(card, source, false).set('cards', [card]);
                                }
                            }
                        }
                    }
                    else await player.draw(2);
                },
            },
            //夏侯惇
            mpganglie: {
                audio: 'ganglie',
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
            mpqingjian: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: {
                    player: 'gainAfter',
                    global: 'loseAsyncAfter',
                },
                filter(event, player) {
                    if (event.getParent('phaseDraw', true)) return false;
                    return (event.getg?.(player) ?? []).length > 0;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCardTarget({
                        position: 'he',
                        filterCard: true,
                        selectCard: [1, Infinity],
                        filterTarget: lib.filter.notMe,
                        ai1(card) {
                            if (get.attitude(_status.event.player, _status.currentPhase) < 0 && _status.currentPhase.needsToDiscard() && card.name != 'du') return -1;
                            for (var i = 0; i < ui.selected.cards.length; i++) {
                                if (get.type(ui.selected.cards[i]) == get.type(card) || (ui.selected.cards[i].name == 'du' && card.name != 'du')) return -1;
                            };
                            if (card.name == 'du') return 20;
                            return (_status.event.player.countCards('h') - _status.event.player.hp);
                        },
                        ai2(target) {
                            if (get.attitude(_status.event.player, _status.currentPhase) < 0) return -1;
                            var att = get.attitude(_status.event.player, target);
                            if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') {
                                if (target.hasSkillTag('nodu')) return 0;
                                return 1 - att;
                            }
                            if (target.countCards('h') > _status.event.player.countCards('h')) return 0;
                            return att - 4;
                        },
                        prompt: get.prompt2('mpqingjian'),
                    }).forResult();
                },
                async content(event, trigger, player) {
                    await player.give(event.cards, event.targets[0], true);
                    const target = _status.currentPhase;
                    if (!player.hasSkill(`${event.name}_used`) && target?.isIn()) {
                        player.addTempSkill(`${event.name}_used`);
                        player.line(target);
                        target.addTempSkill(`${event.name}_hand`);
                        target.addMark(`${event.name}_hand`, event.cards.reduce((sum, card) => sum.add(get.type2(card, false)), []).length, false);
                    }
                },
                ai: { expose: 0.3 },
                subSkill: {
                    used: { charlotte: true },
                    hand: {
                        charlotte: true,
                        onremove: true,
                        intro: { content: '手牌上限+#' },
                        mod: {
                            maxHandcard(player, num) {
                                return num + player.countMark('mpqingjian_hand');
                            },
                        },
                    },
                },
            },
            //许褚
            mpluoyi: {
                audio: 'luoyi',
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
                        player.addTempSkill('mpluoyi_buff', { player: 'phaseBegin' });
                        player.addMark('mpluoyi_buff', 1, false);
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
                        audio: 'luoyi',
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
            //司马懿
            mpguicai: {
                audio: 'guicai',
                trigger: { global: 'judge' },
                filter(event, player) {
                    return player.countCards('hes');
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseCard(get.translation(trigger.player) + '的' + (trigger.judgestr || '') + '判定为' + get.translation(trigger.player.judging[0]) + '，' + get.prompt('miniguicai'), 'hes', function (card) {
                        var player = _status.event.player;
                        var mod2 = game.checkMod(card, player, 'unchanged', 'cardEnabled2', player);
                        if (mod2 != 'unchanged') return mod2;
                        var mod = game.checkMod(card, player, 'unchanged', 'cardRespondable', player);
                        if (mod != 'unchanged') return mod;
                        return true;
                    }).set('ai', function (card) {
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        var judging = _status.event.judging;
                        var result = trigger.judge(card) - trigger.judge(judging);
                        var attitude = get.attitude(player, trigger.player);
                        const val = get.color(card) !== get.color(judging) ? (get.value(judging) - get.value(card)) : 0;
                        if (attitude == 0) return val;
                        if (attitude > 0) {
                            if (result == 0) return val;
                            return result - get.value(card) / 2;
                        }
                        else {
                            if (result == 0) return val;
                            return -result - get.value(card) / 2;
                        }
                    }).set('judging', trigger.player.judging[0]).forResult();
                },
                popup: false,
                async content(event, trigger, player) {
                    const next = player.respond(event.cards, event.name, 'highlight', 'noOrdering');
                    await next;
                    if (next?.cards?.length) {
                        const card = next.cards[0];
                        if (trigger.player.judging[0].clone) {
                            game.broadcastAll(card => {
                                card.clone?.classList.remove('thrownhighlight');
                            }, trigger.player.judging[0]);
                            game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                        }
                        if (get.color(card) !== get.color(trigger.player.judging[0])) await player.gain(trigger.player.judging, 'gain2');
                        else await game.cardsDiscard(trigger.player.judging[0]);
                        trigger.player.judging[0] = card;
                        trigger.orderingCards.add(card);
                        game.log(trigger.player, '的判定牌改为', card);
                        await game.delay(2);
                    }
                },
                ai: {
                    rejudge: true,
                    tag: { rejudge: 1 },
                },
            },
            //甄姬
            mpluoshen: {
                audio: 'reluoshen',
                trigger: { player: 'phaseZhunbeiBegin' },
                frequent: true,
                async content(event, trigger, player) {
                    while (true) {
                        const result = await player.judge(card => {
                            return get.color(card) === 'black' ? 1 : -1;
                        }).set('callback', function () {
                            if (get.position(card, true) === 'o') {
                                player.addTempSkill('mpluoshen_effect');
                                player.gain(card, 'gain2').gaintag.add('mpluoshen_effect');
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
                                if (card.hasGaintag('mpluoshen_effect')) return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name === 'phaseDiscard' && card.hasGaintag('mpluoshen_effect')) return false;
                            },
                        },
                    },
                },
            },
            //蜀
            //刘备
            mprende: {
                audio: 'rende',
                enable: 'phaseUse',
                filterCard: true,
                selectCard: [1, Infinity],
                discard: false,
                lose: false,
                delay: false,
                filterTarget(card, player, target) {
                    return player !== target && !player.getStorage('mprende2').includes(target);
                },
                check(card) {
                    const player = get.player();
                    if (ui.selected.cards.length && ui.selected.cards[0].name == 'du') return 0;
                    if (!ui.selected.cards.length && card.name == 'du') return 20;
                    if (ui.selected.cards.length >= Math.max(2, player.countCards('h') - player.hp)) return 0;
                    if (player.isHealthy() || player.storage.mprende3 || player.countCards('h') <= 1) {
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
                    if (evt?.name === 'phaseUse' && !evt.mprende) {
                        const next = game.createEvent('mprende_clear');
                        event.next.remove(next);
                        evt.after.push(next);
                        evt.mprende = true;
                        next.player = player;
                        next.setContent(function () {
                            delete player.storage.mprende;
                            delete player.storage.mprende2;
                            delete player.storage.mprende3;
                        });
                    }
                    const { target, cards } = event;
                    player.markAuto('mprende2', [target]);
                    await player.give(cards, target);
                    if (!player.storage.mprende3) {
                        player.addMark('mprende', cards.length, false);
                        if (player.countMark('mprende') >= 2) {
                            player.storage.mprende3 = true;
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
                        if (player.isDamaged() && !player.storage.mprende3 && player.countMark('mprende') < 2 && player.countCards('h') > 1) return 10;
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
                            if (player.isHealthy() || player.storage.mprende3 || player.countCards('h') <= 1) {
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
            //赵云
            mpyajiao: {
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { player: ['useCard', 'respond'] },
                filter(event, player) {
                    if (_status.currentPhase === player) return false;
                    return player.hasHistory('lose', evt => {
                        if ((evt.relatedEvent || evt.getParent()) !== event) return false;
                        return evt.hs?.length > 0;
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
                    if (get.color(trigger.card) === 'red') await player.draw();
                },
            },
            //马超
            mptieji: {
                audio: 'tieji',
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
            //诸葛亮
            mpguanxing: {
                audio: 'guanxing',
                trigger: { player: ['phaseZhunbeiBegin', 'phaseJieshuBegin'] },
                frequent: true,
                async content(event, trigger, player) {
                    await player.chooseToGuanxing(5).set('prompt', '观星：点击或拖动将牌移动到牌堆顶或牌堆底');
                },
                ai: { guanxing: true },
            },
            //黄月英
            mpjizhi: {
                audio: 'jizhi',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return get.type2(event.card) === 'trick';
                },
                frequent: true,
                async content(event, trigger, player) {
                    const result = await player.draw().forResult();
                    if (_status.currentPhase !== player || !result?.cards?.[0]) return;
                    if (get.type(result.cards[0]) === 'basic' && player.countMark('mpjizhi_effect') < 5) {
                        player.addTempSkill('mpjizhi_effect');
                        player.addMark('mpjizhi_effect', 1, false);
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
                                return num + player.countMark('mpjizhi_effect');
                            },
                        },
                    },
                },
            },
            mpqicai: {
                trigger: {
                    player: 'loseAfter',
                    global: ['loseAsyncAfter', 'equipAfter', 'addJudgeAfter', 'gainAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    const evt = event.getl?.(player);
                    return evt?.es?.some(card => {
                        const VEquip = evt.vcard_map.get(card);
                        return VEquip && get.subtypes(VEquip).containsSome('equip1', 'equip3', 'equip4');
                    });
                },
                forced: true,
                async content(event, trigger, player) {
                    const card = get.discardPile(card => get.type2(card) === 'trick', 'random');
                    if (card) await player.gain(card, 'gain2');
                },
                mod: {
                    targetInRange(card, player, target) {
                        if (get.type2(card) === 'trick') return true;
                    },
                    canBeDiscarded(card, player, target) {
                        if (get.position(card) == 'e' && get.subtypes(card).some(subtype => ['equip2', 'equip5'].includes(subtype)) && player !== target) return false;
                    },
                },
            },
            //吴
            //甘宁
            mpqixi: {
                audio: 'qixi',
                trigger: { global: 'loseAfter' },
                filter(event, player) {
                    const evt = event.getParent(2), card = evt.card;
                    if (event.type !== 'discard' || evt.name !== 'guohe' || evt.player !== player || !card) return false;
                    return event.cards2?.some(card => get.suit(card, event.player) === get.suit(evt.card));
                },
                forced: true,
                locked: false,
                async content(event, trigger, player) {
                    await player.draw();
                },
                group: 'mpqixi_qixi',
                subSkill: {
                    qixi: {
                        audio: 'qixi',
                        inherit: 'qixi',
                    },
                },
            },
            mpfenwei: {
                limited: true,
                audio: 'ext:活动武将/audio/skill:2',
                trigger: { global: 'useCardToPlayered' },
                filter(event, player) {
                    if (!event.isFirstTarget || get.type(event.card) !== 'trick' || get.info(event.card).multitarget) return false;
                    return event.targets.length >= 2;
                },
                async cost(event, trigger, player) {
                    event.result = await player.chooseTarget(get.prompt(event.skill), '令' + get.translation(trigger.card) + '对任意名角色无效', [1, trigger.targets.length], function (card, player, target) {
                        return _status.event.targets.includes(target);
                    }).set('ai', function (target) {
                        var trigger = _status.event.getTrigger();
                        return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                    }).set('targets', trigger.targets).forResult();
                },
                round: 1,
                skillAnimation: true,
                animationColor: 'wood',
                async content(event, trigger, player) {
                    trigger.getParent().excluded.addArray(event.targets);
                    game.log(trigger.card, '对', event.targets, '无效');
                },
                ai: { expose: 0.2 },
            },
            //吕蒙
            mpkeji: {
                audio: 'keji',
                inherit: 'keji',
                async content(event, trigger, player) {
                    trigger.cancel();
                    if (!player.hasHistory('useCard', evt => evt.isPhaseUsing())) await player.draw(2);
                },
            },
            mpqinxue: {
                audio: 'ext:活动武将/audio/skill:2',
                inherit: 'qinxue',
                trigger: { player: 'phaseZhunbeiBegin' },
                async content(event, trigger, player) {
                    player.awakenSkill(event.name);
                    await player.loseMaxHp();
                    await player.addSkills('gongxin');
                    player.addTempSkill('mpqinxue_paoxiao');
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
            gongxin_mp_lvmeng: { audio: 'ext:活动武将/audio/skill:2' },
            //周瑜
            mpyingzi: {
                audio: 'yingzi',
                inherit: 'reyingzi',
                async content(event, trigger, player) {
                    trigger.num += (1 + player.getDamagedHp());
                },
            },
            mpfanjian: {
                audio: 'fanjian',
                inherit: 'refanjian',
                usable: 2,
                get content() {
                    return lib.skill.catfanjian.content;
                },
            },
            //陆逊
            mpqianxun: {
                audio: 'qianxun',
                inherit: 'reqianxun',
                filter(event, player) {
                    if (!player.countCards('h')) return false;
                    if (event.getParent().name === 'phaseJudge') return true;
                    if (event.name === 'judge') return false;
                    if (event.targets?.length > 1) return false;
                    return event.card && event.player !== player && (event.card.name === 'sha' || get.type(event.card) === 'trick');
                },
                check(event, player) {
                    return get.effect(player, event.card, event.player, player) > 0 || !player.hasCard(card => player.canRespond(event, card), 'h');
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (player === target || ['relianying', 'catlianying', 'mplianying'].every(i => !target.hasSkill(i)) || !target.hasFriend()) return;
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
            mplianying: {
                audio: 'lianying',
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
                        return evt.cards?.some(card => get.type2(card, false) === 'trick' || get.type(card, null, false) === 'equip');
                    })) await player.draw();
                },
            },
            //群
            //华佗
            mpjijiu: {
                mod: {
                    aiValue(player, card, num) {
                        if (get.name(card) != 'tao' && get.color(card) != 'red') return;
                        var cards = player.getCards('hs', function (card) {
                            return get.name(card) == 'tao' || get.color(card) == 'red';
                        });
                        cards.sort(function (a, b) {
                            return (get.name(a) == 'tao' ? 1 : 2) - (get.name(b) == 'tao' ? 1 : 2);
                        });
                        var geti = function () {
                            if (cards.includes(card)) {
                                return cards.indexOf(card);
                            }
                            return cards.length;
                        };
                        return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
                    },
                    aiUseful() {
                        return lib.skill.mpjijiu.mod.aiValue.apply(this, arguments);
                    },
                },
                locked: false,
                audio: 'jijiu',
                enable: 'chooseToUse',
                viewAsFilter(player) {
                    return player !== _status.currentPhase && player.countCards('hes', { color: 'red' }) > 0;
                },
                filterCard(card) {
                    return get.color(card) == 'red';
                },
                position: 'hes',
                viewAs: { name: 'tao' },
                prompt: () => lib.translate.mpjijiu_info,
                check(card) {
                    return 1 / (get.value(card) || 0.5);
                },
                async precontent(event, trigger, player) {
                    event.result._apply_args = {
                        oncard: () => {
                            const trigger = get.event();
                            if (get.suit(trigger.card) === 'heart' && get.type(trigger.card) === 'basic') trigger.baseDamage++;
                        },
                    };
                },
            },
            mpqingnang: {
                audio: 'qingnang',
                inherit: 'new_reqingnang',
                usable: 1,
                filter(event, player) {
                    const info = lib.skill.mpqingnang;
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
            mplijian: {
                audio: 'lijian',
                inherit: 'lijian',
                filter(event, player) {
                    const juedou = new lib.element.VCard({ name: 'juedou' });
                    return game.hasPlayer(target => {
                        if (!target.hasSex('male')) return false;
                        return game.hasPlayer(current => {
                            if (!current.hasSex('male') || target === current) return false;
                            return current.canUse(juedou, target, false);
                        });
                    });
                },
                filterTarget(card, player, target) {
                    if (!target.hasSex('male')) return false;
                    const juedou = new lib.element.VCard({ name: 'juedou' });
                    if (ui.selected.targets.length > 0) {
                        return target.canUse(juedou, ui.selected.targets[0], false);
                    }
                    return game.hasPlayer(current => {
                        if (!current.hasSex('male') || target === current) return false;
                        return current.canUse(juedou, target, false);
                    });
                },
                async content(event, trigger, player) {
                    player.addTempSkill(`${event.name}_gain`);
                    await game.delay(0.5);
                    const juedou = new lib.element.VCard({ name: 'juedou' });
                    await event.targets[1].useCard(juedou, event.targets[1], 'noai');
                },
                subSkill: {
                    gain: {
                        charlotte: true,
                        trigger: { global: 'damageEnd' },
                        filter(event, player) {
                            if (!event.player.isIn() || !event.card || event.card.name !== 'juedou') return false;
                            const evt = event.getParent(3);
                            return evt.name === 'mplijian' && evt.player === player;
                        },
                        direct: true,
                        async content(event, trigger, player) {
                            const target = trigger.player, list = ['mplijian', target];
                            const next = player.gainPlayerCard(target, 'he', get.prompt(...list));
                            next.logSkill = list;
                            await next;
                        },
                    },
                },
            },
            mpbiyue: {
                audio: 'biyue',
                inherit: 'biyue',
                async content(event, trigger, player) {
                    await player.draw(1 + (player.countCards('h') < player.getHp()));
                },
            },
            //神
            //神赵云
            mpjuejing: {
                mod: {
                    maxHandcard(player, num) {
                        return 2 + num;
                    },
                    aiOrder(player, card, num) {
                        if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, 'recover')) return num;
                        if (player.needsToDiscard() > 1) return num;
                        return 0;
                    },
                },
                audio: 'xinjuejing',
                trigger: { player: ['dying', 'dyingAfter', 'phaseDrawBegin2'] },
                filter(event, player) {
                    if (event.name !== 'phaseDraw') return true;
                    return !event.numFixed;
                },
                forced: true,
                async content(event, trigger, player) {
                    if (trigger.name !== 'phaseDraw') await player.draw();
                    else trigger.num += 2;
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (target.getHp() > 1) return;
                            if (get.tag(card, 'damage') || get.tag(card, 'loseHp')) return [1, 1];
                        },
                    },
                },
            },
        },
        dynamicTranslate: {
        },
        translate: {
            MiNiApp_standard: '新一将·标准包',
            MiNiApp_shenhua: '新一将·神话再临',
            MiNiApp_yijiang: '新一将·一将成名',
            MiNiApp_xinghuo: '新一将·星火燎原',
            MiNiApp_qunying: '新一将·群英荟萃',
            mp_shen_zhaoyun: '新一将神赵云',
            mpjuejing: '绝境',
            mpjuejing_info: '锁定技。你的手牌上限+2；摸牌阶段，你多摸两张牌；当你进入或脱离濒死状态时，你摸一张牌。',
            mp_liubei: '新一将刘备',
            mprende: '仁德',
            mprende_info: '出牌阶段，你可以将任意张手牌交给一名其他角色，然后本阶段你不能对其发动此技能。若你本阶段因此给出了至少两张牌，则你可以视为使用一张基本牌（有次数限制且计入使用次数，若你本次给出了超出两张牌，则此牌的伤害值/回复值+1）。',
            mp_caocao: '新一将曹操',
            mpjianxiong: '奸雄',
            mpjianxiong_info: '当你受到伤害后，你可以摸一张牌并获得造成伤害的牌。若此牌为【杀】且你的体力值小于伤害来源，则你可以对其使用此牌；若不存在造成伤害的实体牌，则改为摸两张牌。',
            mp_zhaoyun: '新一将赵云',
            mpyajiao: '涯角',
            mpyajiao_info: '当你于回合外使用或打出手牌时，你可以展示牌堆顶一张牌，然后将此牌交给一名角色。若你本次使用或打出的牌为红色，你摸一张牌。',
            mp_machao: '新一将马超',
            mptieji: '铁骑',
            mptieji_info: '当你使用【杀】指定一名角色为目标后，你可以令其本回合非锁定技失效，然后你进行一次判定，除非该角色弃置一张与判定结果花色相同的牌，否则不能使用【闪】抵消此【杀】。若此【杀】造成伤害，则此【杀】不计入次数。',
            mp_ganning: '新一将甘宁',
            mpqixi: '奇袭',
            mpqixi_info: '你可以将一张黑色牌当作【过河拆桥】使用；你使用【过河拆桥】弃置与此牌花色相同的牌后，你摸一张牌。',
            mpfenwei: '奋威',
            mpfenwei_info: '每轮限一次，一名角色使用锦囊牌指定多个目标后，你可以令此牌对任意名目标角色无效。',
            mp_xiahoudun: '新一将夏侯惇',
            mpganglie: '刚烈',
            mpganglie_info: '当你受到1点有来源造成的伤害后，你可进行判定，若结果为：红色，你对伤害来源造成1点伤害；黑色，你弃置伤害来源一张牌并摸一张牌。',
            mpqingjian: '清俭',
            mpqingjian_info: '当你于摸牌阶段外获得牌时，你可以展示任意张牌并交给一名其他角色。每回合限一次，你每以此法交出一种类别的牌，当前回合角色手牌上限+1。',
            mp_xuzhu: '新一将许褚',
            mpluoyi: '裸衣',
            mpluoyi_info: '摸牌阶段开始时，你亮出牌堆顶四张牌。然后你可以获得其中的基本牌、武器牌和【决斗】，若如此做，你放弃摸牌，且以你为伤害来源的【杀】或【决斗】造成的伤害+1直到你的下回合开始。',
            mp_zhugeliang: '新一将诸葛亮',
            mpguanxing: '观星',
            mpguanxing_info: '准备阶段和结束阶段，你可以观看牌堆顶的五张牌，然后以任意顺序将这些牌置于牌堆顶或牌堆底。',
            mp_lvmeng: '新一将吕蒙',
            mpkeji: '克己',
            mpkeji_info: '若你未于本回合出牌阶段使用或打出过【杀】，则你可以跳过弃牌阶段；若你未于本回合出牌阶段使用过牌，则你再摸两张牌。',
            mpqinxue: '勤学',
            mpqinxue_info: `觉醒技，准备阶段，若你的手牌数减体力值大于等于2，则你减1点体力上限，获得技能${get.poptip('gongxin')}，且本回合使用牌无次数限制。`,
            mp_zhouyu: '新一将周瑜',
            mpyingzi: '英姿',
            mpyingzi_info: '锁定技。你的手牌上限视为你的体力上限；摸牌阶段，你额外摸X张牌（X为你已损失的体力值+1）。',
            mpfanjian: '反间',
            mpfanjian_info: '出牌阶段限两次，你可以展示一张手牌并交给一名其他角色，其选择一项：①展示所有手牌，弃置所有与此牌颜色相同的牌；②失去1点体力，随机弃置装备区里的一张牌。',
            mp_luxun: '新一将陆逊',
            mpqianxun: '谦逊',
            mpqianxun_info: '当其他角色使用的锦囊牌或【杀】对你生效时，若你是此牌的唯一目标，则你可以将所有手牌置于你的武将牌上直到回合结束。',
            mplianying: '连营',
            mplianying_info: '当你失去最后的手牌后，你可以令至多X名角色各摸一张牌（X为你此次失去的手牌数）；若你因此获得了锦囊牌或装备牌，则你再摸一张牌。',
            mp_simayi: '新一将司马懿',
            mpguicai: '鬼才',
            mpguicai_info: '当一名角色的判定牌生效前，你可以打出一张牌代替之，然后若此牌颜色和原判定牌不同，则你获得原判定牌。',
            mp_huatuo: '新一将华佗',
            mpjijiu: '急救',
            mpjijiu_info: '你的回合外，你可以将一张红色牌当作【桃】使用。若此牌为红桃基本牌，则回复值+1。',
            mpqingnang: '青囊',
            mpqingnang_info: '出牌阶段限一次，你可以弃置一张牌，令一名角色回复1点体力。若你弃置的是红色牌，则你重置本技能发动次数。',
            mp_huangyueying: '新一将黄月英',
            mpjizhi: '集智',
            mpjizhi_info: '当你使用锦囊牌时，你可以摸一张牌。若此牌为基本牌且当前回合角色为你，则你本回合手牌上限+1（至多+5）。',
            mpqicai: '奇才',
            mpqicai_info: '锁定技。你使用锦囊牌无距离限制；其他角色不能弃置你装备区里的防具牌和宝物牌；当你失去装备里的武器牌或坐骑牌后，你获得弃牌堆中的一张锦囊牌。',
            mp_zhenji: '新一将甄姬',
            mpluoshen: '洛神',
            mpluoshen_info: '准备阶段，你可以进行判定并获得判定牌（本回合不计入手牌上限），若判定结果为黑色，你可重复此流程。',
            mp_diaochan: '新一将貂蝉',
            mplijian: '离间',
            mplijian_info: '出牌阶段限一次，你可以弃置一张牌并选择两名男性角色，令其中一名角色视为对另一名角色使用【决斗】。若有角色因此受伤，你可以获得其一张牌。',
            mpbiyue: '闭月',
            mpbiyue_info: '结束阶段，你可以摸一张牌（若你的手牌数小于体力值则改为摸两张牌）。',

            // ----------------------- 台词部分 ----------------------- //
            '#ext:活动武将/audio/skill/mp1': '',
            '#ext:活动武将/audio/skill/mp2': '',
            '#ext:活动武将/audio/skill/mpyajiao1': '南征北战，誓死相随！',
            '#ext:活动武将/audio/skill/mpyajiao2': '青釭银月，谁与争锋？',
            '#ext:活动武将/audio/skill/mpfenwei1': '奋战无惧，展我军威！',
            '#ext:活动武将/audio/skill/mpfenwei2': '宁上不畏死，众将切莫迟疑！',
            '#ext:活动武将/audio/skill/mpqingjian1': '尽忠舍命，重义轻财！',
            '#ext:活动武将/audio/skill/mpqingjian2': '无功不受禄，散财以犒军。',
            '#ext:活动武将/audio/skill/mpqinxue1': '乐学善思，将勤补拙。',
            '#ext:活动武将/audio/skill/mpqinxue2': '勤学不殆，致诸实用。',
            '#ext:活动武将/audio/skill/gongxin_mp_lvmeng1': '料其图谋不轨，此战易得先机。',
            '#ext:活动武将/audio/skill/gongxin_mp_lvmeng2': '夺敌心事，摆布于股掌之间。',
        },
    };
    for (const i in MiNiAppkill.character) {
        if (Array.isArray(MiNiAppkill.character[i])) MiNiAppkill.character[i] = get.convertedCharacter(MiNiAppkill.character[i]);
        MiNiAppkill.character[i].trashBin ??= [];
        MiNiAppkill.character[i].dieAudios ??= [];
        MiNiAppkill.character[i].tempname ??= [];
        if (!MiNiAppkill.character[i].dieAudios.length) MiNiAppkill.character[i].dieAudios.push(i.slice('mp_'.length));
        if (!MiNiAppkill.character[i].tempname.length) MiNiAppkill.character[i].tempname.push(i.slice('mp_'.length));
        MiNiAppkill.character[i].img = `image/character/${i.slice('mp_'.length)}.jpg`;
        if (MiNiAppkill.translate[i] && !lib.translate[i + '_prefix'] && !MiNiAppkill.translate[i + '_prefix']) {
            if (MiNiAppkill.translate[i].startsWith(get.poptip('rule_mamba'))) MiNiAppkill.translate[i + '_prefix'] = get.poptip('rule_mamba');
            else if (MiNiAppkill.translate[i].startsWith('SP新一将神')) MiNiAppkill.translate[i + '_prefix'] = 'SP|新一将|神';
            else if (MiNiAppkill.translate[i].startsWith('SP新一将')) MiNiAppkill.translate[i + '_prefix'] = 'SP|新一将';
            else if (MiNiAppkill.translate[i].startsWith('新一将神')) MiNiAppkill.translate[i + '_prefix'] = '新一将|神';
            else if (MiNiAppkill.translate[i].startsWith('新一将☆')) MiNiAppkill.translate[i + '_prefix'] = '新一将|☆';
            else if (MiNiAppkill.translate[i].startsWith('新一将谋')) MiNiAppkill.translate[i + '_prefix'] = '新一将|谋';
            else if (MiNiAppkill.translate[i].startsWith('新一将界')) MiNiAppkill.translate[i + '_prefix'] = '新一将|界';
            else if (MiNiAppkill.translate[i].startsWith('新一将') || MiNiAppkill.translate[i + '_ab']?.startsWith('新一将')) MiNiAppkill.translate[i + '_prefix'] = '新一将';
        }
    }
    lib.namePrefix.set('新一将', {
        getSpan: () => `${get.prefixSpan('RE')}${get.prefixSpan('将')}`,
    });
    lib.config.all.sgscharacters.push('MiNiAppkill');
    lib.translate['MiNiAppkill_character_config'] = '<span style="font-family: xingkai">新一将小程序</span>';
    return MiNiAppkill;
};

export default packs;