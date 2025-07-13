import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    var NianShouCharacter = {
        name: 'NianShouCharacter',
        connect: true,
        characterSort: {
            NianShouCharacter: {
                NianShouCharacter2018: ['NS_nianshouC', 'NS_nianshouB', 'NS_nianshouA'],
                NianShouCharacter2019: ['NS_nianshouyin', 'NS_nianshouyang'],
            },
        },
        character: {
            NS_nianshouA: ['male', 'shen', 6, ['cxy_JiYuan', 'cxy_SuiZhongE', 'cxy_CuiKuE']],
            NS_nianshouB: ['male', 'shen', 8, ['cxy_JiYuan', 'cxy_NianYi', 'cxy_SuiZhongN', 'cxy_CuiKuN']],
            NS_nianshouC: ['male', 'shen', 0, ['cxy_JiYuan', 'cxy_NianYiD', 'cxy_SuiZhongN', 'cxy_CuiKuD']],

            NS_nianshouyang: ['male', 'shen', 6, ['NSyangshou', 'NSbeimingyang', 'NSnuyan', 'NShundunyang']],
            NS_nianshouyin: ['female', 'shen', 6, ['NSyinshou', 'NSbeimingyin', 'NShuihun', 'NShundunyin']],
        },
        skill: {
            YJjinzhu: {
                mod: {
                    maxHandcard(player, num) {
                        return num + 1;
                    },
                },
                group: 'YJjinzhu_fuhuo',
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin2' },
                forced: true,
                filter(event, player) {
                    return !event.numFixed;
                },
                content() {
                    trigger.num++;
                },
                subSkill: {
                    fuhuo: {
                        audio: 'YJjinzhu',
                        skillAnimation: true,
                        animationColor: 'fire',
                        trigger: { player: 'dieBegin' },
                        forced: true,
                        content() {
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
                content() {
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
                filter(event, player) {
                    return !player.storage.cxy_SuiZhongE;
                },
                content() {
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
                filter(event, player) {
                    if (event.name != 'phase') return game.roundNumber % 6 == 0;
                    return game.phaseNumber == 0;
                },
                forced: true,
                content() {
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
                    targetInRange(card, player, target) {
                        return true;
                    },
                },
                audio: 'cxy_NianYiD',
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                filter(event, player) {
                    return player.countCards('j') > 0
                },
                content() {
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
                filter(event, player) {
                    return !player.storage.cxy_SuiZhongN;
                },
                content() {
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
                filter(event, player) {
                    if (event.name != 'phase') return game.roundNumber % 6 == 0;
                    return game.phaseNumber == 0;
                },
                forced: true,
                content() {
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
                    targetInRange(card, player, target) {
                        return true;
                    },
                },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseBegin' },
                forced: true,
                filter(event, player) {
                    return player.countCards('j') > 0
                },
                content() {
                    player.discard(player.getCards('j').randomGet());
                },
                group: 'cxy_NianYiD_buff',
                subSkill: {
                    buff: {
                        forced: true,
                        trigger: { global: 'phaseJieshuBegin' },
                        filter(event, player) {
                            if (_status.currentPhase == player) return false;
                            var num = 0;
                            player.getHistory('lose', function (evt) {
                                if (evt.cards2) num += evt.cards2.length;
                            });
                            return num >= 3;
                        },
                        content() {
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
                filter(event, player) {
                    if (event.name != 'phase') return game.roundNumber % 6 == 0;
                    return game.phaseNumber == 0;
                },
                direct: true,
                content() {
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
                    judge(player, result) {
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
                filter(event, player) {
                    return player.isTurnedOver() && game.hasPlayer(function (current) {
                        return current.name == 'NS_nianshouyin' && current.isTurnedOver();
                    });
                },
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyin' && current.isTurnedOver();
                    });
                },
                content() {
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
                        filter(event, player) {
                            return !event.numFixed;
                        },
                        forced: true,
                        content() {
                            trigger.num += 2;
                        },
                    },
                },
            },
            NSyinshou: {
                mod: {
                    judge(player, result) {
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
                filter(event, player) {
                    return player.isTurnedOver() && game.hasPlayer(function (current) {
                        return current.name == 'NS_nianshouyang' && current.isTurnedOver();
                    });
                },
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyang' && current.isTurnedOver();
                    });
                },
                content() {
                    var targets = game.filterPlayer(function (current) {
                        return current.name == 'NS_nianshouyang' && current.isTurnedOver();
                    });
                    for (var i of targets) i.turnOver();
                },
                subSkill: {
                    damage: {
                        audio: 'ext:活动武将/audio/skill:true',
                        trigger: { player: 'damageBegin4' },
                        filter(event, player) {
                            return event.hasNature('thunder');
                        },
                        forced: true,
                        content() {
                            trigger.cancel();
                        },
                        ai: {
                            nothunder: true,
                            effect: {
                                target(card, player, target, current) {
                                    if (get.tag(card, 'thunderDamage')) return 'zerotarget';
                                },
                            },
                        },
                    },
                    draw: {
                        audio: 'ext:活动武将/audio/skill:true',
                        trigger: { player: 'phaseJieshuBegin' },
                        forced: true,
                        content() {
                            player.draw(2);
                        },
                    },
                },
            },
            NSbeimingyang: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'die' },
                filter(event, player) {
                    return player.getEnemies().length > 0;
                },
                forceDie: true,
                forced: true,
                skillAnimation: true,
                animationColor: 'orange',
                content() {
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
                filter(event, player) {
                    return player.getEnemies().length > 0;
                },
                forceDie: true,
                forced: true,
                skillAnimation: true,
                animationColor: 'thunder',
                content() {
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
                filter(event, player) {
                    return player.countCards('h', { color: 'red' }) > 0;
                },
                filterCard(card, player, target) {
                    return get.color(card, player) == 'red';
                },
                check(card) {
                    return 7 - get.value(card);
                },
                content() {
                    player.loseHp();
                    player.addTempSkill('NSnuyan_damage');
                },
                ai: {
                    order: 10,
                    result: {
                        player(player, target) {
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
                        filter(event, player) {
                            return event.card && get.color(event.card, player) == 'red';
                        },
                        forced: true,
                        content() {
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
                filter(event, player) {
                    return player.countCards('h', { color: 'black' }) > 0 && game.hasPlayer(function (current) {
                        return current.isDamaged();
                    });
                },
                filterTarget(card, player, target) {
                    return target.isDamaged();
                },
                filterCard(card, player, target) {
                    return get.color(card, player) == 'black';
                },
                content() {
                    player.loseHp();
                    target.recover(2);
                },
                ai: {
                    order: 1,
                    result: {
                        player(player, target) {
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
                filter(event, player) {
                    return game.dieYinShou == true;
                },
                forced: true,
                content() {
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
                        filter(event, player) {
                            return event.player.name == 'NS_nianshouyin';
                        },
                        forceDie: true,
                        direct: true,
                        content() {
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
                filter(event, player) {
                    return game.dieYangShou == true;
                },
                forced: true,
                content() {
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
                        filter(event, player) {
                            return event.player.name == 'NS_nianshouyang';
                        },
                        forceDie: true,
                        direct: true,
                        content() {
                            game.dieYangShou = true;
                        },
                    },
                },
            },
        },
        translate: {
            NianShouCharacter2018: '年兽2018',
            NianShouCharacter2019: '年兽2019',
            'NS_nianshouA': '简单年兽',
            'NS_nianshouB': '普通年兽',
            'NS_nianshouC': '困难年兽',
            cxy_RuiShou: '瑞兽',
            YJjinzhu: '金猪',
            'cxy_RuiShou_info': ' 锁定技，你只会受到与你势力相同的角色造成的伤害且你只能对其造成伤害；一名生肖死亡后，与该生肖势力相同的角色也能对你造成伤害。',
            'YJjinzhu_info': '锁定技，你的手牌上限和额定摸牌数+1。锁定技，当你死亡时，你失去〖金猪〗，复活并将体力回复至三点(其他区域的牌均不会发生改变)。',
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
            NShundunyang_info: '觉醒技，出牌阶段开始时，若年兽阴已阵亡，你增加1点体力上限，回复1点体力，然后获得〖回魂〗。',
            NShundunyin: '混沌',
            NShundunyin_info: '觉醒技，出牌阶段开始时，若年兽阳已阵亡，你增加1点体力上限，回复1点体力，然后获得〖怒焰〗。',
        },
    };
    for (let i in NianShouCharacter.character) {
        NianShouCharacter.character[i][4] ??= [];
        if (_status['extension_活动武将_files']?.includes(`${i}.mp3`)) {
            NianShouCharacter.character[i][4].push('die:ext:活动武将/audio/die:true');
            NianShouCharacter.translate[`#ext:活动武将/audio/die/${i}:die`] = '点击播放阵亡配音';
        }
        NianShouCharacter.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + '活动武将/image/character/' + i + '.jpg');
    }
    lib.config.all.characters.push('NianShouCharacter');
    lib.config.all.sgscharacters.push('NianShouCharacter');
    if (!lib.config.characters.includes('NianShouCharacter')) lib.config.characters.remove('NianShouCharacter');
    lib.translate['NianShouCharacter_character_config'] = '<span style="font-family: xingkai">生肖&年兽</span>';
    return NianShouCharacter;
};

export default packs;