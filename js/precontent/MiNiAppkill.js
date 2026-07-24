import { lib, game, ui, get, ai, _status } from '../../../../noname.js';

const packs = function () {
    const MiNiAppkill = {
        name: 'MiNiAppkill',
        connect: true,
        characterSort: {
            MiNiAppkill: {
                MiNiApp_standard: [],
                MiNiApp_shenhua: ['mp_shen_zhaoyun'],
                MiNiApp_yijiang: [],
                MiNiApp_xinghuo: [],
                MiNiApp_qunying: [],
            },
        },
        character: {
            //魏
            //蜀
            //吴
            //群
            //神
            mp_shen_zhaoyun: ['male', 'shen', 2, ['mpjuejing', 'relonghun'], ['shu']],
        },
        skill: {
            //魏
            //蜀
            //吴
            //群
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
        getSpan: () => get.prefixSpan('将'),
    });
    lib.config.all.sgscharacters.push('MiNiAppkill');
    lib.translate['MiNiAppkill_character_config'] = '<span style="font-family: xingkai">新一将成名</span>';
    return MiNiAppkill;
};

export default packs;