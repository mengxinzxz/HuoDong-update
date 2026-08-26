const REGEX_PREFIX_KEYWORDS = new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "in",
  "instanceof",
  "new",
  "of",
  "return",
  "throw",
  "typeof",
  "void",
  "yield",
]);

const GENERAL_NAME_WRAPPER_PATTERN = /^`?\$\{get\.poptip\('rule_mamba'\)\}/u;
const GENERAL_NAME_PREFIX_REWRITES = [
  [/^SP欢杀/u, "SP"],
  [/^欢杀神/u, "神"],
  [/^欢杀谋/u, "谋"],
  [/^欢杀星/u, "星"],
  [/^欢杀乐/u, "乐"],
  [/^欢杀界/u, "界"],
  [/^欢杀/u, ""],
];
const GENERAL_NAME_EXACT_ALIASES = new Map([
  ["神大乔小乔", "神大小乔"],
  ["甄宓", "甄姬"],
  ["界甄宓", "界甄姬"],
  ["谋甄宓", "谋甄姬"],
  ["SP甄宓", "SP甄姬"],
  ["神甄宓", "神甄姬"],
]);

export function extractObjectBody(source, marker) {
  return locateObjectSection(source, marker).body;
}

export function splitTopLevelEntries(body) {
  return splitEntrySegments(body).map(segment => parseEntry(segment.text));
}

export function parsePackSource(source) {
  const characters = new Map();
  const localSkills = new Set();
  const translations = new Map();
  const infoLiterals = new Map();

  const characterSection = locateObjectSection(source, "character:");
  for (const segment of splitEntrySegments(characterSection.body)) {
    const entry = parseEntry(segment.text);
    characters.set(entry.key, parseCharacterSkillArray(entry.value));
  }

  const skillSection = locateObjectSection(source, "skill:");
  for (const { key } of splitTopLevelEntries(skillSection.body)) {
    localSkills.add(key);
  }

  const translateSection = locateObjectSection(source, "translate:");
  for (const segment of splitEntrySegments(translateSection.body, translateSection.start)) {
    const entry = parseEntry(segment.text);
    const rawValue = trimTopLevelTrivia(entry.value);
    if (isInterpolatedTemplateLiteral(rawValue)) {
      translations.set(entry.key, rawValue);
      continue;
    }

    const literal = parseStringLiteral(rawValue, segment.valueStart);
    translations.set(entry.key, literal.value);
    if (entry.key.endsWith("_info")) {
      infoLiterals.set(entry.key.slice(0, -5), literal);
    }
  }

  return { characters, localSkills, translations, infoLiterals };
}

export function normalizeGeneralName(name) {
  let normalized = String(name ?? "").replace(/\s+/gu, "").trim();
  if (normalized.startsWith("`") && normalized.endsWith("`")) {
    normalized = normalized.slice(1, -1);
  }
  while (GENERAL_NAME_WRAPPER_PATTERN.test(normalized)) {
    normalized = normalized.replace(GENERAL_NAME_WRAPPER_PATTERN, "");
  }
  for (const [pattern, replacement] of GENERAL_NAME_PREFIX_REWRITES) {
    if (pattern.test(normalized)) {
      normalized = normalized.replace(pattern, replacement);
      break;
    }
  }
  return GENERAL_NAME_EXACT_ALIASES.get(normalized) ?? normalized;
}

export function parseOfficialConfig(json) {
  const skillsById = new Map(
    toArray(json?.skills?.Skills?.Skill).map(skill => [
      String(skill.ID),
      {
        id: String(skill.ID),
        name: String(skill.Name ?? ""),
        describe: String(skill.Describe ?? ""),
      },
    ]),
  );

  const generals = toArray(json?.generalcards?.Cards?.Card).map(general => ({
    id: String(general.CardID),
    name: String(general.CardName ?? ""),
    skillIds: String(general.Skills ?? "")
      .split(",")
      .map(value => value.trim())
      .filter(Boolean),
  }));

  return { generals, skillsById };
}

export function mapPackToOfficial(pack, official) {
  const entries = [];
  const generalCandidatesByName = new Map();

  for (const general of official.generals) {
    const normalizedName = normalizeGeneralName(general.name);
    const candidates = generalCandidatesByName.get(normalizedName) ?? [];
    candidates.push(general);
    generalCandidatesByName.set(normalizedName, candidates);
  }

  for (const [characterId, skillIds] of pack.characters) {
    const characterName = pack.translations.get(characterId) ?? "";
    const normalizedCharacterName = normalizeGeneralName(characterName);
    const generalCandidates = generalCandidatesByName.get(normalizedCharacterName) ?? [];
    const uniqueGeneral = generalCandidates.length === 1 ? generalCandidates[0] : null;

    for (const skillId of skillIds) {
      const writableInfo = pack.infoLiterals.get(skillId) ?? null;
      const entry = {
        characterId,
        characterName,
        normalizedCharacterName,
        skillId,
        skillName: pack.translations.get(skillId) ?? "",
        status: "missing-general",
        officialGeneralId: uniqueGeneral?.id ?? null,
        officialGeneralIds: generalCandidates.map(candidate => candidate.id),
        officialSkillId: null,
        officialSkillIds: [],
        writableInfo: null,
        currentDescription: null,
        officialDescription: null,
        reason: "",
      };

      if (writableInfo) {
        entry.writableInfo = writableInfo;
        entry.currentDescription = writableInfo.value;
      }

      if (!pack.localSkills.has(skillId)) {
        entry.status = "core-reused";
        entry.reason = "Skill is not defined in MiNikill.skill and is treated as a core-reused skill.";
        entries.push(entry);
        continue;
      }

      if (generalCandidates.length === 0) {
        entry.status = "missing-general";
        entry.reason = characterName
          ? `No official general matched normalized repository name "${normalizedCharacterName}".`
          : "Repository character translation is missing, so no official general can be resolved.";
        entries.push(entry);
        continue;
      }

      if (generalCandidates.length > 1) {
        entry.status = "ambiguous-general";
        entry.reason = `Multiple official generals matched normalized repository name "${normalizedCharacterName}".`;
        entries.push(entry);
        continue;
      }

      if (!entry.skillName) {
        entry.status = "missing-skill";
        entry.reason = "Repository skill translation is missing, so official skill matching cannot start.";
        entries.push(entry);
        continue;
      }

      const skillCandidates = uniqueGeneral.skillIds
        .map(officialSkillId => official.skillsById.get(officialSkillId))
        .filter(Boolean)
        .filter(skill => skill.name === entry.skillName);

      entry.officialSkillIds = skillCandidates.map(skill => skill.id);

      if (skillCandidates.length === 0) {
        entry.status = "missing-skill";
        entry.reason = `No official skill named "${entry.skillName}" exists inside official general ${uniqueGeneral.id}.`;
        entries.push(entry);
        continue;
      }

      if (skillCandidates.length > 1) {
        entry.status = "ambiguous-skill";
        entry.reason = `Multiple official skills named "${entry.skillName}" exist inside official general ${uniqueGeneral.id}.`;
        entries.push(entry);
        continue;
      }

      const [officialSkill] = skillCandidates;
      const infoKey = `${skillId}_info`;

      entry.officialSkillId = officialSkill.id;
      entry.officialDescription = officialSkill.describe;

      if (writableInfo) {
        entry.status = "matched";
        entry.reason = `Mapped repository skill "${entry.skillName}" to official general ${uniqueGeneral.id} skill ${officialSkill.id}.`;
        entries.push(entry);
        continue;
      }

      if (pack.translations.has(infoKey)) {
        entry.status = "dynamic-info";
        entry.reason = "Repository skill info exists but is dynamic, so it cannot be rewritten safely.";
        entries.push(entry);
        continue;
      }

      entry.status = "missing-local-info";
      entry.reason = "Repository skill has no extension-owned static _info entry.";
      entries.push(entry);
    }
  }

  return entries;
}

function toArray(value) {
  if (value == null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function locateObjectSection(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) {
    throw new Error(`Missing object marker: ${marker}`);
  }

  const open = source.indexOf("{", markerIndex + marker.length);
  if (open < 0) {
    throw new Error(`Missing opening brace after: ${marker}`);
  }

  const close = findMatchingDelimiter(source, open, "{", "}");
  return {
    body: source.slice(open + 1, close),
    start: open + 1,
    end: close,
  };
}

function splitEntrySegments(body, baseOffset = 0) {
  return splitTopLevelRanges(body, ",", baseOffset).map(segment => {
    const colon = findTopLevelColon(segment.text);
    if (colon < 0) {
      throw new Error(`Invalid object entry: ${segment.text.slice(0, 80)}`);
    }

    const valueRaw = segment.text.slice(colon + 1);
    const valueRange = getMeaningfulRange(valueRaw);
    return {
      ...segment,
      valueStart: segment.start + colon + 1 + valueRange.start,
    };
  });
}

function parseEntry(text) {
  const colon = findTopLevelColon(text);
  if (colon < 0) {
    throw new Error(`Invalid object entry: ${text.slice(0, 80)}`);
  }

  return {
    key: parsePropertyKey(text.slice(0, colon).trim()),
    value: trimTopLevelTrivia(text.slice(colon + 1)),
  };
}

function parseCharacterSkillArray(value) {
  const trimmed = trimTopLevelTrivia(value);
  if (trimmed.startsWith("{")) {
    const close = findMatchingDelimiter(trimmed, 0, "{", "}");
    if (close !== trimmed.length - 1) {
      throw new Error(`Unsupported trailing content after object literal: ${trimmed.slice(0, 80)}`);
    }

    const fields = new Map(splitTopLevelEntries(trimmed.slice(1, -1)).map(entry => [entry.key, entry.value]));
    const skills = fields.get("skills");
    if (!skills) {
      throw new Error(`Character object is missing skills: ${trimmed.slice(0, 80)}`);
    }
    return parseStringArray(skills);
  }

  const elements = parseArrayElements(value);
  if (elements.length < 4) {
    throw new Error(`Character definition is missing a skill array: ${value.slice(0, 80)}`);
  }
  return parseStringArray(elements[3]);
}

function parseArrayElements(source) {
  const trimmed = trimTopLevelTrivia(source);
  if (!trimmed.startsWith("[")) {
    throw new Error(`Expected array literal: ${trimmed.slice(0, 80)}`);
  }

  const close = findMatchingDelimiter(trimmed, 0, "[", "]");
  if (close !== trimmed.length - 1) {
    throw new Error(`Unsupported trailing content after array literal: ${trimmed.slice(0, 80)}`);
  }

  return splitTopLevel(trimmed.slice(1, -1), ",");
}

function parseStringArray(source) {
  return parseArrayElements(source).map(item => parseStringLiteral(item).value);
}

function parsePropertyKey(source) {
  if (!source) {
    throw new Error("Missing property key");
  }

  if (source[0] === "'" || source[0] === '"' || source[0] === "`") {
    return parseStringLiteral(source).value;
  }

  if (
    /^[$_\p{ID_Start}][$_\u200C\u200D\p{ID_Continue}]*$/u.test(source) ||
    /^(?:0|[1-9]\d*)$/u.test(source)
  ) {
    return source;
  }

  throw new Error(`Unsupported property key: ${source}`);
}

