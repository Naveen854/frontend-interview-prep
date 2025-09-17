const isDigit = (char) => char >= "0" && char <= "9";
const isLowerCase = (char) => char >= "a" && char <= "z";
const isUpperCase = (char) => char >= "A" && char <= "Z";

const Quantifiers = new Set(["*", "+", "?"]);

function isWord(char) {
  return (
    isLowerCase(char) || isUpperCase(char) || isDigit(char) || char === "_"
  );
}

function matchChar(char, token) {
  if (char === undefined) return false;
  if (token.type === "dot") return true;
  if (token.type === "digit") return isDigit(char);
  if (token.type === "word") return isWord(char);
  if (token.type === "charClass") {
    const { charSet, negate } = token.value;
    const inSet = charSet.has(char);
    return negate ? !inSet : inSet;
  }
  return char === token.value;
}

function expandAlternationGroups(pattern) {
  let start = -1;
  let end = -1;

  // Step 1: Find the first '(' and its matching ')'
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === "(" && start === -1) {
      start = i;
    } else if (pattern[i] === ")" && start !== -1) {
      end = i;
      break;
    }
  }

  if (start === -1 || end === -1) return [pattern];

  const before = pattern.slice(0, start);
  const group = pattern.slice(start + 1, end);
  let after = pattern.slice(end + 1);

  let quant = "";
  if (after[0] === "?" || after[0] === "*" || after[0] === "+") {
    quant = after[0];
    after = after.slice(1);
  }

  const options = group.split("|");
  const results = options.map((opt) => before + opt + quant + after);

  return results;
}


function tokenize(pat) {
  const tokens = [];
  let i = 0;
  let anchorStart = false;
  let anchorEnd = false;
  let groupCount = 0;
  const groupStack = [];

  if (pat[0] === "^") {
    anchorStart = true;
    i++;
  }

  while (i < pat.length) {
    let char = pat[i];

    // Special case for end anchor
    if (char === "$" && i === pat.length - 1) {
      anchorEnd = true;
      i++;
      break;
    }

    // Handle escaped characters first
    if (char === "\\") {
      i++;
      const next = pat[i];
      let quantifier = null;
      
      // Look ahead for quantifier
      if (i + 1 < pat.length && Quantifiers.has(pat[i + 1])) {
        quantifier = pat[i + 1];
        i++;
      }

      if (next === "d") {
        tokens.push({ type: "digit", value: null, quantifier });
        i++;
        continue;
      }
      if (next === "w") {
        tokens.push({ type: "word", value: null, quantifier });
        i++;
        continue;
      }
      if (isDigit(next)) {
        tokens.push({
          type: "backref",
          group: parseInt(next, 10),
          quantifier: null,
        });
        i++;
        continue;
      }
      tokens.push({ type: "char", value: next, quantifier: null });
      i++;
      continue;
    }

    if (char === ".") {
      i++;
      let quantifier = null;
      if (i < pat.length && Quantifiers.has(pat[i])) {
        quantifier = pat[i];
        i++;
      }
      tokens.push({ type: "dot", value: null, quantifier });
      continue;
    }

    let quantifier = null;
    if (i + 1 < pat.length && Quantifiers.has(pat[i + 1])) {
      quantifier = pat[i + 1];
      i += 2;
    } else {
      i++;
    }

    tokens.push({ type: "char", value: char, quantifier });
  }

  return { tokens, anchorStart, anchorEnd };
}

// Updated matchFrom with capture groups and backref support
function matchFrom(text, ti, tokens, pi, captures = {}) {
    if (pi === tokens.length) {
        return ti;
    }

    const token = tokens[pi];

    // Handle digit with + quantifier specially
    if (token.type === "digit" && token.quantifier === "+") {
        if (!isDigit(text[ti])) return false;
        let i = ti + 1;
        // Consume all consecutive digits
        while (i < text.length && isDigit(text[i])) {
            i++;
        }
        return matchFrom(text, i, tokens, pi + 1, captures);
    }

    if (token.quantifier === null) {
        if (!matchChar(text[ti], token)) {
            return false;
        }
        return matchFrom(text, ti + 1, tokens, pi + 1, captures);
    }

    if (token.quantifier === "?") {
        // Try skipping first
        const skipResult = matchFrom(text, ti, tokens, pi + 1, captures);
        if (skipResult !== false) return skipResult;
        
        // Try matching once
        if (matchChar(text[ti], token)) {
            return matchFrom(text, ti + 1, tokens, pi + 1, captures);
        }
        return false;
    }

    if (token.quantifier === "*") {
      let i = ti;
      while (i < text.length && matchChar(text[i], token)) {
        if (matchFrom(text, i, tokens, pi + 1, captures)) return true;
        i++;
      }
      return matchFrom(text, i, tokens, pi + 1, captures);
    }

    if (token.quantifier === "+") {
      if (!matchChar(text[ti], token)) return false;
      let i = ti + 1;
      while (i < text.length && matchChar(text[i], token)) {
        if (matchFrom(text, i, tokens, pi + 1, captures)) return true;
        i++;
      }
      return matchFrom(text, i, tokens, pi + 1, captures);
    }

    return false;
}

// Other functions like matches, main() stay similar with small changes to call matchFrom with captures

function matches(text, tokens, anchorStart, anchorEnd) {
  
    // If start anchored, only try from position 0
    const startPositions = anchorStart 
        ? [0] 
        : Array.from({ length: text.length }, (_, i) => i);

    for (let start of startPositions) {
        const end = matchFrom(text, start, tokens, 0);
        if (end !== false) {
            if (anchorEnd) {
                if (end === text.length) {
                    return true;
                }
                continue;
            }
            return true;
        }
    }
    
    return false;
}

function main() {
  let pattern = process.argv[3];
  const inputLine = require("fs").readFileSync(0, "utf-8").trim();

  if (process.argv[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }

  // First expand any alternation groups in the pattern
  const patterns = expandAlternationGroups(pattern);
  const alternatives = patterns.map(tokenize);

  process.on("exit",(code)=>{
    console.log("Process exited with code:", code);
  })

  for (const { tokens, anchorStart, anchorEnd } of alternatives) {
    if (matches(inputLine, tokens, anchorStart, anchorEnd)) {
      process.exit(0);
    }
  }

 

  process.exit(1);
}

// Only call main once at the end
main();
