import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    var FaDongCharacter = {
        name: 'FaDongCharacter',
        connect: true,
        characterSort: {
            FaDongCharacter: {
                FaDongCharacter1: ['FD_guosi', 'FD_lijue', 'FD_niufudongxie', 'FD_fanchou', 'FD_dongyue', 'FD_zhangji'],
                FaDongCharacter2: ['FD_hubenjun', 'FD_baolvejun', 'FD_fengyaojun', 'FD_longxiangjun', 'FD_feixiongjunzuo', 'FD_feixiongjunyou'],
                FaDongCharacter3: ['FD_sunjian', 'FD_huaxiong'],
            },
        },
        character: {
            FD_guosi: ['male', 'qun', 4, ['bilibili_yanglie', 'bilibili_mojun'], ['character:guosi']],
            FD_lijue: ['male', 'qun', 6, ['bilibili_yangwu', 'bilibili_mojun'], ['character:lijue']],
            FD_fanchou: ['male', 'qun', 4, ['cxy_FanGong', 'bilibili_mojun'], ['character:fanchou']],
            FD_dongyue: ['male', 'qun', 4, ['bilibili_kuangxi', 'bilibili_mojun']],
            FD_niufudongxie: ['double', 'qun', 4, ['bilibili_tunjun', 'cxy_JiaoXia', 'bilibili_mojun'], ['character:tw_niufudongxie']],
            FD_zhangji: ['male', 'qun', 4, ['cxy_JieLve', 'bilibili_mojun'], ['character:zhangji']],
            FD_hubenjun: ['male', 'qun', 5, ['bilibili_huying'], ['forbidai']],
            FD_baolvejun: ['male', 'qun', 3, ['cxy_BaoYing'], ['forbidai']],
            FD_fengyaojun: ['female', 'qun', 3, ['bilibili_fengying'], ['forbidai']],
            FD_longxiangjun: ['male', 'qun', 4, ['bilibili_longying'], ['forbidai']],
            FD_feixiongjunzuo: ['male', 'qun', 4, ['bilibili_jingqi'], ['forbidai']],
            FD_feixiongjunyou: ['male', 'qun', 4, ['cxy_RuiQi'], ['forbidai']],
            FD_sunjian: ['male', 'qun', 6, ['gzyinghun', 'bilibili_polu']],
            FD_huaxiong: ['male', 'qun', 8, ['bilibili_moqu', 'yaowu', 'bilibili_mojun'], ['character:old_huaxiong']],
        },
        characterIntro: {
            dongyue: '董越，武威郡姑臧人也，东汉末年人，董卓手下东中郎将，与贾诩是同乡。曾被董卓派往渑池驻扎，抵御关东反董联军的进攻，董卓死后董越被董卓女婿牛辅所杀。',
        },
        perfectPair: {
        },
        skill: {
            bilibili_jingqi: {
                global: 'bilibili_jingqi_distance',
                ai: { threaten: 1.5 },
                subSkill: {
                    distance: {
                        mod: {
                            globalFrom(from, to, distance) {
                                if (game.hasPlayer(function (current) {
                                    if (get.mode() == 'identity') return current.hasSkill('bilibili_jingqi') && get.attitude(current, from) > 0 && get.attitude(current, to) < 0;
                                    return current.hasSkill('bilibili_jingqi') && from.isFriendOf(current) && to.isEnemyOf(current);
                                })) return distance - 1;
                            },
                        },
                    },
                },
            },
            bilibili_fengying: {
                global: 'bilibili_fengying_use',
                ai: { threaten: 2.7 },
                subSkill: {
                    use: {
                        mod: {
                            targetEnabled(card, player, target) {
                                if (game.hasPlayer(function (current) {
                                    if (!current.hasSkill('bilibili_fengying')) return false;
                                    if (get.mode() == 'identity') return get.attitude(current, target) > 0;
                                    return target.isFriendOf(current);
                                })) {
                                    if (((get.mode() == 'identity' && get.attitude(player, target) < 0) || (get.mode() != 'identity' && target.isEnemyOf(player))) && !game.hasPlayer(function (current) {
                                        return current != target && current.hp <= target.hp;
                                    })) return false;
                                }
                            },
                        },
                    },
                },
            },
            bilibili_mojun: {
                trigger: { global: 'damageEnd' },
                filter(event, player) {
                    if (!event.source || !event.source.isIn() || !event.card || event.card.name != 'sha' || !event.notLink()) return false;
                    if (get.mode() == 'identity') return get.attitude(player, event.source) > 0;
                    return event.source.isFriendOf(player);
                },
                forced: true,
                content() {
                    'step 0'
                    trigger.source.judge(function (card) {
                        return get.color(card) == 'black' ? 2 : -2;
                    });
                    'step 1'
                    if (result.bool) {
                        event.targets = game.filterPlayer(function (current) {
                            if (get.mode() == 'identity') return get.attitude(player, current) > 0;
                            return current.isFriendOf(player);
                        });
                        event.targets.sort(lib.sort.seat);
                        game.asyncDraw(event.targets);
                    }
                },
                ai: {
                    expose: 0.3,
                    threaten: 2,
                },
            },
            mojun_self: {
                trigger: { source: 'damageEnd' },
                filter(event, player) {
                    return event.card && event.card.name == 'sha';
                },
                forced: true,
                content() {
                    'step 0'
                    player.judge(function (card) {
                        return get.color(card) == 'black' ? 2 : -2;
                    });
                    'step 1'
                    if (result.bool) player.draw();
                },
            },
            cxy_JieLve: {
                trigger: { source: 'damageEnd' },
                filter(event, player) {
                    if (!event.player.isIn() || event.player == player) return false;
                    return event.player.num('hej') > 0;
                },
                logTarget: 'player',
                forced: true,
                content() {
                    'step 0'
                    var num = 0;
                    if (trigger.player.num('h')) num++;
                    if (trigger.player.num('e')) num++;
                    if (trigger.player.num('j')) num++;
                    if (num) {
                        player.gainPlayerCard(trigger.player, 'hej', num, true).set('filterButton', function (button) {
                            for (var i = 0; i < ui.selected.buttons.length; i++) {
                                if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) return false;
                            }
                            return true;
                        });
                    }
                    else event.finish();
                    'step 1'
                    player.loseHp();
                },
            },
            bilibili_tunjun: {
                trigger: { global: 'roundStart' },
                forced: true,
                filter(event, player) {
                    return player.maxHp > 1;
                },
                content() {
                    player.loseMaxHp();
                    player.draw(player.maxHp);
                },
            },
            cxy_FanGong: {
                trigger: { target: 'useCardToAfter' },
                filter(event, player) {
                    if (get.mode() == 'identity') return get.attitude(player, event.player) < 0;
                    return event.player.isEnemyOf(player);
                },
                direct: true,
                content() {
                    player.chooseToUse(get.prompt2('cxy_FanGong', trigger.player), { name: 'sha' }).set('filterTarget', function (card, player, target) {
                        return target == _status.event.source;
                    }).set('selectTarget', -1).set('source', trigger.player).set('logSkill', 'cxy_FanGong');
                },
            },
            cxy_JiaoXia: {
                trigger: { global: 'phaseDiscardBefore' },
                filter(event, player) {
                    if (get.mode() == 'identity') return get.attitude(player, event.player) > 0;
                    return event.player.isFriendOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.addTempSkill('cxy_JiaoXia_buff', 'phaseDiscardAfter');
                },
                subSkill: {
                    buff: {
                        mod: {
                            ignoredHandcard(card, player) {
                                if (get.color(card) == 'black') return true;
                            },
                            cardDiscardable(card, player, name) {
                                if (name == 'phaseDiscard' && get.color(card) == 'black') return false;
                            },
                        },
                    },
                },
            },
            bilibili_kuangxi: {
                enable: 'phaseUse',
                filter(event, player) {
                    return !player.hasSkill('bilibili_kuangxi_silent');
                },
                filterTarget: lib.filter.notMe,
                content() {
                    'step 0'
                    player.loseHp();
                    target.damage('nocard');
                    'step 1'
                    if (!target.In() || target.hasHistory('damage', function (evt) {
                        return evt.getParent('bilibili_kuangxi') == event && evt._dyinged;
                    })) player.addTempSkill('bilibili_kuangxi_silent');
                },
                ai: {
                    threaten(player, target) {
                        if (!game.hasPlayer(function (current) {
                            return player.getFriends().includes(current) && current.hp <= target.hp;
                        })) return 1;
                        return 1 + target.hp / 2;
                    },
                    order: 1,
                    result: {
                        target(player, target) {
                            if (player.hp <= 1 && !player.countCards('hs', { name: ['tao', 'jiu'] })) return 0;
                            var att = get.attitude(player, target), sgn = Math.sign(att);
                            return get.damageEffect(target, player, player) * sgn * (2 - sgn);
                        },
                    },
                },
                subSkill: { silent: { charlotte: true } },
            },
            bilibili_yangwu: {
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                content() {
                    'step 0'
                    var targets = game.filterPlayer(current => current != player);
                    if (targets.length) {
                        player.line(targets);
                        targets.forEach(target => target.damage());
                    }
                    'step 1'
                    player.loseHp();
                },
            },
            bilibili_yanglie: {
                trigger: { player: 'phaseZhunbeiBegin' },
                forced: true,
                content() {
                    'step 0'
                    var targets = game.filterPlayer(current => current.countGainableCards(player, 'he'));
                    if (targets.length) {
                        player.line(targets);
                        player.gainMultiple(targets, 'he');
                    }
                    'step 1'
                    player.loseHp();
                },
            },
            cxy_RuiQi: {
                trigger: { global: 'phaseDrawBegin2' },
                filter(event, player) {
                    if (get.mode() == 'identity') return get.attitude(player, event.player) > 0 && !event.numFixed;
                    return event.player.isFriendOf(player) && !event.numFixed;
                },
                logTarget: 'player',
                forced: true,
                content() {
                    trigger.num++;
                },
                ai: { threaten: 2.5 },
            },
            bilibili_huying: {
                group: 'choosejiangling',
                derivation: 'choosejiangling',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    return game.hasPlayer(function (current) {
                        return current = player.storage.myjiangling;
                    });
                },
                forced: true,
                content() {
                    'step 0'
                    player.chooseCard('交给主帅一张【杀】，或失去1点体力，令其从牌堆获得一张【杀】', { name: 'sha' }).ai = function (card) {
                        if (player.countCards('h', { name: 'sha' }) < 2) {
                            if (player.hp <= 2) return 1;
                            if (!game.hasPlayer(function (current) {
                                return player.canUse({ name: 'sha' }, current);
                            })) return 1;
                            return 0;
                        }
                        return 1;
                    };
                    'step 1'
                    var jiangling = player.storage.myjiangling;
                    if (result.bool) {
                        jiangling.gain(result.cards[0], player);
                        player.$give(result.cards[0], jiangling);
                    }
                    else {
                        player.loseHp();
                        var card = get.cardPile('sha');
                        if (card) jiangling.gain(card, 'gain2');
                    }
                },
            },
            cxy_BaoYing: {
                skillAnimation: true,
                animationColor: 'fire',
                mark: true,
                intro: { content: 'limited' },
                trigger: { global: 'dying' },
                filter(event, player) {
                    if (get.mode() == 'identity') return get.attitude(player, event.player) > 0;
                    return event.player.isFriendOf(player);
                },
                logTarget: 'player',
                content() {
                    player.awakenSkill('cxy_BaoYing');
                    trigger.player.recover(1 - trigger.player.hp);
                },
            },
            bilibili_longying: {
                group: 'choosejiangling',
                derivation: 'choosejiangling',
                trigger: { player: 'phaseUseBegin' },
                filter(event, player) {
                    var jiangling = player.storage.myjiangling;
                    return jiangling?.isIn() && jiangling.isDamaged();
                },
                direct: true,
                content() {
                    'step 0'
                    player.logSkill('bilibili_longying', player.storage.myjiangling);
                    player.loseHp();
                    'step 1'
                    var jiangling = player.storage.myjiangling;
                    jiangling.recover();
                    jiangling.draw();
                },
            },
            choosejiangling: {
                trigger: { global: 'phaseBefore', player: 'enterGame' },
                filter(event, player) {
                    if (game.countPlayer() <= 1) return false;
                    return event.name != 'phase' || game.phaseNumber == 0;
                },
                direct: true,
                content() {
                    'step 0'
                    player.chooseTarget('请选择你要跟随的将领', true, function (card, player, target) {
                        return target != player;
                    }).set('ai', function (target) {
                        var att = get.attitude(_status.event.player, target);
                        if (att > 0) return att + 1;
                        if (att == 0) return Math.random();
                        return att;
                    });
                    'step 1'
                    if (result.bool) {
                        var target = result.targets[0];
                        player.line(target, 'fire');
                        player.storage.myjiangling = target;
                        game.log(player, '选择了', target, '作为自己的将领');
                    }
                }
            },
            bilibili_moqu: {
                group: 'bilibili_moqu_discard',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.countCards('h') <= player.hp;
                },
                forced: true,
                content() {
                    player.draw(2);
                },
                subSkill: {
                    discard: {
                        audio: 'bilibili_moqu',
                        trigger: { global: 'damageEnd' },
                        filter(event, player) {
                            if (event.player == player || !player.countCards('he')) return false;
                            if (get.mode() == 'identity') return get.attitude(player, event.player) > 0;
                            return event.player.isFriendOf(player);
                        },
                        forced: true,
                        content() {
                            player.chooseToDiscard('he', true);
                        },
                    },
                },
            },
            bilibili_polu: {
                trigger: { global: 'die' },
                filter(event, player) {
                    if (event.player == player) return true;
                    if (!player.isIn()) return false;
                    if (get.mode() == 'identity') return event.source && get.attitude(player, event.player) < 0 && get.attitude(player, event.source) > 0;
                    return event.source && event.player.isEnemyOf(player) && event.source.isFriendOf(player);
                },
                forced: true,
                forceDie: true,
                content() {
                    'step 0'
                    var num = player.getAllHistory('useSkill', evt => evt.skill == 'bilibili_polu').length;
                    event.num = num;
                    var targets = game.filterPlayer(function (target) {
                        if (get.mode() == 'identity') return get.attitude(player, target) > 0;
                        return target.isFriendOf(player);
                    }).sortBySeat();
                    event.targets = targets;
                    'step 1'
                    player.line(targets);
                    game.asyncDraw(targets, num);
                },
            },
        },
        translate: {
            FaDongCharacter1: '诸侯伐董·将领',
            FaDongCharacter2: '<span style="font-family: yuanli">随从分包默认AI禁选</span>' +
                '<br>' +
                '诸侯伐董·随从',
            FaDongCharacter3: '诸侯伐董·特殊',
            FD_lijue: '李傕·伐董',
            FD_guosi: '郭汜·伐董',
            FD_zhangji: '张济·伐董',
            FD_fanchou: '樊稠·伐董',
            FD_dongyue: '董越',
            FD_niufudongxie: '牛辅董翓·伐董',
            FD_hubenjun: '虎贲军',
            FD_baolvejun: '豹掠军',
            FD_fengyaojun: '凤瑶军',
            FD_longxiangjun: '龙骧军',
            FD_feixiongjunzuo: '飞熊军左',
            FD_feixiongjunyou: '飞熊军右',
            FD_sunjian: '孙坚·伐董',
            FD_huaxiong: '华雄·伐董',
            bilibili_mojun: '魔军',
            mojun_self: '魔军',
            cxy_JieLve: '劫掠',
            bilibili_tunjun: '屯军',
            cxy_FanGong: '反攻',
            cxy_JiaoXia: '狡黠',
            bilibili_kuangxi: '狂袭',
            bilibili_yangwu: '扬武',
            bilibili_yanglie: '扬烈',
            cxy_JiaoXia_info: '锁定技，友方角色的黑色手牌不计入手牌上限。',
            bilibili_yangwu_info: '锁定技，准备阶段开始时，你对所有其他角色造成1点伤害，然后你失去1点体力。',
            bilibili_yanglie_info: '锁定技，准备阶段开始时，你获得所有其他角色区域里的一张牌，然后你失去1点体力。',
            cxy_JieLve_info: '锁定技，当你对一名其他角色造成伤害后，你获得其区域内的各一张牌，然后失去1点体力。',
            cxy_FanGong_info: '当你成为一名敌方角色使用牌的目标且该牌结算完成后，你可以对其使用一张【杀】（无距离限制）。',
            bilibili_mojun_info: '锁定技，当友方角色使用【杀】对目标角色造成伤害后，其进行判定，若结果为黑色，友方角色各摸一张牌。',
            mojun_self_info: '锁定技，当你使用【杀】对目标角色造成伤害后，进行一次判定，若结果为黑色，你摸一张牌。',
            bilibili_tunjun_info: '锁定技，每轮游戏开始，若你的体力上限不为1，则你须扣减1点体力上限，然后摸X张牌（X为你的体力上限）。',
            bilibili_kuangxi_info: '出牌阶段，你可以失去1点体力，然后对一名其他角色造成1点伤害，若其因受到此伤害而进入濒死状态，当此濒死结算结束后，此技能于此回合内无效。',
            cxy_RuiQi: '锐骑',
            bilibili_huying: '虎营',
            cxy_BaoYing: '豹营',
            bilibili_longying: '龙营',
            bilibili_jingqi: '精骑',
            bilibili_fengying: '凤营',
            bilibili_jingqi_info: '锁定技，友方角色计算与敌方角色距离-1。',
            bilibili_fengying_info: '锁定技，敌方角色不能使用牌指定体力值唯一最少的友方角色。',
            cxy_RuiQi_info: '锁定技，友方角色摸牌阶段额外摸一张牌。',
            cxy_BaoYing_info: '限定技，友方角色进入濒死状态时，你可以令其体力回复至1。',
            bilibili_longying_info: '锁定技，出牌阶段开始时，若将领已受伤，则你失去1点体力，然后令其回复1点体力并摸一张牌。',
            bilibili_huying_info: '锁定技，出牌阶段开始时，除非你将一张【杀】交给将领，否则失去1点体力并令将领随机获得牌堆中的一张【杀】。',
            bilibili_longying_append: '<span style="font-family: yuanli"><li>游戏开始时，你选择一名其他角色作为你的将领</span>',
            bilibili_huying_append: '<span style="font-family: yuanli"><li>游戏开始时，你选择一名其他角色作为你的将领</span>',
            choosejiangling: '将领选择',
            choosejiangling_info: '<br>游戏开始时，你选择一名其他角色作为你的将领。',
            bilibili_moqu: '魔躯',
            bilibili_polu: '破掳',
            bilibili_polu_info: '锁定技，友方角色杀死一名敌方角色或你死亡时，你令友方角色各摸X张牌（X为此技能发动的次数）。',
            bilibili_moqu_info: '锁定技，每名角色的回合结束时，若你的手牌数不大于当前体力值，你摸两张牌；其他友方角色受到伤害后，你弃置一张牌。',
        },
        dynamicTranslate: {
            bilibili_longying(player) {
                if (!game.hasPlayer(function (current) {
                    return current = player.storage.myjiangling;
                })) return '你的将领呢？';
                return '锁定技，出牌阶段开始时，若' + get.translation(player.storage.myjiangling) + '已受伤，则你失去1点体力，然后令其回复1点体力并摸一张牌。';
            },
            bilibili_huying(player) {
                if (!game.hasPlayer(function (current) {
                    return current = player.storage.myjiangling;
                })) return '你的将领呢？';
                return '锁定技，出牌阶段开始时，除非你将一张【杀】交给' + get.translation(player.storage.myjiangling) + '，否则失去1点体力并令' + get.translation(player.storage.myjiangling) + '随机获得牌堆中的一张【杀】。';
            },
        },
    };
    for (let i in FaDongCharacter.character) {
        FaDongCharacter.character[i][4] ??= [];
        if (_status['extension_活动武将_files']?.includes(`${i}.mp3`)) {
            FaDongCharacter.character[i][4].push('die:ext:活动武将/audio/die:true');
            FaDongCharacter.translate[`#ext:活动武将/audio/die/${i}:die`] = '点击播放阵亡配音';
        }
        FaDongCharacter.character[i][4].push(((lib.device || lib.node) ? 'ext:' : 'db:extension-') + '活动武将/image/character/' + i + '.jpg');
    }
    lib.config.all.characters.push('FaDongCharacter');
    lib.config.all.sgscharacters.push('FaDongCharacter');
    if (!lib.config.characters.includes('FaDongCharacter')) lib.config.characters.remove('FaDongCharacter');
    lib.translate['FaDongCharacter_character_config'] = '<span style="font-family: xingkai">诸侯伐董</span>';
    return FaDongCharacter;
};

export default packs;