function parseStringLiteral(source, start = 0) {
  const trimmed = trimTopLevelTrivia(source);
  const quote = trimmed[0];
  if (quote !== "'" && quote !== '"' && quote !== "`") {
    throw new Error(`Expected string literal: ${trimmed.slice(0, 80)}`);
  }

  const end =
    quote === "`" ? skipTemplateLiteral(trimmed, 0) : skipQuotedString(trimmed, 0, quote);
  if (end !== trimmed.length) {
    throw new Error(`Unsupported trailing content after string literal: ${trimmed.slice(0, 80)}`);
  }

  return {
    value: decodeLiteralValue(trimmed),
    start,
    end: start + trimmed.length,
    quote,
  };
}

function decodeLiteralValue(literal) {
  const quote = literal[0];
  let value = "";

  for (let index = 1; index < literal.length - 1; index += 1) {
    const char = literal[index];
    if (char !== "\\") {
      if (quote === "`" && char === "$" && literal[index + 1] === "{") {
        throw new Error(`Unsupported template interpolation: ${literal.slice(0, 80)}`);
      }
      value += char;
      continue;
    }

    const next = literal[index + 1];
    if (next === undefined) {
      throw new Error(`Unterminated escape sequence: ${literal.slice(0, 80)}`);
    }

    if (next === "\r") {
      index += literal[index + 2] === "\n" ? 2 : 1;
      continue;
    }
    if (next === "\n" || next === "\u2028" || next === "\u2029") {
      index += 1;
      continue;
    }

    if (next === "x") {
      const hex = literal.slice(index + 2, index + 4);
      if (!/^[\da-fA-F]{2}$/.test(hex)) {
        throw new Error(`Invalid hex escape: ${literal.slice(0, 80)}`);
      }
      value += String.fromCodePoint(Number.parseInt(hex, 16));
      index += 3;
      continue;
    }

    if (next === "u") {
      if (literal[index + 2] === "{") {
        const close = literal.indexOf("}", index + 3);
        const codePoint = literal.slice(index + 3, close);
        if (close < 0 || !/^[\da-fA-F]+$/u.test(codePoint)) {
          throw new Error(`Invalid unicode escape: ${literal.slice(0, 80)}`);
        }
        value += String.fromCodePoint(Number.parseInt(codePoint, 16));
        index = close;
        continue;
      }

      const hex = literal.slice(index + 2, index + 6);
      if (!/^[\da-fA-F]{4}$/.test(hex)) {
        throw new Error(`Invalid unicode escape: ${literal.slice(0, 80)}`);
      }
      value += String.fromCodePoint(Number.parseInt(hex, 16));
      index += 5;
      continue;
    }

    value += decodeSimpleEscape(next);
    index += 1;
  }

  return value;
}

