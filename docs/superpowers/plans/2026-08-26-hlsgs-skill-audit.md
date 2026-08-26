# 欢乐三国杀技能文案审计实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 使用《欢乐三国杀》2.3.6 官方客户端配置审计 504 名欢乐武将实际拥有的技能描述，并将所有可唯一映射、由扩展自身维护的静态文案校准为官方语义。

**Architecture:** 新增一个无第三方依赖的 Node 审计工具，静态解析 `MiNikill.js` 的武将、技能与翻译对象，并把仓库武将约束到官方武将的技能 ID 集合中完成确定性映射。工具先生成分类报告，再仅对唯一映射且可安全格式化的扩展自有静态 `_info` 文本生成写回结果；核心复用、动态描述和歧义项只报告。

**Tech Stack:** Node.js 24、Node 内置 `node:test`、ES modules、JSON、现有 JavaScript 扩展源码。

## Global Constraints

- 官方基准固定为包名 `com.yk.happysha`、版本 `2.3.6` 的已解密 `gameconfing.json`。
- 本次只审计技能描述，不修改技能实现。
- 范围仅包括 `MiNikill.character` 中 504 名武将直接拥有的主技能。
- 只有角色和技能均唯一映射、描述由扩展维护、且为静态字符串时才允许自动修改。
- noname 核心复用技能、动态翻译、同名歧义、官方缺失和本地缺失项只进入报告。
- 官方客户端数据和生成的完整审计报告不得提交到仓库。
- 写回文案保持官方规则语义，并只做仓库格式所需的 HTML、空白、标点和编号规范化。

---

### Task 1: 静态解析 MiNikill 包结构

**Files:**
- Create: `tools/hlsgs-skill-audit.mjs`
- Create: `tests/hlsgsSkillAudit.test.mjs`

**Interfaces:**
- Produces: `extractObjectBody(source, marker): string`
- Produces: `splitTopLevelEntries(body): Array<{ key: string, value: string }>`
- Produces: `parsePackSource(source): { characters: Map<string, string[]>, localSkills: Set<string>, translations: Map<string, string>, infoLiterals: Map<string, { value: string, start: number, end: number, quote: string }> }`
- Consumes: UTF-8 source text only; does not execute `MiNikill.js`.

- [ ] **Step 1: Write the failing parser tests**

