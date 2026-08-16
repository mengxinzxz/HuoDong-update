export const QING_LVDIAO_FORMS = Object.freeze({
    male: 'Mqing_lvbu',
    female: 'Mqing_diaochan',
    double: 'Mqing_lvdiao',
});

const formNames = Object.values(QING_LVDIAO_FORMS);
const formMaxHp = Object.freeze({
    [QING_LVDIAO_FORMS.male]: 5,
    [QING_LVDIAO_FORMS.female]: 3,
    [QING_LVDIAO_FORMS.double]: 4,
});

export function getQingLvdiaoForm(player) {
    return [player?.name, player?.name1, player?.name2].find(name => formNames.includes(name)) ?? null;
}

export function isQingLvdiaoSingleForm(name) {
    return name === QING_LVDIAO_FORMS.male || name === QING_LVDIAO_FORMS.female;
}

export function getQingLvdiaoTargetMaxHp(currentMaxHp, from, to) {
    return currentMaxHp - formMaxHp[from] + formMaxHp[to];
}

export function isQingLvdiaoRival(owner, target) {
    if (!owner || !target) return false;
    return (
        (owner.hasSex('male') && target.hasSex('male')) ||
        (owner.hasSex('female') && target.hasSex('female'))
    );
}

export function shouldContinueQingzhan({ turns, enteredDying, owner, target }) {
    if (enteredDying || !owner?.isIn() || !target?.isIn()) return false;
    return turns < 2 || isQingLvdiaoRival(owner, target);
}
