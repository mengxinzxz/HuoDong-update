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

const officialEvidence = {
  generalcards: {
    Cards: {
      Card: [
        { CardID: "25", CardName: "貂蝉", Skills: "67,68" },
        { CardID: "2047", CardName: "貂蝉", Skills: "67,475" },
        { CardID: "22", CardName: "甄姬", Skills: "45,46" },
        { CardID: "2006", CardName: "甄姬", Skills: "45,46" },
        { CardID: "221", CardName: "神大小乔", Skills: "4074" },
        { CardID: "426", CardName: "SP庞统", Skills: "808,809" },
        { CardID: "1681", CardName: "谋程昱", Skills: "3843" },
      ],
    },
  },
  skills: {
    Skills: {
      Skill: [
        { ID: "45", Name: "洛神", Describe: "官方洛神。" },
        { ID: "46", Name: "倾国", Describe: "官方倾国。" },
        { ID: "67", Name: "闭月", Describe: "官方闭月。" },
        { ID: "68", Name: "离间", Describe: "官方离间旧版。" },
        { ID: "475", Name: "离间", Describe: "官方离间新版。" },
        { ID: "808", Name: "过论", Describe: "官方过论。" },
        { ID: "809", Name: "送丧", Describe: "官方送丧。" },
        { ID: "3843", Name: "告谏", Describe: "官方告谏。" },
        { ID: "4074", Name: "双姝", Describe: "官方双姝。" },
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

test("maps rule_mamba-wrapped general names to official wrapped versions", () => {
  const wrappedSource = `
const pack = {
  character: {
    Mbaby_dc_sb_chengyu: ['male', 'wei', 3, ['minigaojian']],
  },
  skill: {
    minigaojian: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_dc_sb_chengyu: \`\${get.poptip('rule_mamba')}谋程昱\`,
    minigaojian: '告谏',
    minigaojian_info: '本地告谏',
  },
};
`;

  const [entry] = mapPackToOfficial(parsePackSource(wrappedSource), parseOfficialConfig(officialEvidence));

  assert.equal(entry.status, "matched");
  assert.equal(entry.officialGeneralId, "1681");
  assert.equal(entry.officialSkillId, "3843");
});

test("reports wrapped diaochan names as ambiguous instead of missing", () => {
  const wrappedSource = `
const pack = {
  character: {
    Mbaby_diaochan: ['female', 'qun', 3, ['minilijian']],
  },
  skill: {
    minilijian: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_diaochan: \`\${get.poptip('rule_mamba')}貂蝉\`,
    minilijian: '离间',
    minilijian_info: '本地离间',
  },
};
`;

  const [entry] = mapPackToOfficial(parsePackSource(wrappedSource), parseOfficialConfig(officialEvidence));

  assert.equal(entry.status, "ambiguous-general");
  assert.deepEqual(entry.officialGeneralIds, ["25", "2047"]);
});

test("maps SP欢杀 wrappers to official SP names", () => {
  const wrappedSource = `
const pack = {
  character: {
    Mbaby_re_jsp_pangtong: ['male', 'wu', 3, ['miniguolun']],
  },
  skill: {
    miniguolun: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_re_jsp_pangtong: 'SP欢杀庞统',
    miniguolun: '过论',
    miniguolun_info: '本地过论',
  },
};
`;

  const [entry] = mapPackToOfficial(parsePackSource(wrappedSource), parseOfficialConfig(officialEvidence));

  assert.equal(entry.status, "matched");
  assert.equal(entry.officialGeneralId, "426");
  assert.equal(entry.officialSkillId, "808");
});

test("applies the supported 甄宓 alias before official lookup", () => {
  const aliasSource = `
const pack = {
  character: {
    Mbaby_zhenji: ['female', 'wei', 3, ['miniluoshen']],
  },
  skill: {
    miniluoshen: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_zhenji: '欢杀甄宓',
    miniluoshen: '洛神',
    miniluoshen_info: '本地洛神',
  },
};
`;

  const [entry] = mapPackToOfficial(parsePackSource(aliasSource), parseOfficialConfig(officialEvidence));

  assert.equal(entry.status, "ambiguous-general");
  assert.deepEqual(entry.officialGeneralIds, ["22", "2006"]);
  assert.equal(entry.currentDescription, "本地洛神");
  assert.ok(entry.writableInfo);
});

test("keeps local static info on alias-resolved entries that remain report-only", () => {
  const aliasSource = `
const pack = {
  character: {
    Mbaby_old_1_daxiaoqiao: ['female', 'shen', 4, ['minishuangshu', 'miniyizheng']],
  },
  skill: {
    minishuangshu: { trigger: { player: 'phaseBegin' } },
    miniyizheng: { trigger: { player: 'phaseBegin' } },
  },
  translate: {
    Mbaby_old_1_daxiaoqiao: \`\${get.poptip('rule_mamba')}神大乔小乔\`,
    minishuangshu: '双姝',
    minishuangshu_info: '本地双姝',
    miniyizheng: '移筝',
    miniyizheng_info: '本地移筝',
  },
};
`;

  const entries = mapPackToOfficial(parsePackSource(aliasSource), parseOfficialConfig(officialEvidence));
  const matched = entries.find(item => item.skillId === "minishuangshu");
  const missing = entries.find(item => item.skillId === "miniyizheng");

  assert.equal(matched.status, "matched");
  assert.equal(matched.officialGeneralId, "221");
  assert.equal(matched.officialSkillId, "4074");
  assert.equal(missing.status, "missing-skill");
  assert.equal(missing.officialGeneralId, "221");
  assert.equal(missing.currentDescription, "本地移筝");
  assert.ok(missing.writableInfo);
});