function decodeSimpleEscape(char) {
  switch (char) {
    case "'":
    case '"':
    case "`":
    case "\\":
      return char;
    case "b":
      return "\b";
    case "f":
      return "\f";
    case "n":
      return "\n";
    case "r":
      return "\r";
    case "t":
      return "\t";
    case "v":
      return "\v";
    case "0":
      return "\0";
    default:
      return char;
  }
}

function splitTopLevel(source, separator) {
  return splitTopLevelRanges(source, separator).map(segment => segment.text);
}

function splitTopLevelRanges(source, separator, baseOffset = 0) {
  const segments = [];
  const state = { canStartRegex: true };
  const depth = { brace: 0, bracket: 0, paren: 0 };
  let start = 0;

  for (let index = 0; index < source.length; ) {
    const token = readToken(source, index, state.canStartRegex);
    if (token) {
      state.canStartRegex = token.canStartRegex;
      index = token.end;
      continue;
    }

    const char = source[index];
    if (char === "{") {
      depth.brace += 1;
      state.canStartRegex = true;
    } else if (char === "}") {
      depth.brace -= 1;
      if (depth.brace < 0) throw new Error("Unexpected closing brace");
      state.canStartRegex = false;
    } else if (char === "[") {
      depth.bracket += 1;
      state.canStartRegex = true;
    } else if (char === "]") {
      depth.bracket -= 1;
      if (depth.bracket < 0) throw new Error("Unexpected closing bracket");
      state.canStartRegex = false;
    } else if (char === "(") {
      depth.paren += 1;
      state.canStartRegex = true;
    } else if (char === ")") {
      depth.paren -= 1;
      if (depth.paren < 0) throw new Error("Unexpected closing parenthesis");
      state.canStartRegex = false;
    } else if (
      char === separator &&
      depth.brace === 0 &&
      depth.bracket === 0 &&
      depth.paren === 0
    ) {
      const range = getMeaningfulRange(source.slice(start, index));
      if (range.start < range.end) {
        segments.push({
          text: source.slice(start + range.start, start + range.end),
          start: baseOffset + start + range.start,
          end: baseOffset + start + range.end,
        });
      }
      start = index + 1;
      state.canStartRegex = true;
    } else {
      state.canStartRegex = updatesRegexState(char, state.canStartRegex);
    }

    index += 1;
  }

  if (depth.brace !== 0 || depth.bracket !== 0 || depth.paren !== 0) {
    throw new Error("Unbalanced delimiters");
  }

  const range = getMeaningfulRange(source.slice(start));
  if (range.start < range.end) {
    segments.push({
      text: source.slice(start + range.start, start + range.end),
      start: baseOffset + start + range.start,
      end: baseOffset + start + range.end,
    });
  }

  return segments;
}

