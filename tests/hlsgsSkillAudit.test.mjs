import test from "node:test";
import assert from "node:assert/strict";
import { parsePackSource } from "../tools/hlsgs-skill-audit.mjs";

const source = `
const pack = {
  character: {
    Mbaby_a: ['male', 'wei', 4, ['minia', 'coreSkill']],
  },
  skill: {
    minia: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_a: '欢杀甲',
    minia: '甲技',
    minia_info: '当前描述',
  },
};
`;

test("parses direct character skills and extension-owned static info", () => {
  const parsed = parsePackSource(source);
  assert.deepEqual(parsed.characters.get("Mbaby_a"), ["minia", "coreSkill"]);
  assert.equal(parsed.localSkills.has("minia"), true);
  assert.equal(parsed.localSkills.has("coreSkill"), false);
  assert.equal(parsed.translations.get("minia"), "甲技");
  assert.equal(parsed.infoLiterals.get("minia").value, "当前描述");
});

test("parses object-form character skills", () => {
  const objectSource = `
const pack = {
  character: {
    Mbaby_pair: {
      sex: 'female',
      skills: ['minib', 'sharedSkill'],
    },
  },
  skill: {
    minib: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_pair: '双将',
    minib: '乙技',
    minib_info: '静态描述',
  },
};
`;

  const parsed = parsePackSource(objectSource);
  assert.deepEqual(parsed.characters.get("Mbaby_pair"), ["minib", "sharedSkill"]);
});

test("keeps scanning when unrelated translate entries use template interpolation", () => {
  const dynamicTranslateSource = `
const pack = {
  character: {
    Mbaby_a: ['male', 'wei', 4, ['minia']],
  },
  skill: {
    minia: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_a: \`\${get.poptip('rule_mamba')}欢杀甲\`,
    minia: '甲技',
    minia_info: '当前描述',
  },
};
`;

  const parsed = parsePackSource(dynamicTranslateSource);
  assert.equal(parsed.translations.get("Mbaby_a"), "`${get.poptip('rule_mamba')}欢杀甲`");
  assert.equal(parsed.translations.get("minia"), "甲技");
  assert.equal(parsed.infoLiterals.get("minia").value, "当前描述");
});

test("accepts unquoted unicode property keys", () => {
  const unicodeKeySource = `
const pack = {
  character: {
    Mbaby_a: ['male', 'wei', 4, ['minia']],
  },
  skill: {
    minia: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    zhouyu_宫: '宫',
    minia: '甲技',
    minia_info: '当前描述',
  },
};
`;

  const parsed = parsePackSource(unicodeKeySource);
  assert.equal(parsed.translations.get("zhouyu_宫"), "宫");
});
