import test from "node:test";
import assert from "node:assert/strict";
import {
  mapPackToOfficial,
  parseOfficialConfig,
  parsePackSource,
} from "../tools/hlsgs-skill-audit.mjs";

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

const official = {
  generalcards: {
    Cards: {
      Card: [
        { CardID: "10", CardName: "甲", Skills: "100" },
        { CardID: "11", CardName: "乙", Skills: "101,102" },
        { CardID: "12", CardName: "乙", Skills: "103" },
      ],
    },
  },
  skills: {
    Skills: {
      Skill: [
        { ID: "100", Name: "甲技", Describe: "官方甲技。" },
        { ID: "101", Name: "乙技", Describe: "官方乙技第一版。" },
        { ID: "102", Name: "辅技", Describe: "官方辅技。" },
        { ID: "103", Name: "乙技", Describe: "官方乙技第二版。" },
      ],
    },
  },
};

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

test("maps a skill only inside a uniquely resolved general skill set", () => {
  const entries = mapPackToOfficial(parsePackSource(source), parseOfficialConfig(official));
  const entry = entries.find(item => item.skillId === "minia");

  assert.equal(entry.status, "matched");
  assert.equal(entry.officialGeneralId, "10");
  assert.equal(entry.officialSkillId, "100");
});

test("reports duplicate official generals instead of guessing", () => {
  const duplicateSource = source.replace("欢杀甲", "欢杀乙").replaceAll("甲技", "乙技");
  const [entry] = mapPackToOfficial(parsePackSource(duplicateSource), parseOfficialConfig(official));

  assert.equal(entry.status, "ambiguous-general");
});

test("reports reused core skills without making them writable", () => {
  const entries = mapPackToOfficial(parsePackSource(source), parseOfficialConfig(official));

  assert.equal(entries.find(item => item.skillId === "coreSkill").status, "core-reused");
});