function findTopLevelColon(source) {
  const state = { canStartRegex: true };
  const depth = { brace: 0, bracket: 0, paren: 0 };

  for (let index = 0; index < source.length; ) {
    const token = readToken(source, index, state.canStartRegex);
    if (token) {
      state.canStartRegex = token.canStartRegex;
      index = token.end;
      continue;
    }

    const char = source[index];
    if (char === "{") {
      depth.brace += 1;
      state.canStartRegex = true;
    } else if (char === "}") {
      depth.brace -= 1;
      if (depth.brace < 0) throw new Error("Unexpected closing brace");
      state.canStartRegex = false;
    } else if (char === "[") {
      depth.bracket += 1;
      state.canStartRegex = true;
    } else if (char === "]") {
      depth.bracket -= 1;
      if (depth.bracket < 0) throw new Error("Unexpected closing bracket");
      state.canStartRegex = false;
    } else if (char === "(") {
      depth.paren += 1;
      state.canStartRegex = true;
    } else if (char === ")") {
      depth.paren -= 1;
      if (depth.paren < 0) throw new Error("Unexpected closing parenthesis");
      state.canStartRegex = false;
    } else if (
      char === ":" &&
      depth.brace === 0 &&
      depth.bracket === 0 &&
      depth.paren === 0
    ) {
      return index;
    } else {
      state.canStartRegex = updatesRegexState(char, state.canStartRegex);
    }

    index += 1;
  }

  return -1;
}