Add fixture source directly in `tests/hlsgsSkillAudit.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the parser test and verify RED**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: FAIL because `tools/hlsgs-skill-audit.mjs` does not exist.

- [ ] **Step 3: Implement lexical object parsing**

Implement a string-aware scanner in `tools/hlsgs-skill-audit.mjs`:

```js
export function extractObjectBody(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing object marker: ${marker}`);
  const open = source.indexOf("{", markerIndex + marker.length);
  if (open < 0) throw new Error(`Missing opening brace after: ${marker}`);
  const close = findMatchingDelimiter(source, open, "{", "}");
  return source.slice(open + 1, close);
}

export function splitTopLevelEntries(body) {
  return splitTopLevel(body, ",")
    .map(entry => entry.trim())
    .filter(Boolean)
    .map(entry => {
      const colon = findTopLevelColon(entry);
      if (colon < 0) throw new Error(`Invalid object entry: ${entry.slice(0, 80)}`);
      return {
        key: parsePropertyKey(entry.slice(0, colon).trim()),
        value: entry.slice(colon + 1).trim(),
      };
    });
}
```

The scanner must skip escaped single/double quoted strings, template literals, line comments and block comments while balancing `()`, `[]` and `{}`. `parsePackSource` must:

1. Extract `character: {`, `skill: {` and `translate: {`.
2. Parse only top-level properties.
3. Read the fourth character-array element as a literal string array.
4. Record top-level skill keys as extension-owned skills.
5. Decode static string literals; reject template literals containing `${`.
6. Store exact source offsets for `_info` literal replacement.

- [ ] **Step 4: Run parser tests and verify GREEN**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit parser**

```powershell
git add tools\hlsgs-skill-audit.mjs tests\hlsgsSkillAudit.test.mjs
git commit -m "test: add MiNikill skill audit parser" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: 建立官方配置与角色约束映射

**Files:**
- Modify: `tools/hlsgs-skill-audit.mjs`
- Modify: `tests/hlsgsSkillAudit.test.mjs`

**Interfaces:**
- Produces: `parseOfficialConfig(json): { generals: OfficialGeneral[], skillsById: Map<string, OfficialSkill> }`
- Produces: `mapPackToOfficial(pack, official): AuditEntry[]`
- `OfficialGeneral`: `{ id: string, name: string, skillIds: string[] }`
- `OfficialSkill`: `{ id: string, name: string, describe: string }`
- `AuditEntry.status`: `"matched" | "core-reused" | "dynamic-info" | "missing-local-info" | "missing-general" | "ambiguous-general" | "missing-skill" | "ambiguous-skill"`

- [ ] **Step 1: Add failing unique/ambiguous mapping tests**

Use this official fixture:

```js
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
```

Assert:

```js
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
```

- [ ] **Step 2: Run mapping tests and verify RED**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: FAIL because official parsing and mapping exports are missing.

- [ ] **Step 3: Implement deterministic mapping**

Implement:

```js
export function normalizeGeneralName(name) {
  return name
    .replace(/^欢杀/, "")
    .replace(/\s+/g, "")
    .trim();
}

export function parseOfficialConfig(json) {
  const skillsById = new Map(
    json.skills.Skills.Skill.map(skill => [
      String(skill.ID),
      { id: String(skill.ID), name: skill.Name, describe: skill.Describe },
    ]),
  );
  const generals = json.generalcards.Cards.Card.map(general => ({
    id: String(general.CardID),
    name: general.CardName,
    skillIds: String(general.Skills ?? "")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean),
  }));
  return { generals, skillsById };
}
```

For each repository character:

1. Resolve its translated display name.
2. Remove only the exact `欢杀` prefix and whitespace.
3. Find official generals with exactly equal normalized names.
4. Require exactly one official general.
5. For every direct repository skill, classify core reuse before attempting write access.
6. Resolve the repository skill display name.
7. Search only that official general's `skillIds`.
8. Require exactly one official skill with the same display name.
9. Return a complete audit entry with candidate IDs and reason text.

Do not add fuzzy matching.

- [ ] **Step 4: Run mapping tests and verify GREEN**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit mapping**

```powershell
git add tools\hlsgs-skill-audit.mjs tests\hlsgsSkillAudit.test.mjs
git commit -m "feat: map MiNikill skills to official config" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: 规范化官方文案并安全生成写回

**Files:**
- Modify: `tools/hlsgs-skill-audit.mjs`
- Modify: `tests/hlsgsSkillAudit.test.mjs`

**Interfaces:**
- Produces: `normalizeOfficialDescription(describe): { safe: boolean, value?: string, reason?: string }`
- Produces: `classifyDifferences(entries): AuditEntry[]`
- Produces: `applySafeFixes(source, entries): string`
- `AuditEntry.status` additionally includes `"consistent" | "different" | "format-risk"`

- [ ] **Step 1: Add failing normalization and replacement tests**

```js
test("normalizes official line breaks and spacing without changing rules", () => {
  assert.deepEqual(
    normalizeOfficialDescription('效果一。<br>效果二（X为“标记”的数量）。'),
    { safe: true, value: '效果一。效果二（X为“标记”的数量）。' },
  );
});

test("rejects unsupported official markup", () => {
  const result = normalizeOfficialDescription('<font color="red">效果</font>');
  assert.equal(result.safe, false);
  assert.match(result.reason, /unsupported markup/i);
});

test("replaces only the exact static info literal", () => {
  const pack = parsePackSource(source);
  const entry = {
    skillId: "minia",
    status: "different",
    normalizedOfficialDescription: "官方甲技。",
    writableInfo: pack.infoLiterals.get("minia"),
  };
  const changed = applySafeFixes(source, [entry]);
  assert.match(changed, /minia_info: '官方甲技。'/);
  assert.match(changed, /Mbaby_a: '欢杀甲'/);
});
```

