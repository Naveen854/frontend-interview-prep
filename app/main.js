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

function tokenize(pat) {
    const tokens = [];
    let i = 0;
    let anchorStart = false;
    let anchorEnd = false;

    if (pat[0] === '^') {
        anchorStart = true;
        i++;
    }

    while (i < pat.length) {
        let type = 'char';
        let value = pat[i];

        if(value === "["){
            let j = i + 1;
            let charSet = new Set();
            let negate = false;

            if (pat[j] === '^') {
                negate = true;
                j++;
            }

            while (j < pat.length && pat[j] !== ']') {
                charSet.add(pat[j]);
                j++;
            }

            // if (j === pat.length) {
            //     throw new Error("Unterminated character class");
            // }

            type = 'charClass';
            value = { charSet, negate };
            i = j; // Move i to the closing ']'
            i++;
            let quantifier = null;
            if (i < pat.length && Quantifiers.has(pat[i])) {
                quantifier = pat[i];
                i++;
            }
        }else if (value === '\\') {
            i++;
            const next = pat[i];
            if (next === 'd') type = 'digit';
            else if (next === 'w') type = 'word';
            else type = 'char'
            value = next;
        } else if (value === '.') {
            type = 'dot';
        } else if (value === '$' && i === pat.length - 1) {
            anchorEnd = true;
            break;
        }

        let quantifier = null;
        if (i + 1 < pat.length && Quantifiers.has(pat[i + 1])) {
            quantifier = pat[i + 1];
            i++;
        }

        tokens.push({ type, value, quantifier });
        i++;
    }

    return { tokens, anchorStart, anchorEnd };
}


function matchFrom(text, ti, tokens, pi) {
    // If all tokens are matched, success!
    if (pi === tokens.length) return ti;

    const token = tokens[pi];

    // 1) If no quantifier, just match single char
    if (token.quantifier === null) {
        if (!matchChar(text[ti], token)) return false;
        return matchFrom(text, ti + 1, tokens, pi + 1);
    }

    // 2) Quantifier '?': zero or one occurrence
    if (token.quantifier === '?') {
        // Try matching zero occurrences: skip this token
        if (matchFrom(text, ti, tokens, pi + 1)) return true;

        // Try matching one occurrence if current char matches
        if (matchChar(text[ti], token)) {
            return matchFrom(text, ti + 1, tokens, pi + 1);
        }

        // Neither worked, fail
        return false;
    }

    // 3) Quantifier '*': zero or more occurrences
    if (token.quantifier === '*') {
        let i = ti;

        // Try matching as many as possible, then try rest of tokens
        while (i <= text.length && matchChar(text[i], token)) {
            // Try to match the rest of pattern after consuming i - ti chars
            if (matchFrom(text, i, tokens, pi + 1)) return true;
            i++;
        }

        // Try zero occurrences (skip token)
        return matchFrom(text, i, tokens, pi + 1);
    }

    // 4) Quantifier '+': one or more occurrences
    if (token.quantifier === '+') {
        // First character must match at least once
        if (!matchChar(text[ti], token)) return false;

        let i = ti + 1;

        // Try matching more occurrences (greedy)
        while (i <= text.length && matchChar(text[i], token)) {
            if (matchFrom(text, i, tokens, pi + 1)) return true;
            i++;
        }

        // Try the rest of the pattern after consuming one or more chars
        return matchFrom(text, i, tokens, pi + 1);
    }

    return false;
}


function matches(text, tokens, anchorStart, anchorEnd) {
  const startPositions = anchorStart ? [0] : Array.from({ length: text.length + 1 }, (_, i) => i);

  for (let start of startPositions) {
    const end = matchFrom(text, start, tokens, 0);
    if (end !== false) {
      if (anchorEnd && end !== text.length) continue; // This enforces $
      return true;
    }
  }

  return false;
}


function main() {
  const pattern = process.argv[3];
  const inputLine = require("fs").readFileSync(0, "utf-8").trim();

  if (process.argv[2] !== "-E") {
    console.log("Expected first argument to be '-E'");
    process.exit(1);
  }

  process.on("exit", (code) => {
    console.log(`About to exit with code ${code}`);
  });

  const { tokens, anchorStart, anchorEnd } = tokenize(pattern);

  // Uncomment this block to pass the first stage
  if (matches(inputLine, tokens, anchorStart, anchorEnd)) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
