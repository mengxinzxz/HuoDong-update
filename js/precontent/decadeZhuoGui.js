import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    var decadeZhuoGui = {
        name: 'decadeZhuoGui',
        connect: true,
        character: {
            ZG_mengpo: ['female', 'qun', 8, ['ZGguimei', 'ZGaotang', 'ZGyunju']],
            ZG_heiwuchang: ['male', 'qun', 4, ['ZGguimei', 'ZGxixing', 'ZGtaiping', 'ZGduanhun']],
            ZG_baiwuchang: ['male', 'qun', 7, ['ZGguimei', 'ZGbaolian', 'ZGqiangzheng', 'ZGmizui']],
            ZG_heibaiwuchang: ['male', 'qun', 12, ['ZGxixing', 'ZGtaiping', 'ZGqiangzheng', 'ZGmizui']],
            ZG_niutou: ['male', 'qun', 6, ['ZGguimei', 'ZGxiaoshou', 'ZGmanji']],
            ZG_mamian: ['male', 'qun', 6, ['ZGguimei', 'ZGshiyu', 'ZGguizhao']],
            ZG_niutoumamian: ['male', 'qun', 12, ['ZGxiaoshou', 'ZGmanji', 'ZGshiyu', 'ZGguizhao']],
            ZG_baowei: ['male', 'qun', 6, ['ZGguimei', 'ZGyinsha', 'ZGeli']],
            ZG_niaozui: ['male', 'qun', 7, ['ZGguimei', 'ZGbingyi', 'ZGsuoxue']],
            ZG_yusai: ['male', 'qun', 12, ['ZGguimei', 'ZGguixi', 'ZGanchao']],
            ZG_huangfeng: ['male', 'qun', 5, ['ZGguimei', 'ZGduzhen', 'ZGminchong']],
            ZG_yanluowang: ['male', 'qun', 12, ['ZGtiemian', 'ZGdifu', 'ZGxingpan']],
            ZG_guiwang: ['male', 'qun', 30, ['ZGtiemian', 'ZGjizhou', 'ZGdanshi', 'ZGchihu']],
        },
        characterIntro: {
            ZG_mengpo: '孟婆，神孟姜女，常驻在忘川河黄泉路奈何桥旁，醧忘台为了能忘记这些痛苦万分的记忆，熬制了能使人忘记记忆的孟婆汤。她在奈何桥畔熬制孟婆汤，让参与轮回的阴魂们忘记前世的一切。高大如方丈，四周的廊房有一百零八间。有一条通道，通向东方，仅一尺四寸宽。所有奉令押解到的男女鬼魂，在各廊房中，都有杯子，招各鬼饮下此汤，多饮少饮不论。',
            ZG_heiwuchang: '黑无常名为范无救（或称范无赦、范无咎），属阴。面容凶悍，身宽体胖，个小面黑，官帽上写有“天下太平”四字，意为对违抗法令身负罪过者一概无赦，尊之曰“矮爷”或“黑爷”。对女性吸其阳魂，对男性散其阳魄。',
            ZG_baiwuchang: '白无常名为谢必安，属阳。时常满面笑容，身材高瘦，面色惨白，口吐长舌，其头上官帽写有“一见生财”四字，予感谢并对恭敬神明之人以好运，尊之曰“活无常”或“白爷”。对男性吸其阴魂，对女性散其阴魄。',
            ZG_heibaiwuchang: '黑白无常，亦称无常。是中国传统文化中的一对神祇，也是最有名的鬼差。此二神手执脚镣手铐，专职缉拿鬼魂、协助赏善罚恶，也常为阎罗王、城隍、东岳大帝等冥界神明的部将。 白无常名为谢必安，属阳。时常满面笑容，身材高瘦，面色惨白，口吐长舌，其头上官帽写有“一见生财”四字，予感谢并对恭敬神明之人以好运，尊之曰“活无常”，“白爷”等。对男性吸其阴魂，对女性散其阴魄。 黑无常名为范无救（或称范无赦、范无咎），属阴。面容凶悍，身宽体胖，个小面黑，官帽上写有“天下太平”四字，意为对违抗法令身负罪过者一概无赦，尊之曰“矮爷”或“黑爷”。对女性吸其阳魂，对男性散其阳魄。 因其在城隍麾下地位仅次于文武判官，牛头马面，枷爷，锁爷，故又得名“七爷”，“八爷”。',
            ZG_niutou: '牛头来源于佛家。牛头又叫阿傍，其形为牛头人身，手持钢叉，力能排山。据《铁城泥犁经》说：阿傍为人时，因不孝父母，死后在阴间为牛头人身，担任巡逻和搜捕逃跑罪人的衙役。',
            ZG_mamian: '马面也是冥府著名的勾魂使者。鬼城酆都，及各地城隍庙中，均有牛头马面的形象。',
            ZG_niutoumamian: '牛头马面并不拥有神位，他们只是民间迷信中次阴曹地府的鬼卒，专门负责那些快要死去的人，但是鬼魂却迟迟不肯出来的魂魄，把魂魄强行勾出来。',
            ZG_baowei: '豹尾是管理陆上兽类动物亡灵的冥帅，和鸟嘴、鱼鳃、黄蜂并称“四大阴帅”。',
            ZG_niaozui: '鸟嘴是管理天上鸟类动物亡灵的冥帅，和豹尾、鱼鳃、黄蜂并称“四大阴帅”。',
            ZG_yusai: '鱼鳃是管理水中鱼类动物亡灵的冥帅，和豹尾、鸟嘴、黄蜂并称“四大阴帅”。',
            ZG_huangfeng: '黄蜂是管理地上昆虫动物亡灵的冥帅，和豹尾、鸟嘴、鱼鳃并称“四大阴帅”。',
            ZG_yanluowang: '第五殿阎罗王包拯，东北方度仙上圣天尊化冥府五殿最胜耀灵真君阎罗大王，神居纠纶宫，阎罗天子包，正月初八日诞辰，位列垦宫，尊居丑位，执掌镬汤地狱，威张煮溃之权，专司大海之底，东北沃焦石下叫唤大地狱，并十六诛心小狱。前本居第一殿，因怜屈死，屡放还阳伸雪，降调此殿。凡解到此殿者，押赴望乡台，令之闻见世上本家，因罪遭殃各事，随即推入此狱，细查曾犯何恶，再发入诛心十六小狱，钩出其心，掷与蛇食，铡其身首（包公即善于用铡刀），受苦满日，另发别殿。',
            ZG_guiwang: '鬼王中的“王”字并不代表至高无上的身份，鬼王的塑像上身裸露，红发獠牙，手拿镇妖铃，狰狞凶恶，整个一副夜叉鬼模样。他与黑白无常、牛头马面为伍，地位自然不会太高，但因其挂了个“王”字，地位应该高于一般鬼卒，大约是个像山大王那样的头领。',
        },
        skill: {
            //by染柒
            ZGguimei: {
                group: ['ZGguimei1', 'ZGguimei2'],
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'turnOverBefore' },
                filter(event, player) {
                    return !player.isTurnedOver();
                },
                forced: true,
                content() {
                    trigger.cancel();
                },
            },
            ZGguimei1: {
                audio: 'ZGguimei',
                trigger: { player: ['phaseDrawSkipped', 'phaseDrawCancelled'] },
                forced: true,
                content() {
                    player.draw()
                },
            },
            ZGguimei2: {
                audio: 'ZGguimei',
                trigger: { player: 'phaseDiscardBefore' },
                filter(event, player) {
                    return player.getHistory('skipped').includes('phaseUse');
                },
                forced: true,
                content() {
                    trigger.cancel();
                },
            },
            ZGyunju: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    return player.getEnemies().includes(event.player) && event.player.countCards('he');
                },
                forced: true,
                logTarget: 'player',
                content() {
                    var hs = trigger.player.getCards('h');
                    if (hs.length) {
                        trigger.player.discard(hs.randomGet());
                    }
                    var hs = trigger.player.getCards('e');
                    if (hs.length) {
                        trigger.player.discard(hs.randomGet());
                    }
                },
            },
            ZGxixing: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.hasPlayer(function (target) {
                        return player != target && target.isLinked();
                    });
                },
                content() {
                    'step 0'
                    var target = game.filterPlayer(function (target) {
                        return player != target && target.isLinked();
                    }).randomGet();
                    player.line(target);
                    target.damage('thunder');
                    'step 1'
                    player.recover();
                },
            },
            ZGtaiping: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                filter(event, player) {
                    return event.source && (player.getEnemies().includes(event.source));
                },
                forced: true,
                logTarget: 'source',
                content() {
                    'step 0'
                    trigger.source.chooseToDiscard(2, function (card) {
                        var suit = get.suit(card);
                        for (var i = 0; i < ui.selected.cards.length; i++) {
                            if (get.suit(ui.selected.cards[i]) == suit) return false;
                        }
                        return true;
                    }).set('ai', function (card) {
                        var player = _status.event.player;
                        return 10 - player.hp - get.value(card);
                    });
                    'step 1'
                    if (!result.bool) trigger.source.loseHp();
                },
                ai: {
                    maixie_defend: true,
                    effect: {
                        target(card, player, target) {
                            if (player.hasSkillTag('jueqing', false, target)) return [1, -1];
                            return 0.8;
                        },
                    },
                },
            },
            ZGaotang: {
                onremove: true,
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                direct: true,
                locked: true,
                content() {
                    var target = game.filterPlayer(function (current) {
                        return get.mode() == 'identity' ? get.attitude(player, current) < 0 : current.isEnemyOf(player);
                    }).randomGet();
                    player.logSkill('ZGaotang', target);
                    player.addSkill('ZGaotang_clear');
                    player.storage.ZGaotang_clear = target;
                    target.addSkill('ZGaotang_fengyin');
                },
                subSkill: {
                    clear: {
                        onremove: true,
                        charlotte: true,
                        trigger: { player: 'phaseBegin' },
                        direct: true,
                        content() {
                            player.storage.ZGaotang_clear.removeSkill('ZGaotang_fengyin');
                            player.removeSkill('ZGaotang_clear');
                        },
                    },
                    fengyin: {
                        charlotte: true,
                        init(player, skill) {
                            player.addSkillBlocker(skill);
                        },
                        onremove(player, skill) {
                            player.removeSkillBlocker(skill);
                        },
                        skillBlocker(skill, player) {
                            return skill != 'ZGaotang_fengyin' && !lib.skill[skill].charlotte;
                        },
                        mark: true,
                        intro: {
                            content(storage, player, skill) {
                                var str = '无失效技能';
                                var list = player.getSkills(null, false, false).filter(function (i) {
                                    return lib.skill.ZGaotang_fengyin.skillBlocker(i, player);
                                });
                                if (list.length) str = ('失效技能：' + get.translation(list));
                                return str;
                            },
                        },
                    },
                },
            },
            ZGduanhun: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin3' },
                filter(event, player) {
                    return (!event.card || event.card.name != 'sha') && player.countCards('h') < 2;
                },
                forced: true,
                content() {
                    trigger.num--;
                },
            },
            ZGqiangzheng: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseJieshuBegin' },
                filter(event, player) {
                    return lib.skill.ZGqiangzheng.logTarget(event, player).length;
                },
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        return player.getEnemies().includes(current) && current.countCards('h') == 1;
                    });
                },
                content() {
                    for (var target of lib.skill.ZGqiangzheng.logTarget(trigger, player)) player.gain(target.getCards('h'), target, 'giveAuto');
                },
            },
            ZGbaolian: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.hasPlayer(function (current) {
                        return current != player && current.countCards('he') && player.getEnemies().includes(current);
                    });
                },
                forced: true,
                content() {
                    var targets = game.filterPlayer(function (current) {
                        return current != player && current.countCards('he') && player.getEnemies().includes(current);
                    }).sortBySeat();
                    for (var target of targets) {
                        if (target.countCards('e')) player.gainPlayerCard(target, 'e', true);
                        else if (target.countCards('h')) player.gain(target.getCards('h').randomGet(), target, 'give');
                    }
                },
            },
            ZGmizui: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { source: 'damageSource' },
                filter(event, player) {
                    return event.card && event.card.name == 'sha' && (get.color(event.card) == 'red' || lib.linked.includes(event.nature));
                },
                check(event, player) {
                    return get.attitude(player, event.player) < 0;
                },
                logTarget: 'player',
                content() {
                    player.discardPlayerCard(trigger.player, 'he', true);
                },
            },
            ZGxiaoshou: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseZhunbeiBegin' },
                filter(event, player) {
                    return game.hasPlayer(function (current) {
                        return current.hp > player.hp;
                    });
                },
                forced: true,
                content() {
                    'step 0'
                    player.chooseTarget('请选择【枭首】的目标', '对一名体力值大于你的其他角色造成2点伤害', true, function (card, player, target) {
                        return target.hp > player.hp;
                    }).set('ai', function (target) {
                        var player = _status.event.player;
                        return get.damageEffect(target, player, player);
                    });
                    'step 1'
                    if (result.bool) {
                        player.logSkill('ZGxiaoshou', result.targets);
                        result.targets[0].damage(2);
                    }
                },
            },
            ZGshiyu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin1' },
                forced: true,
                content() {
                    trigger.changeToZero();
                    var cards = [];
                    for (var suit of lib.suit) {
                        var card = get.cardPile2(function (card) {
                            return get.suit(card, false) == suit;
                        });
                        if (card) cards.push(card);
                    }
                    if (cards.length) player.gain(cards, 'gain2');
                },
            },
            ZGguizhao: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCard' },
                filter(event, player) {
                    return player == _status.currentPhase && !player.hasHistory('useCard', function (evt) {
                        return evt.card != event.card && get.type2(evt.card) == get.type2(event.card);
                    });
                },
                forced: true,
                content() {
                    player.draw();
                },
            },
            ZGyinsha: {
                trigger: { global: 'phaseUseBegin' },
                audio: 'ext:活动武将/audio/skill:true',
                filter(event, player) {
                    return player.getEnemies().includes(event.player) && event.player.countCards('h') > event.player.maxHp;
                },
                forced: true,
                content() {
                    player.addTempSkill('ZGyinsha1');
                },
            },
            ZGyinsha1: {
                charlotte: true,
                mark: true,
                intro: { content: '不能成为【杀】的目标' },
                mod: {
                    targetEnabled(card, player, target, now) {
                        if (card.name == 'sha') return false;
                    },
                },
            },
            //by萌新（转型中）
            ZGmanji: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCardToPlayer' },
                filter(event, player) {
                    return event.card.name == 'sha' && event.targets.length == 1 && event.target.countCards('h');
                },
                check(event, player) {
                    return get.attitude(player, event.target) <= 0;
                },
                logTarget: 'target',
                content() {
                    'step 0'
                    player.discardPlayerCard('h', trigger.target, true);
                    'step 1'
                    if (result.cards[0].name == 'sha') {
                        var id = trigger.target.playerid;
                        var map = trigger.getParent().customArgs;
                        if (!map[id]) map[id] = {};
                        if (typeof map[id].extraDamage != 'number') {
                            map[id].extraDamage = 0;
                        }
                        map[id].extraDamage++;
                    }
                    else player.gain(result.cards, 'gain2');
                },
            },
            ZGeli: {
                derivation: 'rewansha',
                audio: 'ext:活动武将/audio/skill:true',
                triggeer: { source: 'damageBegin2' },
                filter(event, player) {
                    return get.mode() == 'identity' ? get.attitude(player, event.player) < 0 : event.player.isEnemyOf(player) && event.player.getAllHistory('damage').length == 0;
                },
                forced: true,
                logTarget: 'player',
                content() {
                    'step 0'
                    player.judge();
                    'step 1'
                    if (result.color == 'red') trigger.num++;
                    else player.addTempSkills('rewansha');
                },
            },
            ZGbingyi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: {
                    player: 'loseAfter',
                    global: ['equipAfter', 'addJudgeAfter', 'gainAfter', 'loseAsyncAfter', 'addToExpansionAfter'],
                },
                filter(event, player) {
                    if (player.countCards('h')) return false;
                    var evt = event.getl(player);
                    return evt?.player == player && evt.hs && evt.hs.length > 0;
                },
                usable: 1,
                forced: true,
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        if (get.mode() == 'identity') return get.attitude(player, current) > 0;
                        return player.getFriends().includes(current);
                    });
                },
                content() {
                    var list = lib.skill.ZGbingyi.logTarget(trigger, player);
                    for (var target of list) target.drawTo(6);
                },
            },
            ZGsuoxue: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCardToTargeted' },
                check(event, player) {
                    if (player.countCards('h') < event.target.countCards('h')) return true;
                    return get.attitude(player, event.target) <= 0;
                },
                filter(event, player) {
                    if (player.countCards('h') == event.target.countCards('h')) return false;
                    return event.card.name == 'sha' && event.targets.length == 1;
                },
                logTarget: 'target',
                content() {
                    if (player.countCards('h') < trigger.target.countCards('h')) player.drawTo(trigger.target.countCards('h'));
                    else {
                        player.chooseToDiscard('h', true);
                        trigger.getParent().directHit.push(trigger.target);
                    }
                },
            },
            ZGguixi: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageEnd' },
                forced: true,
                content() {
                    'step 0'
                    player.judge(function (card) {
                        if (get.suit(card) == 'heart') return 2;
                        return -2;
                    }).judge2 = function (result) {
                        return result.bool ? true : false;
                    };
                    'step 1'
                    if (result.suit == 'heart') player.recover();
                    else player.loseHp();
                },
            },
            ZGanchao: {
                group: 'ZGanchao_phase',
                intro: { content: 'mark', name: '暗潮' },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseJieshuBegin' },
                filter(event, player) {
                    if (event.player.getHistory('sourceDamage').length && event.player.countMark('ZGanchao') == 0) return false;
                    return get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    if (!trigger.player.getHistory('sourceDamage').length) trigger.player.addMark('ZGanchao', 1);
                    else trigger.player.removeMark('ZGanchao', trigger.player.countMark('ZGanchao'));
                },
                subSkill: {
                    phase: {
                        audio: 'ZGanchao',
                        trigger: { global: 'phaseZhunbeiBegin' },
                        filter(event, player) {
                            if (event.player.countMark('ZGanchao') == 0) return false;
                            return get.mode() == 'identity' ? get.attitude(player, event.player) > 0 : event.player.isFriendOf(player);
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            trigger.player.addTempSkill('ZGanchao_effect');
                            trigger.player.addMark('ZGanchao_effect', trigger.player.countMark('ZGanchao'), false);
                        },
                    },
                    effect: {
                        mark: true,
                        onremove: true,
                        charlotte: true,
                        intro: { content: '摸牌阶段多摸#张牌，对敌方角色造成的伤害+#' },
                        audio: 'ZGanchao',
                        trigger: { player: 'phaseDrawBegin2', source: 'damageBegin2' },
                        filter(event, player) {
                            if (event.name == 'phaseDraw') return !event.numFixed;
                            return get.mode() == 'identity' ? get.attitude(player, event.player) < 0 : event.player.isEnemyOf(player);
                        },
                        forced: true,
                        logTarget: 'player',
                        content() {
                            trigger.num += player.countMark('ZGanchao_effect');
                        },
                    },
                },
            },
            ZGduzhen: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'useCardToPlayered' },
                filter(event, player) {
                    return player.isPhaseUsing() && event.target.countCards('he') && get.mode() == 'identity' ? get.attitude(player, event.target) < 0 : event.target.isEnemyOf(player) && (event.card.name == 'sha' || get.type2(event.card) == 'trick');
                },
                forced: true,
                logTarget: 'target',
                content() {
                    trigger.target.discard(trigger.target.getCards('he', function (card) {
                        if (trigger.target.countCards('e') && get.position(card) != 'e') return false;
                        return true;
                    }).randomGet());
                },
            },
            ZGminchong: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'die' },
                forceDie: true,
                skillAnimation: true,
                animationColor: 'gray',
                logTarget(event, player) {
                    return game.filterPlayer(function (current) {
                        if (player == current) return false;
                        if (get.mode() == 'identity') return get.attitude(player, current) > 0;
                        return player.getFriends().includes(current);
                    });
                },
                filter(event, player) {
                    return game.hasPlayer(function (current) {
                        if (player == current) return false;
                        if (get.mode() == 'identity') return get.attitude(player, current) > 0;
                        return player.getFriends().includes(current);
                    });
                },
                forced: true,
                async content(event, trigger, player) {
                    const list = lib.skill.ZGbingyi.logTarget(trigger, player);
                    for (const target of list) {
                        await target.addSkills('ZGduzhen');
                        await target.drawTo(target.getHandcardLimit());
                    }
                },
            },
            ZGtiemian: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { target: 'shaBefore' },
                filter(event, player) {
                    return event.card.name == 'sha' && get.color(event.card) == 'red' && Math.random() <= 0.75;
                },
                forced: true,
                content() {
                    trigger.cancel();
                },
                ai: {
                    effect: {
                        target(card, player, target) {
                            if (card.name == 'sha' && get.color(card) == 'red') return 0.25;
                        },
                    },
                },
            },
            ZGdifu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { global: 'phaseUseBegin' },
                filter(event, player) {
                    return event.player.countCards('h') > event.player.maxHp && get.mode() == 'identity' ? get.attitude(player, event.player) < 0 : event.player.isEnemyOf(player);
                },
                forced: true,
                logTarget: 'player',
                content() {
                    trigger.player.chooseToDiscard('h', trigger.player.countCards('h') - trigger.player.maxHp, true);
                },
            },
            ZGxingpan: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseUseBegin' },
                forced: true,
                content() {
                    'step 0'
                    player.judge();
                    'step 1'
                    var list = game.filterPlayer(function (current) {
                        if (get.mode() == 'guozhan') return current.isEnemyOf(player);
                        return get.attitude(player, current) < 0;
                    });
                    if (result.color == 'red') {
                        var target = game.findPlayer(function (current) {
                            return list.includes(current) && !game.hasPlayer(function (currentx) {
                                return current != currentx && list.includes(currentx) && currentx.countCards('h') >= current.countCards('h');
                            });
                        });
                        if (target) {
                            event.target = target;
                            player.line(target);
                            if (target.countCards('h') > 1) target.chooseCard('h', Math.floor(target.countCards('h') / 2), '刑判：交给' + get.translation(player) + '一半的手牌（向下取整）', true);
                            else event.finish();
                        }
                        else event.finish();
                    }
                    else {
                        var targetx = game.findPlayer(function (current) {
                            return list.includes(current) && !game.hasPlayer(function (currentx) {
                                return current != currentx && list.includes(currentx) && currentx.hp >= current.hp;
                            });
                        });
                        if (targetx) {
                            player.line(targetx);
                            targetx.loseHp();
                        }
                        event.finish();
                    }
                    'step 2'
                    player.gain(result.cards, target, 'giveAuto');
                },
            },
            ZGjizhou: {
                audio: 'ext:活动武将/audio/skill:true',
                forced: true,
                trigger: { global: 'phaseUseEnd' },
                filter(event, player) {
                    return player.getEnemies().includes(event.player);
                },
                logTarget: 'player',
                content() {
                    'step 0'
                    player.judge();
                    'step 1'
                    var num = result.number;
                    var next = trigger.player.chooseToDiscard('疾咒：弃置任意张点数之和大于' + get.cnNumber(num) + '的牌，否则失去1点体力', 'he');
                    next.set('num', num);
                    next.set('complexCard', true);
                    next.set('selectCard', function () {
                        var num = 0;
                        for (var i = 0; i < ui.selected.cards.length; i++) {
                            num += get.number(ui.selected.cards[i]);
                        }
                        if (num > _status.event.num) return [ui.selected.cards.length, _status.event.player.countCards('he')];
                        return ui.selected.cards.length + 2;
                    });
                    next.set('ai', function (card) {
                        var player = _status.event.player;
                        var num = _status.event.num;
                        var numx = 0;
                        for (var i of ui.selected.cards) {
                            numx += i.number;
                        }
                        if (numx > num && _status.event.player.countCards('he') < 3) return 0;
                        if (numx > num && _status.event.player.countCards('he') > 3 && ui.selected.cards.length >= 3) return 0;
                        if (card.number + numx > num) return 15 - get.value(card);
                        return Math.max(9 - get.value(card), card.number);
                    });
                    'step 2'
                    if (result.bool) {
                        if (result.cards.length > 2) player.addMark('ZGdanshi', 1);
                    }
                    else trigger.player.loseHp();
                },
            },
            ZGdanshi: {
                intro: { content: '下次受到的的伤害+#，然后移除一个标记' },
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'damageBegin1' },
                filter(event, player) {
                    return player.countMark('ZGdanshi') > 0;
                },
                forced: true,
                content() {
                    'step 0'
                    trigger.num += player.countMark('ZGdanshi');
                    'step 1'
                    player.removeMark('ZGdanshi', 1);
                },
            },
            ZGchihu: {
                audio: 'ext:活动武将/audio/skill:true',
                trigger: { player: 'phaseDrawBegin2', source: 'damageBegin2' },
                filter(event, player) {
                    if (event.name == 'damage') return !player.isMaxHp();
                    return !event.numFixed && !player.isMaxHandcard();
                },
                forced: true,
                content() {
                    trigger.num += trigger.name == 'damage' ? 1 : 2;
                },
            },
        },
        translate: {
            ZG_mengpo: '孟婆',
            ZG_heiwuchang: '黑无常',
            ZG_baiwuchang: '白无常',
            ZG_heibaiwuchang: '黑白无常',
            ZG_niutou: '牛头',
            ZG_mamian: '马面',
            ZG_niutoumamian: '牛头马面',
            ZG_baowei: '豹尾',
            ZG_niaozui: '鸟嘴',
            ZG_yusai: '鱼鳃',
            ZG_huangfeng: '黄蜂',
            ZG_yanluowang: '阎罗王',
            ZG_guiwang: '鬼王',
            ZGguimei: '鬼魅',
            ZGguimei1: '鬼魅',
            ZGguimei2: '鬼魅',
            ZGguimei_info: '锁定技，你不会被翻面；你跳过摸牌阶段时，摸一张牌；你跳过出牌阶段时，本回合手牌无上限。',
            ZGyunju: '云飓',
            ZGyunju_info: '锁定技，敌方角色的回合结束时，该角色随机弃置一张手牌和一张装备区里的牌。',
            ZGxixing: '吸星',
            ZGxixing_info: '准备阶段，对任意一名横置的其他角色造成1点雷电伤害，然后回复1点体力。',
            ZGtaiping: '太平',
            ZGtaiping_info: '锁定技，当你受到敌方角色造成的伤害后，伤害来源需弃置两张花色不同的手牌，否则失去1点体力。',
            ZGaotang: '熬汤',
            ZGaotang_info: '锁定技，准备阶段，你令随机一名敌方角色遗忘所有武将技能直到你的下回合开始。',
            ZGduanhun: '断魂',
            ZGduanhun_info: '锁定技，若你的手牌数小于等于1，则当你受到不为【杀】造成的伤害时，此伤害-1。',
            ZGqiangzheng: '强征',
            ZGqiangzheng_info: '锁定技，结束阶段，若敌方有角色的手牌数为1，则你获得其手牌。',
            ZGbaolian: '暴敛',
            ZGbaolian_info: '锁定技，准备阶段，你放弃摸牌，改为获得每名敌方角色装备区里各一张牌。若有角色装备区里没有牌，则改为随机获得其一张手牌。',
            ZGmizui: '迷醉',
            ZGmizui_info: '你的红色【杀】或属性【杀】造成伤害后，你可以弃置受伤角色一张牌。',
            ZGxiaoshou: '枭首',
            ZGxiaoshou_info: '锁定技，准备阶段，对体力大于你的一名其他角色造成2点伤害。',
            ZGshiyu: '施狱',
            ZGshiyu_info: '锁定技，摸牌阶段，你放弃摸牌改为随机获得牌堆中每种花色的牌各一张。',
            ZGguizhao: '诡招',
            ZGguizhao_info: '锁定技，当你于回合内使用一张牌时，若此牌的类别是你本回合第一次使用，则你摸一张牌。',
            ZGyinsha: '隐煞',
            ZGyinsha1: '隐煞',
            ZGyinsha_info: '锁定技，敌方角色的出牌阶段开始时，若其手牌数大于其体力上限，你本回合不能成为【杀】的目标。',
            ZGmanji: '蛮击',
            ZGmanji_info: '当你使用【杀】指定唯一目标时，你可以弃置该目标角色的一张手牌。若此牌为【杀】，你令此【杀】对其造成的伤害+1，否则你获得此牌。',
            ZGeli: '恶力',
            ZGeli_info: '锁定技，当你对一名敌方角色造成伤害时，若此伤害是该角色第一次受到伤害，你进行一次判定：若结果为红色，此伤害+1；若结果为黑色，你于本回合获得〖完杀〗。',
            ZGbingyi: '病疑',
            ZGbingyi_info: '锁定技，每回合限一次，当你失去最后的手牌时，己方所有角色将手牌摸至六张。',
            ZGsuoxue: '索穴',
            ZGsuoxue_info: '你使用【杀】指定单一目标后，若其手牌数大于你，你可将手牌摸至与该角色相同；若其手牌数小于你，你可弃置一张手牌令此【杀】不能抵消。',
            ZGguixi: '鬼吸',
            ZGguixi_info: '锁定技，当你受到伤害后，你进行一次判定，若结果为红桃，你回复1点体力；若结果不为红桃，你失去1点体力。',
            ZGanchao: '暗潮',
            ZGanchao_info: '锁定技，己方角色的回合结束时，若此回合该角色没有造成伤害，则获得1枚“暗潮”标记，若该角色造成过伤害，则移去所有“暗潮”标记。己方角色的准备阶段，若该角色有“暗潮”标记，则本回合摸牌阶段多摸X张牌且对敌方角色造成的伤害+X（X为其拥有的“暗潮”标记数）。',
            ZGduzhen: '毒针',
            ZGduzhen_info: '锁定技，你的回合内，当你使用【杀】或锦囊牌指定敌方角色为目标后，该角色随机弃置一张牌（优先装备区里的牌）。',
            ZGminchong: '冥虫',
            ZGminchong_info: '锁定技，你死亡时，若有其他己方角色存活，该角色获得技能“毒针”并将手牌摸至体力上限。',
            ZGtiemian: '铁面',
            ZGtiemian_info: '锁定技，红色【杀】有75%概率对你无效。',
            ZGdifu: '地府',
            ZGdifu_info: '锁定技，敌方角色的出牌阶段开始时，若其手牌数大于体力上限，则将手牌弃至与体力上限相同。',
            ZGxingpan: '刑判',
            ZGxingpan_info: '锁定技，出牌阶段开始时，你进行一次判定：若结果为红色，敌方唯一手牌最多的角色将一半数量的手牌交给你（向下取整）；若结果为黑色，敌方唯一体力最多的角色失去1点体力。',
            ZGjizhou: '疾咒',
            ZGjizhou_info: '锁定技，敌方角色的出牌阶段结束时，你进行一次判定，然后敌方角色选择一项：1.弃置任意张点数之和大于判定结果的牌（若弃置的牌超过两张，你获得1枚“噬”标记）；2.失去1点体力。',
            ZGdanshi: '啖噬',
            ZGdanshi_info: '锁定技，当你受到伤害时，此伤害+X（X为你拥有的“噬”标记数量），然后你移去1枚“噬”。',
            ZGchihu: '赤虎',
            ZGchihu_info: '锁定技，若你的手牌数不是全场最多的，摸牌阶段你多摸两张牌；若你的体力值不是全场最多的，你造成的伤害+1。',
        },
    };
    for (let i in decadeZhuoGui.character) {
        if (Array.isArray(decadeZhuoGui.character[i])) decadeZhuoGui.character[i] = get.convertedCharacter(decadeZhuoGui.character[i]);
        decadeZhuoGui.character[i].trashBin ??= [];
        if (_status['extension_活动武将_files']?.audio.die.files.includes(`${i}.mp3`)) {
            decadeZhuoGui.character[i].dieAudios ??= [];
            decadeZhuoGui.character[i].dieAudios.push('ext:活动武将/audio/die:true');
            decadeZhuoGui.translate[`#ext:活动武将/audio/die/${i}:die`] ??= '点击播放阵亡配音';
        }
        if (_status['extension_活动武将_files']?.image.character.files.includes(`${i}.jpg`)) decadeZhuoGui.character[i].img = `extension/活动武将/image/character/${i}.jpg`;
    }
    lib.config.all.sgscharacters.push('decadeZhuoGui');
    lib.translate['decadeZhuoGui_character_config'] = '<span style="font-family: xingkai">捉鬼驱邪</span>';
    return decadeZhuoGui;
};

export default packs;