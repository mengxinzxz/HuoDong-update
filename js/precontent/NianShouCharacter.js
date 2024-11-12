import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    var NianShouCharacter = {
        name: 'NianShouCharacter',
        connect: true,
        characterSort: {
            NianShouCharacter: {
                NianShouCharacterSX: ['NS_zishu', 'NS_chouniu', 'NS_yinhu', 'NS_maotu', 'NS_chenlong', 'NS_sishe', 'NS_wuma', 'NS_weiyang', 'NS_shenhou', 'NS_youji', 'NS_xugou', 'NS_haizhu'],
                NianShouCharacter2018: ['NS_nianshouC', 'NS_nianshouB', 'NS_nianshouA'],
                NianShouCharacter2019: ['NS_nianshouyin', 'NS_nianshouyang'],
            },
        },
        character: {
            NS_zishu: ['male', 'qun', 3, ['cxy_ZiShu']],
            NS_chouniu: ['male', 'qun', '1/5', ['YJchouniu']],
            NS_yinhu: ['male', 'qun', 4, ['cxy_YinHu']],
            NS_maotu: ['female', 'qun', 3, ['YJmaotu']],
            NS_chenlong: ['male', 'qun', 4, ['YJchenlong']],
            NS_sishe: ['female', 'qun', 3, ['cxy_SiShe']],
            NS_wuma: ['male', 'qun', 4, ['YJwuma']],
            NS_weiyang: ['female', 'qun', 3, ['cxy_WeiYang']],
            NS_shenhou: ['male', 'qun', 3, ['cxy_ShenHou']],
            NS_youji: ['male', 'qun', 3, ['YJyouji']],
            NS_xugou: ['male', 'qun', 4, ['cxy_XuGou']],
            NS_haizhu: ['male', 'qun', 5, ['cxy_HaiZhu']],

            NS_nianshouA: ['male', 'shen', 6, ['cxy_JiYuan', 'cxy_SuiZhongE', 'cxy_CuiKuE']],
            NS_nianshouB: ['male', 'shen', 8, ['cxy_JiYuan', 'cxy_NianYi', 'cxy_SuiZhongN', 'cxy_CuiKuN']],
            NS_nianshouC: ['male', 'shen', 0, ['cxy_JiYuan', 'cxy_NianYiD', 'cxy_SuiZhongN', 'cxy_CuiKuD']],

            NS_nianshouyang: ['male', 'shen', 6, ['NSyangshou', 'NSbeimingyang', 'NSnuyan', 'NShundunyang']],
            NS_nianshouyin: ['female', 'shen', 6, ['NSyinshou', 'NSbeimingyin', 'NShuihun', 'NShundunyin']],
        },
        skill: {
            cxy_ZiShu: {
                audio: 'ext:活动武将/audio/skill:true',
                enable: 'phaseUse',
                usable: 1,
                selectTarget: 1,
                filterTarget: function (card, player, target) {
                    return target != player && target.num('h') > player.num('h');
                },
                content: function () {
                    'step 0'
                    player.gainPlayerCard(target, 'h', true);
                    if (!game.hasPlayer(function (current) {
                        return current != player && current.num('h') > player.num('h');
                    })) event.finish();
                    'step 1'
                    player.chooseTarget('子鼠：你可以获得手牌数大于你的其他角色一张手牌，然后你可以重复此流程直到你的手牌数为全场最多', function (card, player, target) {
                        return target != player && target.num('h') > player.num('h');
                    }).set('ai', function (target) {
                        var att = get.attitude(player, target);
                        if (target > 0) {
                            return -1;
                        }
                        return 2 + Math.random();
                    });
                    'step 2'
                    if (result.bool) {
                        player.line(result.targets[0]);
                        player.gainPlayerCard(result.targets[0], 'h', true);
                    }
                    else event.finish();
                    'step 3'
                    if (game.hasPlayer(function (current) {
                        return current != player && current.num('h') > player.num('h');
                    })) event.goto(1);
                },
                ai: {
                    threaten: 1.2,
                    order: 1,
                    result: {
                        player: 1,
                        target: -1,
                    },
                },
            },
            YJchouniu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.isMinHp();
                },
                forced: true,
                content() {
                    player.recover();
                },
            },
            cxy_YinHu: {
                init: function (player) {
                    player.storage.cxy_YinHu = [];
                    player.storage.cxy_YinHu_type = [];
                },
                marktext: '虎',
                intro: {
                    name: '弃置过的牌',
                    content: function (storage, player) { return '' },
                    mark: function (dialog, content, player) {
                        if (content.length) {
                            dialog.addSmall([content, 'vcard']);
                        }
                    },
                    markcount: function (storage, player) {
                        return storage.length;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                enable: 'phaseUse',
                filter: function (event, player) {
                    return !player.hasSkill('cxy_YinHu_filter') && player.num('he');
                },
                filterCard: function (card, player) {
                    return !player.storage.cxy_YinHu_type.includes(get.type(card));
                },
                filterTarget: lib.filter.notMe,
                check: function (card) {
                    return 8 - get.value(card);
                },
                position: 'he',
                contentBefore: function () {
                    player.storage.cxy_YinHu_type.push(get.type(cards[0]));
                    player.storage.cxy_YinHu.push([get.translation(get.type(cards[0])), '', cards[0].name]);
                    player.markSkill('cxy_YinHu');
                    player.syncStorage('cxy_YinHu');
                },
                content: function () {
                    'step 0'
                    player.addSkill('cxy_YinHu_dying');
                    target.damage(player);
                    'step 1'
                    if (!player.hasSkill('cxy_YinHu_dying')) player.addTempSkill('cxy_YinHu_filter');
                    else player.removeSkill('cxy_YinHu_dying');
                },
                ai: {
                    threaten: 1.8,
                    order: 5,
                    result: {
                        target: function (player, target) {
                            return get.sgn(get.attitude(player, target)) * get.damageEffect(target, player, player);
                        },
                    },
                },
                group: 'cxy_YinHu_mark',
                subSkill: {
                    mark: {
                        charlotte: true,
                        trigger: { player: 'phaseUseAfter' },
                        direct: true,
                        content: function () {
                            player.storage.cxy_YinHu = [];
                            player.storage.cxy_YinHu_type = [];
                            player.unmarkSkill('cxy_YinHu');
                        },
                    },
                    filter: { charlotte: true },
                    dying: {
                        trigger: { global: 'dying' },
                        priority: 15,
                        direct: true,
                        filter: function (event, player) {
                            return event.reason && event.reason.getParent().name == 'cxy_YinHu';
                        },
                        content: function () {
                            player.removeSkill('cxy_YinHu_dying');
                        },
                    },
                },
            },
            YJmaotu: {
                mod: {
                    targetEnabled: function (card, player, target) {
                        if (!target.hasMark('YJmaotu')) return;
                        if (player != target && player.hp >= target.hp) return false;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseBegin', global: 'dieAfter' },
                filter: function (event, player) {
                    return event.name == 'die' || player.countMark('YJmaotu') > 0;
                },
                forced: true,
                content: function () {
                    player[trigger.name == 'die' ? 'addMark' : 'removeMark']('YJmaotu', 1);
                },
            },
            YJchenlong: {
                audio: 'ext:活动武将/audio/skill:true',
                skillAnimation: true,
                animationColor: 'fire',
                mark: true,
                limited: true,
                enable: 'phaseUse',
                filterTarget: lib.filter.notMe,
                contentBefore: function () {
                    player.addSkill('YJchenlong_temp');
                },
                content: function () {
                    'step 0'
                    player.awakenSkill('YJchenlong');
                    var map = {};
                    var list = [];
                    for (var i = 1; i <= Math.min(5, player.hp); i++) {
                        var cn = get.cnNumber(i, true);
                        map[cn] = i;
                        list.push(cn);
                    }
                    event.map = map;
                    player.chooseControl(list).set('prompt', '失去任意点体力并对' + get.translation(target) + '造成等量的伤害').set('goon', list[list.length - 1]).set('ai', () => _status.event.goon);
                    'step 1'
                    var num = event.map[result.control] || player.hp;
                    player.loseHp(num);
                    target.damage(num, player);
                },
                contentAfter: function () {
                    player.removeSkill('YJchenlong_temp');
                },
                ai: {
                    order: 1,
                    result: { target: -1 },
                },
                subSkill: {
                    temp: {
                        charlotte: true,
                        trigger: { player: 'dying' },
                        direct: true,
                        content: function () {
                            'step 0'
                            player.addMark('ChenLongMark', player.maxHp - 1, false);
                            player.recover(1 - player.hp);
                            'step 1'
                            player.loseMaxHp();
                            'step 2'
                            player.removeSkill('YJchenlong_temp');
                        },
                    },
                },
            },
            cxy_SiShe: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                filter: function (event, player) {
                    return event.source && event.source.isIn();
                },
                check: function (event, player) {
                    return get.damageEffect(event.source, player, player) > 0;
                },
                logTarget: 'source',
                content: function () {
                    trigger.source.damage(trigger.num, player);
                },
                ai: {
                    threaten: 0.6,
                    maixie: true,
                    effect: {
                        target: function (card, player, target) {
                            if (player.hasSkillTag('jueqing', false, target)) return [1, -1.5];
                            if (!target.hasFriend()) return;
                            if (get.tag(card, 'damage')) return [1, 0, 0, -0.7];
                        },
                    },
                },
            },
            YJwuma: {
                init: function (player) {
                    if (player.isTurnedOver()) {
                        player.logSkill('YJwuma');
                        player.turnOver();
                    }
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'useCardToBegin' },
                filter: function (event, player) {
                    return event.player != player && ['trick', 'delay'].includes(get.type(event.card));
                },
                forced: true,
                content: function () {
                    player.draw();
                },
                group: ['YJwuma_turn', 'YJwuma_skip'],
                subSkill: {
                    turn: {
                        audio: 'YJwuma',
                        trigger: { player: 'turnOverBefore' },
                        filter: function (event, player) {
                            return !player.isTurnedOver();
                        },
                        forced: true,
                        content: function () {
                            trigger.cancel();
                        },
                    },
                    skip: {
                        audio: 'YJwuma',
                        trigger: { player: ['phaseJudgeSkipped', 'phaseJudgeCancelled', 'phaseDrawSkipped', 'phaseDrawCancelled', 'phaseUseSkipped', 'phaseUseCancelled', 'phaseDiscardSkipped', 'phaseDiscardCancelled', 'phaseZhunbeiSkipped', 'phaseZhunbeiCancelled', 'phaseJieshuSkipped', 'phaseJieshuCancelled'] },
                        forced: true,
                        content: function () {
                            game.log(player, '恢复了', trigger.name);
                            player[trigger.name]()._triggered = null;
                        },
                    },
                },
            },
            cxy_WeiYang: {
                audio: 'ext:活动武将/audio/skill:true',
                enable: 'phaseUse',
                usable: 1,
                selectCard: [1, Infinity],
                filterCard: function (card, player) {
                    for (var i = 0; i < ui.selected.cards.length; i++) {
                        if (get.type(card) == get.type(ui.selected.cards[i])) return false;
                    }
                    return true;
                },
                position: 'he',
                complexCard: true,
                selectTarget: function () {
                    return ui.selected.cards.length;
                },
                filterTarget: function (card, player, target) {
                    return target.hp < target.maxHp;
                },
                check: function (card) {
                    var player = _status.event.player;
                    var count = game.filterPlayer(function (current) {
                        return current.isDamaged() && get.attitude(player, current) > 2;
                    }).length;
                    if (ui.selected.cards.length >= count) return -1;
                    return 8 - get.value(card);
                },
                content: function () {
                    target.recover(player);
                },
                ai: {
                    threaten: 1.2,
                    order: 4,
                    result: {
                        target: 1,
                    },
                },
            },
            cxy_ShenHou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'shaBefore' },
                content: function () {
                    'step 0'
                    player.judge(function (card) {
                        return get.color(card) == 'red' ? 2 : -2;
                    });
                    'step 1'
                    if (result.bool) trigger.cancel();
                },
                ai: {
                    effect: {
                        target: function (card, player, target) {
                            if (card.name == 'sha') return [1, 0.4];
                        },
                    },
                },
            },
            YJyouji: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin2' },
                forced: true,
                filter: function (event, player) {
                    return game.roundNumber > 0 && !event.numFixed;
                },
                content: function () {
                    trigger.num += Math.min(5, game.roundNumber);
                },
                ai: {
                    threaten: function (player, target) {
                        return 1 + Math.min(5, game.roundNumber) / 2;
                    },
                },
            },
            cxy_XuGou: {
                mod: {
                    targetInRange: function (card, player, target, now) {
                        if (card.name == 'sha' && get.color(card) == 'red') return true;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: {
                    source: 'damageBegin',
                },
                filter: function (event, player) {
                    return event.card && (event.card.name == 'sha' && get.color(event.card) == 'red') && event.notLink();
                },
                forced: true,
                content: function () {
                    trigger.num++;
                },
                ai: {
                    effect: {
                        player: function (card, player, target) {
                            if (card.name == 'sha' && get.color(card) == 'red') {
                                if (get.attitude(player, target) > 0) return [1, -0.5];
                                return [1, 0.8];
                            }
                        },
                    },
                },
                group: 'cxy_XuGou_buff',
                subSkill: {
                    buff: {
                        trigger: { target: 'shaBefore' },
                        filter: function (event, player) {
                            return get.color(event.card) == 'red';
                        },
                        forced: true,
                        content: function () {
                            trigger.cancel();
                        },
                        ai: {
                            effect: {
                                target: function (card, player, target) {
                                    if (card.name == 'sha' && get.color(card) == 'red') return 'zerotarget';
                                },
                            },
                        },
                    },
                },
            },
            cxy_HaiZhu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'discardAfter' },
                filter: function (event, player) {
                    if (event.player == player) return false;
                    if (event.cards && event.cards.length) {
                        for (var i = 0; i < event.cards.length; i++) {
                            if (get.color(event.cards[i]) == 'black' && get.position(event.cards[i]) == 'd') {
                                return true;
                            }
                        }
                    }
                    return false;
                },
                forced: true,
                content: function () {
                    'step 0'
                    if (trigger.delay == false) game.delay();
                    'step 1'
                    var cards = [];
                    for (var i = 0; i < trigger.cards.length; i++) {
                        if (get.color(trigger.cards[i]) == 'black' && get.position(trigger.cards[i]) == 'd') {
                            cards.push(trigger.cards[i]);
                        }
                    }
                    if (cards.length) player.gain(cards, 'gain2');
                },
                group: 'cxy_HaiZhu_buff',
                subSkill: {
                    buff: {
                        audio: 'cxy_HaiZhu',
                        trigger: { player: 'phaseBegin' },
                        filter: function (event, player) {
                            return !game.hasPlayer(function (current) {
                                return current != player && current.num('h') > player.num('h');
                            });
                        },
                        forced: true,
                        content: function () {
                            player.loseHp();
                        },
                    },
                },
            },
            YJjinzhu: {
                mod: {
                    maxHandcard: function (player, num) {
                        return num + 1;
                    },
                },
                group: 'YJjinzhu_fuhuo',
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin2' },
                forced: true,
                filter: function (event, player) {
                    return !event.numFixed;
                },
                content: function () {
                    trigger.num++;
                },
                subSkill: {
                    fuhuo: {
                        audio: 'YJjinzhu',
                        skillAnimation: true,
                        animationColor: 'fire',
                        trigger: { player: 'dieBegin' },
                        forced: true,
                        content: function () {
                            'step 0'
                            player.removeSkills('YJjinzhu');
                            'step 1'
                            if (player.hp < 3) player.recover(3 - player.hp);
                            'step 2'
                            trigger.cancel();
                        },
                    },
                },
            },
            cxy_JiYuan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseJieshuBegin' },
                forced: true,
                content: function () {
                    player.draw(Math.round(player.maxHp / 2));
                },
            },
            cxy_SuiZhongE: {
                unique: true,
                skillAnimation: true,
                animationColor: 'fire',
                mark: true,
                intro: { content: 'limited' },
                trigger: { player: 'dying' },
                audio: 'cxy_SuiZhongN',
                filter: function (event, player) {
                    return !player.storage.cxy_SuiZhongE;
                },
                content: function () {
                    'step 0'
                    player.storage.cxy_SuiZhongE = true;
                    player.awakenSkill('cxy_SuiZhongE');
                    player.recover(1 - player.hp);
                    'step 1'
                    if (_status.dying.includes(player)) _status.dying.remove(player);
                    'step 2'
                    if (_status.currentPhase != player) {
                        var evt = _status.event.getParent('phase');
                        if (evt) {
                            game.resetSkills();
                            _status.event = evt;
                            _status.event.finish();
                        }
                    }
                },
            },
            cxy_CuiKuE: {
                audio: 'cxy_CuiKuD',
                trigger: { global: ['phaseBefore', 'roundStart'] },
                filter: function (event, player) {
                    if (event.name != 'phase') return game.roundNumber % 6 == 0;
                    return game.phaseNumber == 0;
                },
                forced: true,
                content: function () {
                    'step 0'
                    player.chooseTarget('请选择〖摧枯〗的目标', lib.translate.cxy_CuiKuE_info, lib.filter.notMe, true).ai = function (target) {
                        return 2 - get.attitude(player, target);
                    };
                    'step 1'
                    player.line(result.targets[0]);
                    result.targets[0].damage(2, player);
                },
            },
            cxy_NianYi: {
                mod: {
                    targetInRange: function (card, player, target) {
                        return true;
                    },
                },
                audio: 'cxy_NianYiD',
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                filter: function (event, player) {
                    return player.countCards('j') > 0
                },
                content: function () {
                    player.discard(player.getCards('j').randomGet());
                },
            },
            cxy_SuiZhongN: {
                unique: true,
                skillAnimation: true,
                animationColor: 'fire',
                mark: true,
                intro: { content: 'limited' },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'dying' },
                filter: function (event, player) {
                    return !player.storage.cxy_SuiZhongN;
                },
                content: function () {
                    'step 0'
                    player.storage.cxy_SuiZhongN = true;
                    player.awakenSkill('cxy_SuiZhongN');
                    player.recover(1 - player.hp);
                    event.targets = game.filterPlayer(function (current) {
                        return current != player;
                    });
                    event.targets.sort(lib.sort.seat);
                    'step 1'
                    for (var i = 0; i < event.targets.length; i++) event.targets[i].discard(event.targets[i].getCards('he'));
                    if (_status.currentPhase == player) event.finish();
                    'step 2'
                    if (_status.dying.includes(player)) _status.dying.remove(player);
                    'step 3'
                    var evt = _status.event.getParent('phase');
                    if (evt) {
                        game.resetSkills();
                        _status.event = evt;
                        _status.event.finish();
                    }
                },
            },
            cxy_CuiKuN: {
                audio: 'cxy_CuiKuD',
                trigger: { global: ['phaseBefore', 'roundStart'] },
                filter: function (event, player) {
                    if (event.name != 'phase') return game.roundNumber % 6 == 0;
                    return game.phaseNumber == 0;
                },
                forced: true,
                content: function () {
                    'step 0'
                    player.chooseTarget('请选择〖摧枯〗的目标', lib.translate.cxy_CuiKuN_info, lib.filter.notMe, [1, 2], true).ai = function (target) {
                        return 2 - get.attitude(player, target);
                    };
                    'step 1'
                    player.line(result.targets);
                    for (var i = 0; i < result.targets.length; i++) {
                        result.targets[i].damage(2, player);
                    }
                },
            },
            cxy_NianYiD: {
                mod: {
                    targetInRange: function (card, player, target) {
                        return true;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseBegin' },
                forced: true,
                filter: function (event, player) {
                    return player.countCards('j') > 0
                },
                content: function () {
                    player.discard(player.getCards('j').randomGet());
                },
                group: 'cxy_NianYiD_buff',
                subSkill: {
                    buff: {
                        forced: true,
                        trigger: { global: 'phaseJieshuBegin' },
                        filter: function (event, player) {
                            if (_status.currentPhase == player) return false;
                            var num = 0;
                            player.getHistory('lose', function (evt) {
                                if (evt.cards2) num += evt.cards2.length;
                            });
                            return num >= 3;
                        },
                        content: function () {
                            'step 0'
                            event.targets = game.filterPlayer(function (current) {
                                return current != player;
                            });
                            event.targets.sort(lib.sort.seat);
                            player.logSkill('cxy_NianYiD', event.targets);
                            'step 1'
                            for (var i = 0; i < event.targets.length; i++) {
                                event.targets[i].damage(player);
                            }
                        },
                    },
                },
            },
            cxy_CuiKuD: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: ['phaseBefore', 'roundStart'] },
                filter: function (event, player) {
                    if (event.name != 'phase') return game.roundNumber % 6 == 0;
                    return game.phaseNumber == 0;
                },
                direct: true,
                content: function () {
                    'step 0'
                    event.targets = game.filterPlayer(function (current) {
                        return current != player;
                    });
                    event.targets.sort(lib.sort.seat);
                    player.logSkill('cxy_CuiKuD', event.targets);
                    'step 1'
                    for (var i = 0; i < event.targets.length; i++) {
                        event.targets[i].damage(Math.floor(event.targets[i].hp / 2));
                    }
                    'step 2'
                    var num = game.filterPlayer(function (current) {
                        return current != player && current.maxHp % 2 != 0;
                    }).length;
                    player.draw(num);
                },
            },
            NSyangshou: {
                mod: {
                    judge: function (player, result) {
                        if (_status.event.cardname == 'lebu' || _status.event.cardname == 'bingliang') {
                            if (result.bool == false) result.bool = true;
                            else result.bool = false;
                        }
                    },
                },
                group: ['NSyangshou_damage', 'NSyangshou_draw'],
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'turnOverAfter' },
                forced: true,
                filter: function (event, player) {
                    return player.isTurnedOver() && game.hasPlayer(function (current) {
                        return current.name == 'NS_nianshouyin' && current.isTurnedOver();
                    });
                },
                logTarget: function (event, player) {
                    return game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyin' && current.isTurnedOver();
                    });
                },
                content: function () {
                    var targets = game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyin' && current.isTurnedOver();
                    });
                    for (var i of targets) i.turnOver();
                },
                subSkill: {
                    damage: {
                        audio: 'ext:活动武将/audio/skill:true',
                        inherit: 'shixin',
                    },
                    draw: {
                        audio: 'ext:活动武将/audio/skill:true',
                        trigger: { player: 'phaseDrawBegin2' },
                        filter: function (event, player) {
                            return !event.numFixed;
                        },
                        forced: true,
                        content: function () {
                            trigger.num += 2;
                        },
                    },
                },
            },
            NSyinshou: {
                mod: {
                    judge: function (player, result) {
                        if (_status.event.cardname == 'lebu' || _status.event.cardname == 'bingliang') {
                            if (result.bool == false) result.bool = true;
                            else result.bool = false;
                        }
                    },
                },
                group: ['NSyinshou_damage', 'NSyinshou_draw'],
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'turnOverEnd' },
                forced: true,
                filter: function (event, player) {
                    return player.isTurnedOver() && game.hasPlayer(function (current) {
                        return current.name == 'NS_nianshouyang' && current.isTurnedOver();
                    });
                },
                logTarget: function (event, player) {
                    return game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyang' && current.isTurnedOver();
                    });
                },
                content: function () {
                    var targets = game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyang' && current.isTurnedOver();
                    });
                    for (var i of targets) i.turnOver();
                },
                subSkill: {
                    damage: {
                        audio: 'ext:活动武将/audio/skill:true',
                        trigger: { player: 'damageBegin4' },
                        filter: function (event, player) {
                            return event.hasNature('thunder');
                        },
                        forced: true,
                        content: function () {
                            trigger.cancel();
                        },
                        ai: {
                            nothunder: true,
                            effect: {
                                target: function (card, player, target, current) {
                                    if (get.tag(card, 'thunderDamage')) return 'zerotarget';
                                },
                            },
                        },
                    },
                    draw: {
                        audio: 'ext:活动武将/audio/skill:true',
                        trigger: { player: 'phaseJieshuBegin' },
                        forced: true,
                        content: function () {
                            player.draw(2);
                        },
                    },
                },
            },
            NSbeimingyang: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'die' },
                filter: function (event, player) {
                    return player.getEnemies().length > 0;
                },
                forceDie: true,
                forced: true,
                skillAnimation: true,
                animationColor: 'orange',
                content: function () {
                    'step 0'
                    event.players = get.players(player);
                    'step 1'
                    if (event.players.length) {
                        var current = event.players.shift();
                        if (current.isEnemyOf(player)) {
                            player.line(current, 'fire');
                            current.damage('fire');
                        }
                        event.redo();
                    }
                },
            },
            NSbeimingyin: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'die' },
                filter: function (event, player) {
                    return player.getEnemies().length > 0;
                },
                forceDie: true,
                forced: true,
                skillAnimation: true,
                animationColor: 'thunder',
                content: function () {
                    'step 0'
                    event.players = get.players(player);
                    'step 1'
                    if (event.players.length) {
                        var current = event.players.shift();
                        if (current.isEnemyOf(player)) {
                            player.line(current, 'thunder');
                            current.damage('thunder');
                        }
                        event.redo();
                    }
                },
            },
            NSnuyan: {
                audio: 'ext:活动武将/audio/skill:true',
                enable: 'phaseUse',
                usable: 1,
                filter: function (event, player) {
                    return player.countCards('h', { color: 'red' }) > 0;
                },
                filterCard: function (card, player, target) {
                    return get.color(card, player) == 'red';
                },
                check: function (card) {
                    return 7 - get.value(card);
                },
                content: function () {
                    player.loseHp();
                    player.addTempSkill('NSnuyan_damage');
                },
                ai: {
                    order: 10,
                    result: {
                        player: function (player, target) {
                            if (player.countCards('h', function (card) {
                                return get.tag(card, 'damage') && get.color(card) == 'red';
                            }) > 2 && player.hp > 1) return 1;
                            return 0;
                        },
                    },
                },
                subSkill: {
                    damage: {
                        audio: 'NSnuyan',
                        trigger: { source: 'damageBegin3' },
                        filter: function (event, player) {
                            return event.card && get.color(event.card, player) == 'red';
                        },
                        forced: true,
                        content: function () {
                            game.setNature(trigger, 'fire');
                            trigger.num++;
                        },
                        ai: { fireAttack: true },
                    },
                },
            },
            NShuihun: {
                audio: 'ext:活动武将/audio/skill:true',
                enable: 'phaseUse',
                usable: 1,
                filter: function (event, player) {
                    return player.countCards('h', { color: 'black' }) > 0 && game.hasPlayer(function (current) {
                        return current.isDamaged();
                    });
                },
                filterTarget: function (card, player, target) {
                    return target.isDamaged();
                },
                filterCard: function (card, player, target) {
                    return get.color(card, player) == 'black';
                },
                content: function () {
                    player.loseHp();
                    target.recover(2);
                },
                ai: {
                    order: 1,
                    result: {
                        player: function (player, target) {
                            if (player.hp > 1 || player.countCards('h', function (card) {
                                return card.name == 'tao' || card.name == 'jiu';
                            }) > 0) return 1;
                            return 0;
                        },
                        target: 1,
                    },
                },
            },
            NShundunyang: {
                group: 'NShundunyang_die',
                derivation: 'NShuihun',
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                skillAnimation: true,
                animationColor: 'thunder',
                juexingji: true,
                unique: true,
                filter: function (event, player) {
                    return game.dieYinShou == true;
                },
                forced: true,
                content: function () {
                    'step 0'
                    player.awakenSkill('NShundunyang');
                    player.gainMaxHp();
                    player.recover();
                    'step 1'
                    player.addSkills('NShuihun');
                },
                subSkill: {
                    die: {
                        charlotte: true,
                        trigger: { global: 'dieAfter' },
                        filter: function (event, player) {
                            return event.player.name == 'NS_nianshouyin';
                        },
                        forceDie: true,
                        direct: true,
                        content: function () {
                            game.dieYinShou = true;
                        },
                    },
                },
            },
            NShundunyin: {
                group: 'NShundunyin_die',
                derivation: 'NSnuyan',
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                skillAnimation: true,
                animationColor: 'fire',
                juexingji: true,
                unique: true,
                filter: function (event, player) {
                    return game.dieYangShou == true;
                },
                forced: true,
                content: function () {
                    'step 0'
                    player.awakenSkill('NShundunyin');
                    player.gainMaxHp();
                    player.recover();
                    'step 1'
                    player.addSkills('NSnuyan');
                },
                subSkill: {
                    die: {
                        charlotte: true,
                        trigger: { global: 'dieAfter' },
                        filter: function (event, player) {
                            return event.player.name == 'NS_nianshouyang';
                        },
                        forceDie: true,
                        direct: true,
                        content: function () {
                            game.dieYangShou = true;
                        },
                    },
                },
            },
        },
        translate: {
            NianShouCharacterSX: '十二生肖',
            NianShouCharacter2018: '年兽2018',
            NianShouCharacter2019: '年兽2019',
            'NS_zishu': '子鼠',
            'NS_chouniu': '丑牛',
            'NS_yinhu': '寅虎',
            'NS_maotu': '卯兔',
            'NS_chenlong': '辰龙',
            'NS_sishe': '巳蛇',
            'NS_wuma': '午马',
            'NS_weiyang': '未羊',
            'NS_shenhou': '申猴',
            'NS_youji': '酉鸡',
            'NS_xugou': '戌狗',
            'NS_haizhu': '亥猪',
            'NS_nianshouA': '简单年兽',
            'NS_nianshouB': '普通年兽',
            'NS_nianshouC': '困难年兽',
            cxy_RuiShou: '瑞兽',
            cxy_ZiShu: '子鼠',
            YJchouniu: '丑牛',
            cxy_YinHu: '寅虎',
            YJmaotu: '卯兔',
            YJmaotu2: '卯兔',
            YJchenlong: '辰龙',
            cxy_SiShe: '巳蛇',
            YJwuma: '午马',
            cxy_WeiYang: '未羊',
            cxy_ShenHou: '申猴',
            YJyouji: '酉鸡',
            cxy_XuGou: '戌狗',
            cxy_HaiZhu: '亥猪',
            YJjinzhu: '金猪',
            'cxy_RuiShou_info': ' 锁定技，你只会受到与你势力相同的角色造成的伤害且你只能对其造成伤害；一名生肖死亡后，与该生肖势力相同的角色也能对你造成伤害。',
            'cxy_ZiShu_info': '出牌阶段限一次，你可以获得手牌数大于你的其他角色一张手牌，你可以重复此流程直到你的手牌数为全场最多。',
            'YJchouniu_info': '锁定技，结束阶段，若你的体力值为全场最小，则你回复1点体力。',
            'cxy_YinHu_info': '出牌阶段，你可以弃置一张牌（以此法弃置的牌须类型各不相同），然后对一名其他角色造成1点伤害；若你以此法导致一名角色进入濒死状态，则此技能失效直到回合结束。',
            'YJmaotu_info': '锁定技，其他角色死亡后，你获得1枚“卯兔”标记。若你拥有“卯兔”标记，则你不是体力值大于等于你的其他角色使用牌的合法目标。回合开始时，你失去1枚“卯兔”标记。',
            'YJchenlong_info': '限定技，出牌阶段，你可以失去任意点体力（至多为5），然后对一名其他角色造成等量的伤害。若你以此法进入濒死状态，则你将体力值回复至1，然后减1点体力上限。',
            'cxy_SiShe_info': '当你受到伤害后，你可以对伤害来源造成等量伤害。',
            'YJwuma_info': '锁定技，你不能被翻面；你的阶段不会被跳过；当你成为其他角色使用锦囊牌的目标后，你摸一张牌。',
            'cxy_WeiYang_info': '出牌阶段限一次，你可以弃置任意张不同类型的牌，然后令至多等量角色回复1点体力。',
            'cxy_ShenHou_info': '当你成为【杀】的目标时，你可以进行判定，若结果为红色，则此【杀】对你无效。',
            'YJyouji_info': '锁定技，摸牌阶段，你多摸X张牌（X为游戏轮数且X至多为5）。',
            'cxy_XuGou_info': '锁定技，红色【杀】对你无效；你使用红色【杀】无距离限制且造成伤害+1。',
            'cxy_HaiZhu_info': '锁定技，当其他角色的黑色牌因弃置而置入弃牌堆后，你获得这些牌。准备阶段，若你的手牌数为全场最多，你失去1点体力。',
            'YJjinzhu_info': '锁定技，你的手牌上限和额定摸牌数+1。锁定技，当你死亡时，你失去技能〖金猪〗，复活并将体力回复至三点(其他区域的牌均不会发生改变)。',
            cxy_JiYuan: '汲源',
            cxy_SuiZhongN: '岁终',
            cxy_SuiZhongE: '岁终',
            cxy_CuiKuN: '摧枯',
            cxy_CuiKuE: '摧枯',
            cxy_CuiKuD: '摧枯',
            cxy_NianYi: '年裔',
            cxy_NianYiD: '年裔',
            'dying_info': '',
            'cxy_JiYuan_info': '锁定技，结束阶段，你摸X张牌（X为体力上限的一半，向上取整）。',
            'cxy_SuiZhongN_info': '限定技，当你处于濒死状态时，你可以将体力值回复至1，然后令其他角色弃置所有牌，若当前回合角色不为你，则结束当前回合。',
            'cxy_SuiZhongE_info': '限定技，当你处于濒死状态时，你可以将体力值回复至1，若当前回合角色不为你，则结束当前回合。',
            'cxy_CuiKuN_info': '锁定技，游戏开始时或游戏每进行6轮时，你对至多2名其他角色造成2点伤害。',
            'cxy_CuiKuE_info': '锁定技，游戏开始时或游戏每进行6轮时，你对至多1名其他角色造成2点伤害。',
            'cxy_CuiKuD_info': '锁定技，游戏开始时或游戏每进行6轮时，你对所有其他角色造成X点伤害（X为其体力值一半，向下取整），然后每有一名体力上限为奇数的其他角色，你便摸一张牌。',
            'cxy_NianYi_info': '锁定技，你使用牌无距离限制。准备阶段开始时，你随机弃置你判定区内的一张牌。',
            'cxy_NianYiD_info': ' 锁定技，你使用牌无距离限制。准备阶段开始时，你随机弃置你判定区内的一张牌。一名其他角色的回合结束后，若你于该回合内失去的牌不少于三张，则你对所有其他角色造成1点伤害。',
            NS_nianshouyang: '年兽阳',
            NS_nianshouyin: '年兽阴',
            NSyangshou: '阳兽',
            NSyangshou_info: '锁定技，当你因翻面导致武将牌背面朝上时，若年兽阴的武将牌背面朝上，年兽阴将武将牌翻至正面朝上；你的判定区中，【乐不思蜀】和【兵粮寸断】的判定效果反转；你免疫火属性伤害；摸牌阶段，你多摸两张牌。',
            NSyinshou: '阴兽',
            NSyinshou_info: '锁定技，当你因翻面导致武将牌背面朝上时，若年兽阳的武将牌背面朝上，年兽阳将武将牌翻至正面朝上；你的判定区中，【乐不思蜀】和【兵粮寸断】的判定效果反转；你免疫雷属性伤害；结束阶段，你摸两张牌。',
            NSbeimingyang: '悲鸣',
            NSbeimingyang_info: '锁定技，当你死亡时，你对所有敌方角色造成1点火属性伤害。',
            NSbeimingyin: '悲鸣',
            NSbeimingyin_info: '锁定技，当你死亡时，你对所有敌方角色造成1点雷属性伤害。',
            NSnuyan: '怒焰',
            NSnuyan_info: '出牌阶段限一次，你可以弃置一张红色手牌并失去1点体力，本回合你使用红色牌造成的伤害均视为火属性伤害，且伤害+1。',
            NShuihun: '回魂',
            NShuihun_info: '出牌阶段限一次，你可以弃置一张黑色手牌并失去1点体力，令一名角色回复2点体力。',
            NShundunyang: '混沌',
            NShundunyang_info: '觉醒技，出牌阶段开始时，若年兽阴已阵亡，你增加1点体力上限，回复1点体力，然后获得技能〖回魂〗。',
            NShundunyin: '混沌',
            NShundunyin_info: '觉醒技，出牌阶段开始时，若年兽阳已阵亡，你增加1点体力上限，回复1点体力，然后获得技能〖怒焰〗。',
        },
    };
    for (var i in NianShouCharacter.character) {
        if (!NianShouCharacter.character[i][4]) NianShouCharacter.character[i][4] = [];
        NianShouCharacter.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + '活动武将/image/character/' + i + '.jpg');
    }
    lib.config.all.characters.push('NianShouCharacter');
    lib.config.all.sgscharacters.push('NianShouCharacter');
    if (!lib.config.characters.includes('NianShouCharacter')) lib.config.characters.remove('NianShouCharacter');
    lib.translate['NianShouCharacter_character_config'] = '<span style="font-family: xingkai">生肖&年兽</span>';
    return NianShouCharacter;
};

export default packs;