function findMatchingDelimiter(source, start, open, close) {
  if (source[start] !== open) {
    throw new Error(`Expected ${open} at index ${start}`);
  }

  const state = { canStartRegex: true };
  let depth = 1;

  for (let index = start + 1; index < source.length; ) {
    const token = readToken(source, index, state.canStartRegex);
    if (token) {
      state.canStartRegex = token.canStartRegex;
      index = token.end;
      continue;
    }

    const char = source[index];
    if (char === open) {
      depth += 1;
      state.canStartRegex = true;
    } else if (char === close) {
      depth -= 1;
      state.canStartRegex = false;
      if (depth === 0) {
        return index;
      }
    } else {
      state.canStartRegex = updatesRegexState(char, state.canStartRegex);
    }

    index += 1;
  }

  throw new Error(`Unterminated ${open}${close} pair starting at index ${start}`);
}

function getMeaningfulRange(source) {
  const state = { canStartRegex: true };
  const depth = { brace: 0, bracket: 0, paren: 0 };
  let start = 0;

  while (start < source.length) {
    const token = readToken(source, start, true);
    if (token?.type === "comment" || token?.type === "whitespace") {
      start = token.end;
      continue;
    }
    if (token) {
      break;
    }
    if (/\s/u.test(source[start])) {
      start += 1;
      continue;
    }
    break;
  }

  let end = start;
  for (let index = start; index < source.length; ) {
    const token = readToken(source, index, state.canStartRegex);
    if (token) {
      if (
        !(
          depth.brace === 0 &&
          depth.bracket === 0 &&
          depth.paren === 0 &&
          (token.type === "comment" || token.type === "whitespace")
        )
      ) {
        end = token.end;
      }
      state.canStartRegex = token.canStartRegex;
      index = token.end;
      continue;
    }

    const char = source[index];
    if (char === "{") {
      depth.brace += 1;
      state.canStartRegex = true;
      end = index + 1;
    } else if (char === "}") {
      depth.brace -= 1;
      if (depth.brace < 0) throw new Error("Unexpected closing brace");
      state.canStartRegex = false;
      end = index + 1;
    } else if (char === "[") {
      depth.bracket += 1;
      state.canStartRegex = true;
      end = index + 1;
    } else if (char === "]") {
      depth.bracket -= 1;
      if (depth.bracket < 0) throw new Error("Unexpected closing bracket");
      state.canStartRegex = false;
      end = index + 1;
    } else if (char === "(") {
      depth.paren += 1;
      state.canStartRegex = true;
      end = index + 1;
    } else if (char === ")") {
      depth.paren -= 1;
      if (depth.paren < 0) throw new Error("Unexpected closing parenthesis");
      state.canStartRegex = false;
      end = index + 1;
    } else if (
      depth.brace === 0 &&
      depth.bracket === 0 &&
      depth.paren === 0 &&
      /\s/u.test(char)
    ) {
      index += 1;
      continue;
    } else {
      state.canStartRegex = updatesRegexState(char, state.canStartRegex);
      end = index + 1;
    }

    index += 1;
  }

  return { start, end };
}

