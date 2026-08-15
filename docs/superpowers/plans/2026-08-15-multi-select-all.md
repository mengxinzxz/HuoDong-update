# Multi-Select All Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable noname's native select-all/invert-selection control for every safe independent multi-card selection in the extension, including all local “破军” implementations.

**Architecture:** Keep noname as the sole owner of the button UI and behavior. Opt eligible selection events into the existing mechanism with `allowChooseAll`, while leaving combination-constrained and distribution dialogs unchanged.

**Tech Stack:** JavaScript ES modules, noname event APIs, PowerShell, Node.js syntax checker

## Global Constraints

- Do not copy or override noname's select-all UI implementation.
- Do not force-enable the user's `choose_all_button` setting.
- Do not change selection ranges, filters, AI callbacks, skill resolution, or card visibility.
- Exclude selections whose legality depends on the combined point total, suit, name, type, ordering, exchange, or distribution of selected cards.
- Preserve each file's existing quote and chaining style.

---

## File Map

- Modify `js/precontent/MiNikill.js`: opt safe Mini and mobile-pack multi-card events into the native control, including `minipojun` and `minidcpojun`.
- Modify `js/precontent/WeChatkill.js`: opt safe WeChat-pack multi-card events into the native control, including `wechatpojun`.
- Modify `js/precontent/MiNiAppkill.js`: opt safe app-pack “匡弼”, “义舍”, and unrestricted give events into the native control.
- Modify `js/precontent/MX_feihongyinxue.js`: opt safe 飞鸿印雪 button/card selections into the native control.
- Modify `js/precontent/huodongcharacter.js`: opt safe core-pack give, recast, and obtain events into the native control.

### Task 1: Enable all “破军” selectors

**Files:**
- Modify: `js/precontent/MiNikill.js:16810-16922`
- Modify: `js/precontent/WeChatkill.js:6014-6028`

**Interfaces:**
- Consumes: noname's existing `choosePlayerCard(..., "allowChooseAll")` event argument.
- Produces: `minipojun`, inherited `minirepojun`, `minidcpojun`, and `wechatpojun` selection events with `event.allowChooseAll === true`.

- [ ] **Step 1: Record the failing source assertion**

Run:

```powershell
$checks = @(
  @{ File = 'js\precontent\MiNikill.js'; Pattern = "choosePlayerCard\(trigger\.target, 'he', \[1, num\], get\.prompt\(event\.name, trigger\.target\), 'allowChooseAll'\)" },
  @{ File = 'js\precontent\MiNikill.js'; Pattern = "choosePlayerCard\(target, 'he', \[1, Math\.min\(player\.maxHp, target\.countCards\('he'\)\)\], get\.prompt\(event\.name\.slice\(0, -5\), target\), 'allowChooseAll'\)" },
  @{ File = 'js\precontent\WeChatkill.js'; Pattern = "choosePlayerCard\(target, 'he', \[1, Math\.min\(target\.countCards\('he'\), target\.hp\)\], get\.prompt\('wechatpojun', target\), 'allowChooseAll'\)" }
)
foreach ($check in $checks) {
  if ((Get-Content $check.File -Raw) -notmatch $check.Pattern) { throw "Missing allowChooseAll in $($check.File): $($check.Pattern)" }
}
```

Expected: FAIL with `Missing allowChooseAll`.

- [ ] **Step 2: Add the native opt-in argument**

Change only the three calls:

```js
var next = player.choosePlayerCard(trigger.target, 'he', [1, num], get.prompt(event.name, trigger.target), 'allowChooseAll');

const next = player.choosePlayerCard(target, 'he', [1, Math.min(player.maxHp, target.countCards('he'))], get.prompt(event.name.slice(0, -5), target), 'allowChooseAll');

const result = await player.choosePlayerCard(target, 'he', [1, Math.min(target.countCards('he'), target.hp)], get.prompt('wechatpojun', target), 'allowChooseAll').set('forceAuto', true).forResult();
```

Do not add a separate call for `minirepojun`; it inherits `minipojun`.

- [ ] **Step 3: Re-run the source assertion**

Run the PowerShell command from Step 1.

Expected: command exits successfully with no output.

- [ ] **Step 4: Check syntax**

Run:

```powershell
node --check js\precontent\MiNikill.js
node --check js\precontent\WeChatkill.js
```

Expected: both commands exit with code 0 and no output.

- [ ] **Step 5: Commit**