- [ ] **Step 2: Run normalization tests and verify RED**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: FAIL because normalization and writeback exports are missing.

- [ ] **Step 3: Implement conservative normalization**

`normalizeOfficialDescription` must:

1. Convert `<br>`, `<br/>` and `<br />` to an empty sentence boundary.
2. Convert straight double quotes surrounding Chinese terms to `“”` only when they are paired.
3. Remove whitespace immediately inside Chinese punctuation.
4. Preserve all numbers, card names, skill names, zones, conditions and variable definitions.
5. Return `safe: false` for every remaining `<...>` tag, HTML entity other than `&nbsp;`, or unmatched quote.

`applySafeFixes` must sort replacements by descending source offset, preserve the original quote style, escape only the active quote and backslashes, and reject overlapping replacements.

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit normalization and writeback**

```powershell
git add tools\hlsgs-skill-audit.mjs tests\hlsgsSkillAudit.test.mjs
git commit -m "feat: generate safe official skill text fixes" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: 增加 CLI、报告和真实配置基线

**Files:**
- Modify: `tools/hlsgs-skill-audit.mjs`
- Modify: `tests/hlsgsSkillAudit.test.mjs`
- Create outside repository: `C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-before.json`
- Create outside repository: `C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-before.md`

**Interfaces:**
- CLI: `node tools/hlsgs-skill-audit.mjs --source <path> --official <path> --json-report <path> --markdown-report <path> [--write]`
- Exit `0`: audit completed, including reportable mismatches.
- Exit `1`: invalid input, parse failure, unsafe write request or I/O failure.

- [ ] **Step 1: Add failing CLI argument and summary tests**

Test exported `parseArgs(argv)` and `summarize(entries)`:

```js
test("requires source, official, and both report paths", () => {
  assert.throws(() => parseArgs([]), /--source/);
});

test("summarizes every audit status", () => {
  assert.deepEqual(
    summarize([{ status: "consistent" }, { status: "different" }, { status: "core-reused" }]),
    { consistent: 1, different: 1, "core-reused": 1 },
  );
});
```

- [ ] **Step 2: Run CLI tests and verify RED**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: FAIL because CLI helpers are missing.

- [ ] **Step 3: Implement CLI and reports**

The JSON report must include metadata:

```js
{
  schemaVersion: 1,
  officialPackage: "com.yk.happysha",
  officialVersion: "2.3.6",
  generatedAt: new Date().toISOString(),
  sourcePath,
  officialPath,
  summary,
  entries,
}
```

The Markdown report must contain a summary table and separate tables for `different`, `format-risk`, `core-reused`, `missing-general`, `ambiguous-general`, `missing-skill`, `ambiguous-skill`, `dynamic-info` and `missing-local-info`.

With `--write`, write the fully updated source only after both reports are successfully generated and all replacement offsets validate.

- [ ] **Step 4: Run tests and verify GREEN**

Run:

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Run the real baseline audit without writing**

Run:

```powershell
node tools\hlsgs-skill-audit.mjs `
  --source js\precontent\MiNikill.js `
  --official C:\Users\Jiahui\.copilot\session-state\90b79816-6e31-4d0b-874a-bb757685e465\files\hlsgs-apk\gameconfing.json `
  --json-report C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-before.json `
  --markdown-report C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-before.md
```

Expected: exit `0`; reports list exactly 504 repository characters and every direct skill slot.

- [ ] **Step 6: Review mapping quality**

Check that:

- Every `matched`, `consistent` or `different` row has one official general ID and one official skill ID.
- No global skill-name-only mapping exists.
- Duplicate official general or skill candidates are classified as ambiguous.
- Core reuse and dynamic descriptions have no writable source range.
- Report entry count equals all direct skill slots, including repeated shared skills per character.

- [ ] **Step 7: Commit CLI**

```powershell
git add tools\hlsgs-skill-audit.mjs tests\hlsgsSkillAudit.test.mjs
git commit -m "feat: add official skill audit reports" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: 应用并审查唯一映射的官方文案