function trimTopLevelTrivia(source) {
  const range = getMeaningfulRange(source);
  return source.slice(range.start, range.end);
}

function isInterpolatedTemplateLiteral(source) {
  return source.startsWith("`") && hasTemplateInterpolation(source);
}

function hasTemplateInterpolation(literal) {
  for (let index = 1; index < literal.length - 1; index += 1) {
    const char = literal[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (char === "$" && literal[index + 1] === "{") {
      return true;
    }
  }
  return false;
}

function readToken(source, index, canStartRegex) {
  const char = source[index];
  if (char === undefined) {
    return null;
  }

  if (/\s/u.test(char)) {
    let end = index + 1;
    while (end < source.length && /\s/u.test(source[end])) end += 1;
    return { type: "whitespace", end, canStartRegex };
  }

  if (char === "/" && source[index + 1] === "/") {
    return { type: "comment", end: skipLineComment(source, index), canStartRegex };
  }

  if (char === "/" && source[index + 1] === "*") {
    return { type: "comment", end: skipBlockComment(source, index), canStartRegex };
  }

  if (char === "'" || char === '"') {
    return { type: "string", end: skipQuotedString(source, index, char), canStartRegex: false };
  }

  if (char === "`") {
    return { type: "string", end: skipTemplateLiteral(source, index), canStartRegex: false };
  }

  if (char === "/" && canStartRegex) {
    return { type: "regex", end: skipRegexLiteral(source, index), canStartRegex: false };
  }

  if (isIdentifierStart(char)) {
    const end = readIdentifierEnd(source, index);
    const word = source.slice(index, end);
    return {
      type: "identifier",
      end,
      canStartRegex: REGEX_PREFIX_KEYWORDS.has(word),
    };
  }

  if (/\d/u.test(char)) {
    return { type: "number", end: readNumberEnd(source, index), canStartRegex: false };
  }

  return null;
}

function updatesRegexState(char, current) {
  if ("([{,:;!?=~%^&|*+-<>".includes(char)) {
    return true;
  }
  if (".}".includes(char) || ")]".includes(char)) {
    return false;
  }
  return current;
}

function isIdentifierStart(char) {
  return /[A-Za-z_$]/u.test(char);
}

function readIdentifierEnd(source, index) {
  let end = index + 1;
  while (end < source.length && /[\w$]/u.test(source[end])) end += 1;
  return end;
}

function readNumberEnd(source, index) {
  let end = index + 1;
  while (end < source.length && /[\dA-Za-z_.]/u.test(source[end])) end += 1;
  return end;
}

function skipQuotedString(source, start, quote) {
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (char === quote) {
      return index + 1;
    }
  }
  throw new Error(`Unterminated string literal at index ${start}`);
}

function skipTemplateLiteral(source, start) {
  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (char === "`") {
      return index + 1;
    }
    if (char === "$" && source[index + 1] === "{") {
      const close = findMatchingDelimiter(source, index + 1, "{", "}");
      index = close;
    }
  }
  throw new Error(`Unterminated template literal at index ${start}`);
}

function skipLineComment(source, start) {
  let end = start + 2;
  while (end < source.length && source[end] !== "\n" && source[end] !== "\r") end += 1;
  return end;
}

function skipBlockComment(source, start) {
  const end = source.indexOf("*/", start + 2);
  if (end < 0) {
    throw new Error(`Unterminated block comment at index ${start}`);
  }
  return end + 2;
}

function skipRegexLiteral(source, start) {
  let inCharacterClass = false;

  for (let index = start + 1; index < source.length; index += 1) {
    const char = source[index];
    if (char === "\\") {
      index += 1;
      continue;
    }
    if (char === "[" && !inCharacterClass) {
      inCharacterClass = true;
      continue;
    }
    if (char === "]" && inCharacterClass) {
      inCharacterClass = false;
      continue;
    }
    if ((char === "\n" || char === "\r") && !inCharacterClass) {
      throw new Error(`Unterminated regex literal at index ${start}`);
    }
    if (char === "/" && !inCharacterClass) {
      let end = index + 1;
      while (end < source.length && /[A-Za-z]/u.test(source[end])) end += 1;
      return end;
    }
  }

  throw new Error(`Unterminated regex literal at index ${start}`);
}
