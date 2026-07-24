import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MX_catcatcup = {
        name: 'MX_catcatcup',
        connect: true,
        characterSort: {
            MX_catcatcup: {
                cat_yongguansanjun: ['cat_re_ganning'],
                cat_weiwoqianli: ['cat_re_zhouyu'],
                cat_shenhua_lin: ['cat_ol_xuhuang', 'cat_sunjian', 'cat_zhurong', 'cat_jiaxu', 'cat_re_lusu'],
                cat_shenhua_yin: ['cat_yanyan', 'cat_wangping', 'cat_sunliang', 'cat_wangji', 'cat_kuailiangkuaiyue', 'cat_yl_luzhi'],
                cat_shenhua_lei: ['cat_chendao', 'cat_guanqiujian', 'cat_yl_yuanshu'],
            },
        },
        character: {
            cat_re_ganning: ['male', 'wu', 4, ['catqixi', 'fenwei']],
            cat_re_zhouyu: ['male', 'wu', 3, ['catyingzi', 'catfanjian']],
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
            cat_yongguansanjun: '喵喵杯·勇冠三军',
            cat_weiwoqianli: '喵喵杯·帷幄千里',
            cat_shenhua_lin: '喵喵杯·神话再临·林',
            cat_shenhua_yin: '喵喵杯·神话再临·阴',
            cat_shenhua_lei: '喵喵杯·神话再临·雷',
            cat_re_ganning: '甘宁',
            catqixi: '奇袭',
            catqixi_info: `你可以将一张黑色牌当作【过河拆桥】使用。你因以此法转化的【过河拆桥】弃置了与此牌花色相同的牌后重置${get.poptip('fenwei')}。`,
            cat_re_zhouyu: '周瑜',
            catyingzi: '英姿',
            catyingzi_info: '锁定技。你的手牌上限视为你的体力上限；摸牌阶段，你额外摸一张牌（若你的手牌数小于2则改为额外摸两张牌）。',
            catfanjian: '反间',
            catfanjian_info: '出牌阶段限一次，你可以展示一张手牌并交给一名其他角色，其选择一项：①展示所有手牌，弃置所有与此牌颜色相同的牌；②失去1点体力，随机弃置装备区里的一张牌。',
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