```powershell
git add -- js\precontent\MiNikill.js js\precontent\WeChatkill.js
git commit -m "feat: add select all to pojun choices" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 2: Enable safe Mini and WeChat multi-select events

**Files:**
- Modify: `js/precontent/MiNikill.js`
- Modify: `js/precontent/WeChatkill.js`

**Interfaces:**
- Consumes: existing selection calls and noname's `allowChooseAll` event argument.
- Produces: native select-all support on independent subset selections without altering their result shape.

- [ ] **Step 1: Enumerate the approved call sites**

Use this exact inclusion list:

```text
MiNikill.js
  miniluoying: chooseButton cards [1, cards.length]
  minisidi: chooseCard non-basic cards [1, 2]
  mini*fangquan (two call sites): chooseToGive cards [1, Infinity]
  miniliuma: chooseCard cards [1, num]
  minireqianxun: chooseCard hand cards [1, num]
  minidimeng mark removal: chooseToDiscard cards [1, mark count]
  minirebuyi: choosePlayerCard visible hand cards [1, Infinity]
  miniyinbing: chooseCard non-basic cards [1, non-basic count]
  minichunlao: chooseCard Sha [1, Infinity]
  minijiqiao: chooseToDiscard non-trick cards [1, non-trick count]
  minizhouxuan: chooseCard hand cards [1, remaining capacity]
  event-card discard at the current line near 27796: chooseToDiscard [1, cards.length]
  miniheqia: chooseCard cards [1, Infinity]
  miniqibie: chooseToDiscard hand cards [1, Infinity]
  miniyingshui: chooseCard equipment cards [2, Infinity]
  minitanban: chooseCard hand cards [1, Infinity]
  minifight recast at the current line near 42090: chooseCard recastable cards [1, gained count]
  weapon replacement at the current line near 42577: chooseCard hand cards [1, 2]

WeChatkill.js
  wechatreqianxun: chooseCard hand cards [1, Infinity]
  wechatkuangbi: chooseCard cards [1, 3]
  wechathuisheng: chooseCard cards [1, all he cards]
  unrestricted chooseToDiscard at the current line near 6362: [1, Infinity]
  wechatsbtuxi equipment return: choosePlayerCard equipment cards [1, 2]
  strategy-value discard at the current line near 13400: chooseToDiscard hand cards [1, 2]
  wechatweiqi: choosePlayerCard visible hand cards [1, hp]
```

Explicitly exclude these combination-dependent calls:

```text
MiNikill.js: minixiangxing point-total choice, minifight unique-name choice,
             minichengxiang point-total choice, minignjinfan unique-suit choice,
             minitongbo distribution, and both point-sum discard dialogs.
WeChatkill.js: wechatjinfan unique-suit choice, wechatbizhuan's repeated distribution,
               the same-type recast dialog, and both exchange choices near lines 17759-17765.
```

- [ ] **Step 2: Verify at least one approved call site is currently missing the marker**

Run:

```powershell
if ((Get-Content js\precontent\MiNikill.js -Raw) -match "minichunlao[\s\S]*?chooseCard\(\[1, Infinity\][\s\S]*?\.forResult\(\)" -and
    (Get-Content js\precontent\MiNikill.js -Raw) -notmatch "minichunlao[\s\S]*?chooseCard\(\[1, Infinity\][^\r\n]*'allowChooseAll'") {
  throw 'Expected failure: minichunlao is missing allowChooseAll'
}
```

Expected: FAIL with `Expected failure`.

- [ ] **Step 3: Add `allowChooseAll` at each approved call site**

For positional APIs, append the string argument without changing existing arguments:

```js
player.chooseButton(dialog, [1, max], 'allowChooseAll')
player.chooseCard(position, [1, max], prompt, filter, 'allowChooseAll')
player.chooseToDiscard(prompt, [1, max], position, filter, 'allowChooseAll')
player.choosePlayerCard(target, position, [1, max], prompt, 'allowChooseAll')
```

Where argument ordering makes an appended positional flag unclear, keep the call intact and chain:

```js
const next = player.chooseCard(/* existing arguments */).set('allowChooseAll', true);
```

Do not set `complexCard` or `complexSelect`; do not remove existing values of those fields.

- [ ] **Step 4: Confirm approved and excluded samples**

Run:

```powershell
rg -n -C 1 "minipojun|minidcpojun|minichunlao|miniyinbing|minitanban|wechatpojun|wechatreqianxun|wechathuisheng|wechatweiqi|allowChooseAll" js\precontent\MiNikill.js js\precontent\WeChatkill.js
rg -n -C 1 "minichengxiang|minignjinfan|minitongbo|wechatjinfan|请重铸任意张同类型牌" js\precontent\MiNikill.js js\precontent\WeChatkill.js
```

Expected: every approved sample's selection chain contains `allowChooseAll`; excluded samples remain unchanged.

- [ ] **Step 5: Check syntax**

Run:

```powershell
node --check js\precontent\MiNikill.js
node --check js\precontent\WeChatkill.js
```

Expected: both commands exit with code 0 and no output.

- [ ] **Step 6: Commit**

```powershell
git add -- js\precontent\MiNikill.js js\precontent\WeChatkill.js
git commit -m "feat: enable safe multi-select controls" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 3: Enable safe selections in the remaining packs

