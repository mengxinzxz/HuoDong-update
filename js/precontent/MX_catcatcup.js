import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MX_catcatcup = {
        name: 'MX_catcatcup',
        connect: true,
        characterSort: {
            MX_catcatcup: {
                cat_yongguansanjun: ['cat_re_ganning'],
                cat_weiwoqianli: ['cat_re_zhouyu'],
                cat_shenhua_lin: ['cat_zhurong'],
                cat_shenhua_lei: ['cat_guanqiujian', 'cat_yl_yuanshu'],
            },
        },
        character: {
            cat_re_ganning: ['male', 'wu', 4, ['catqixi', 'fenwei']],
            cat_re_zhouyu: ['male', 'wu', 3, ['catyingzi', 'catfanjian']],
            cat_zhurong: ['female', 'shu', 4, ['juxiang', 'catlieren']],
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
        },
        dynamicTranslate: {
        },
        translate: {
            cat_yongguansanjun: '喵喵杯·勇冠三军',
            cat_weiwoqianli: '喵喵杯·帷幄千里',
            cat_shenhua_lin: '喵喵杯·神话再临·林',
            cat_shenhua_lei: '喵喵杯·神话再临·雷',
            cat_re_ganning: '甘宁',
            catqixi: '奇袭',
            catqixi_info: `你可以将一张黑色牌当作【过河拆桥】使用。你因以此法转化的【过河拆桥】弃置了与此牌花色相同的牌后重置${get.poptip('fenwei')}。`,
            cat_re_zhouyu: '周瑜',
            catyingzi: '英姿',
            catyingzi_info: '锁定技。你的手牌上限视为你的体力上限；摸牌阶段，你额外摸一张牌（若你的手牌数小于2则改为额外摸两张牌）。',
            catfanjian: '反间',
            catfanjian_info: '出牌阶段限一次，你可以展示一张手牌并交给一名其他角色，其选择一项：①展示所有手牌，弃置所有与此牌颜色相同的牌；②失去1点体力，随机弃置装备区里的一张牌。 ',
            cat_zhurong: '祝融',
            catlieren: '烈刃',
            catlieren_info: '当你使用仅指定单目标的牌结算完毕后，你可以与其拼点。若你赢，你获得其一张牌。',
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