**Files:**
- Modify: `js/precontent/MiNikill.js`
- Create outside repository: `C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-after.json`
- Create outside repository: `C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-after.md`

**Interfaces:**
- Consumes: the tested Task 4 CLI and official configuration.
- Produces: updated static `_info` strings only.

- [ ] **Step 1: Preserve the failing baseline evidence**

Read `hlsgs-skill-audit-before.json` and record the `different` count. It must be greater than zero before writing; otherwise stop because the write path would not be tested against the reported defect.

- [ ] **Step 2: Apply safe fixes**

Run the Task 4 command with `--write` and output to the `after` report paths:

```powershell
node tools\hlsgs-skill-audit.mjs `
  --source js\precontent\MiNikill.js `
  --official C:\Users\Jiahui\.copilot\session-state\90b79816-6e31-4d0b-874a-bb757685e465\files\hlsgs-apk\gameconfing.json `
  --json-report C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-after.json `
  --markdown-report C:\Users\Jiahui\.copilot\session-state\a6463ad7-4019-42a9-a16a-51fecfa4e5a0\files\hlsgs-skill-audit-after.md `
  --write
```

Expected: only `js/precontent/MiNikill.js` changes.

- [ ] **Step 3: Re-run audit after write**

Run the same command without `--write`, targeting the same after-report paths.

Expected:

- `different: 0` for all safely writable unique mappings.
- `format-risk`, ambiguous, missing, dynamic and core-reused counts remain report-only.

- [ ] **Step 4: Review every changed description**

Use:

```powershell
git --no-pager diff --word-diff=plain -- js\precontent\MiNikill.js
```

For every changed `_info`, compare:

- Trigger timing.
- Optional/mandatory wording.
- Per-turn/per-phase/game limits.
- Target and card-zone restrictions.
- Draw, damage, recovery and loss values.
- Variable definitions such as `X` and `Y`.
- Parentheses and condition scope.

If a generated normalization is unclear, revert only that entry and classify it as `format-risk`; do not hand-invent wording.

- [ ] **Step 5: Run focused validation**

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
node --check js\precontent\MiNikill.js
git --no-pager diff --check
```

Expected: all commands exit `0`.

- [ ] **Step 6: Commit official text corrections**

```powershell
git add js\precontent\MiNikill.js
git commit -m "fix: align MiNikill skill descriptions with official config" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: 最终审计与交付

**Files:**
- Read: `tools/hlsgs-skill-audit.mjs`
- Read: `tests/hlsgsSkillAudit.test.mjs`
- Read outside repository: before/after JSON and Markdown reports.

**Interfaces:**
- Produces: final count-based audit statement with explicit unresolved categories.

- [ ] **Step 1: Run complete verification**

```powershell
node --test tests\hlsgsSkillAudit.test.mjs
node --check tools\hlsgs-skill-audit.mjs
node --check js\precontent\MiNikill.js
git --no-pager diff --check HEAD~1..HEAD
git status --short
```

Expected: tests pass, syntax checks pass, diff check passes, and the worktree contains no uncommitted source changes.

- [ ] **Step 2: Validate report invariants**

Read the final JSON report and assert:

```js
const total = Object.values(report.summary).reduce((sum, count) => sum + count, 0);
assert.equal(total, report.entries.length);
assert.equal(report.summary.different ?? 0, 0);
assert.equal(
  report.entries.filter(entry => entry.status === "consistent").every(
    entry => entry.officialGeneralId && entry.officialSkillId,
  ),
  true,
);
```

Also verify the report covers exactly 504 distinct repository character IDs.

- [ ] **Step 3: Summarize without overstating coverage**

Report:

- Distinct characters inspected.
- Direct skill slots inspected.
- Unique extension-owned static skills mapped.
- Descriptions changed.
- Already-consistent descriptions.
- Core-reused, dynamic, missing and ambiguous counts.
- Official baseline package/version.
- Paths to the before/after reports.

Do not describe unresolved categories as officially consistent.