**Files:**
- Modify: `js/precontent/MiNiAppkill.js`
- Modify: `js/precontent/MX_feihongyinxue.js`
- Modify: `js/precontent/huodongcharacter.js`

**Interfaces:**
- Consumes: existing noname selection calls.
- Produces: consistent native select-all support across the remaining extension packs.

- [ ] **Step 1: Apply the exact inclusion and exclusion list**

Add `allowChooseAll` to:

```text
MiNiAppkill.js
  unrestricted chooseToGive at the current line near 2777
  匡弼 chooseCard [1, 3]
  义舍 chooseCard [1, 2]

MX_feihongyinxue.js
  歃盟 chooseCard [1, 2]
  both 陈势 chooseButton calls [1, cards.length]
  督粮 chooseButton basic cards [1, cards.length]

huodongcharacter.js
  old_fenchai optional chooseCard [0, num]
  bolhuidu chooseCard recastable cards [1, Infinity]
  bolhuaici chooseButton cards [1, Infinity]
```

Leave these unchanged:

```text
huodongcharacter.js
  the recast choice near line 5092 because it explicitly sets complexCard
  the suit-dependent discard near line 4796

MX_feihongyinxue.js
  三顾 because selected card names must remain distinct
```

Use a positional `"allowChooseAll"` argument when the API's neighboring calls already use that form; otherwise use `.set("allowChooseAll", true)`.

- [ ] **Step 2: Inspect the complete diff**

Run:

```powershell
git --no-pager diff -- js\precontent\MiNiAppkill.js js\precontent\MX_feihongyinxue.js js\precontent\huodongcharacter.js
```

Expected: only `allowChooseAll` arguments or setters are added; no ranges, filters, AI, or skill content change.

- [ ] **Step 3: Check syntax**

Run:

```powershell
node --check js\precontent\MiNiAppkill.js
node --check js\precontent\MX_feihongyinxue.js
node --check js\precontent\huodongcharacter.js
```

Expected: all commands exit with code 0 and no output.

- [ ] **Step 4: Commit**

```powershell
git add -- js\precontent\MiNiAppkill.js js\precontent\MX_feihongyinxue.js js\precontent\huodongcharacter.js
git commit -m "feat: extend select all across card packs" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

### Task 4: Final audit and validation

**Files:**
- Verify: `js/precontent/MiNikill.js`
- Verify: `js/precontent/WeChatkill.js`
- Verify: `js/precontent/MiNiAppkill.js`
- Verify: `js/precontent/MX_feihongyinxue.js`
- Verify: `js/precontent/huodongcharacter.js`

**Interfaces:**
- Consumes: all changes from Tasks 1-3.
- Produces: evidence that the feature is syntax-safe, scope-safe, and complete for the approved call-site inventory.

- [ ] **Step 1: Run syntax checks together**

Run:

```powershell
$files = @(
  'js\precontent\MiNikill.js',
  'js\precontent\WeChatkill.js',
  'js\precontent\MiNiAppkill.js',
  'js\precontent\MX_feihongyinxue.js',
  'js\precontent\huodongcharacter.js'
)
foreach ($file in $files) {
  node --check $file
  if ($LASTEXITCODE -ne 0) { throw "Syntax check failed: $file" }
}
```

Expected: command exits successfully with no output.

- [ ] **Step 2: Verify the diff contains only the intended event opt-ins**

Run:

```powershell
git --no-pager diff main...HEAD --word-diff=plain -- js\precontent
git --no-pager diff --check main...HEAD
```

Expected: JavaScript changes only add `allowChooseAll`; `diff --check` exits successfully.

- [ ] **Step 3: Verify all local “破军” implementations**

Run:

```powershell
rg -n -C 8 "wechatpojun:|minipojun:|minirepojun:|minidcpojun:" js\precontent\WeChatkill.js js\precontent\MiNikill.js
```

Expected: `wechatpojun`, `minipojun`, and `minidcpojun` selection events contain `allowChooseAll`; `minirepojun` inherits the enabled `minipojun`.

- [ ] **Step 4: Review repository status**

Run:

```powershell
git status --short
git --no-pager log -4 --oneline
```

Expected: no uncommitted JavaScript changes; the design commit and three implementation commits are present.
