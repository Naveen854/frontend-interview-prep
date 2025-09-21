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
  // Recursively expand alternation groups
  function expandOnce(pat) {
    // Find the first alternation group (contains |)
    let bestStart = -1;
    let bestEnd = -1;
    let bestGroup = "";
    
    for (let i = 0; i < pat.length; i++) {
      if (pat[i] === "(") {
        // Find the matching closing parenthesis
        let depth = 1;
        let j = i + 1;
        let groupContent = "";
        
        while (j < pat.length && depth > 0) {
          if (pat[j] === "(") {
            depth++;
          } else if (pat[j] === ")") {
            depth--;
          }
          
          if (depth > 0) {
            groupContent += pat[j];
          }
          j++;
        }
        
        if (depth === 0) {
          // Check if this specific group (not nested subgroups) contains |
          // We need to check only at depth 0 within this group
          let hasDirectAlternation = false;
          let subDepth = 0;
          
          for (let k = 0; k < groupContent.length; k++) {
            if (groupContent[k] === "(") {
              subDepth++;
            } else if (groupContent[k] === ")") {
              subDepth--;
            } else if (groupContent[k] === "|" && subDepth === 0) {
              hasDirectAlternation = true;
              break;
            }
          }
          
          if (hasDirectAlternation) {
            // Found an alternation group
            bestStart = i;
            bestEnd = j - 1;
            bestGroup = groupContent;
            break;
          }
        }
      }
    }

    if (bestStart === -1 || bestEnd === -1) {
      return [pat];
    }

    const before = pat.slice(0, bestStart);
    const group = bestGroup;
    let after = pat.slice(bestEnd + 1);

    let quant = "";
    if (after[0] === "?" || after[0] === "*" || after[0] === "+") {
      quant = after[0];
      after = after.slice(1);
    }

    const options = group.split("|");
    
    // Check if there are backreferences in the original pattern
    const hasBackrefs = pattern.includes("\\1") || pattern.includes("\\2") || pattern.includes("\\3") || pattern.includes("\\4");
    
    const results = options.map((opt) => {
      if (hasBackrefs) {
        // Preserve capture groups if there are backreferences
        return before + "(" + opt + ")" + quant + after;
      } else {
        // Don't add capture groups if no backreferences
        return before + opt + quant + after;
      }
    });

    return results;
  }

  // Keep expanding until no more alternations are found
  let currentPatterns = [pattern];
  let maxIterations = 10; // Prevent infinite loops
  
  while (maxIterations > 0) {
    maxIterations--;
    let anyExpanded = false;
    const newPatterns = [];
    
    // console.log(`Expansion iteration ${10 - maxIterations}, current patterns:`, currentPatterns);
    
    for (const pat of currentPatterns) {
      const expandedPat = expandOnce(pat);
      // console.log(`  Pattern "${pat}" expanded to:`, expandedPat);
      if (expandedPat.length > 1) {
        anyExpanded = true;
        newPatterns.push(...expandedPat);
      } else {
        newPatterns.push(pat);
      }
    }
    
    currentPatterns = newPatterns;
    // console.log(`  After iteration: anyExpanded=${anyExpanded}, patterns:`, currentPatterns);
    
    if (!anyExpanded) {
      break; // No more expansions possible
    }
  }

  return currentPatterns;
}


function tokenize(pat) {
  const tokens = [];
  let i = 0;
  let anchorStart = false;
  let anchorEnd = false;
 
  const groupStack = [];
  let groupCounter = 1; // Start numbering groups from 1

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

    if(char === "("){
      const currentGroup = groupCounter++;
      groupStack.push({ groupNumber: currentGroup, startTokenIndex: tokens.length });
      tokens.push({ type: "groupStart", groupNumber: currentGroup });
      i++;
      continue;
    }

    if(char === ")"){
      if (groupStack.length === 0) {
        throw new Error("Unmatched closing parenthesis");
      }
      const group = groupStack.pop();
      tokens.push({ type: "groupEnd", groupNumber: group.groupNumber });
      i++;
      continue;
    }

    // Handle character classes [...]
    if (char === "[") {
      i++; // Skip opening [
      let negate = false;
      
      // Check for negation [^...]
      if (i < pat.length && pat[i] === "^") {
        negate = true;
        i++;
      }
      
      const charSet = new Set();
      
      // Parse characters until closing ]
      while (i < pat.length && pat[i] !== "]") {
        charSet.add(pat[i]);
        i++;
      }
      
      if (i >= pat.length) {
        throw new Error("Unmatched opening bracket");
      }
      
      i++; // Skip closing ]
      
      // Check for quantifier
      let quantifier = null;
      if (i < pat.length && Quantifiers.has(pat[i])) {
        quantifier = pat[i];
        i++;
      }
      
      tokens.push({
        type: "charClass",
        value: { charSet, negate },
        quantifier
      });
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

  if (groupStack.length > 0) {
    throw new Error("Unmatched opening parenthesis");
  }

  return { tokens, anchorStart, anchorEnd, captures: {} };
}

// Updated matchFrom with capture groups and backref support
function matchFrom(text, ti, tokens, pi, captures = {}) {
    // Base case - successfully consumed all tokens
    if (pi === tokens.length) {
        return { position: ti, captures };
    }

    // Base case - ran out of text
    if (ti >= text.length) {
        // If we have tokens left, they must all be optional
        while (pi < tokens.length) {
            const token = tokens[pi];
            if (!token || token.quantifier !== "?") {
                return false;
            }
            pi++;
        }
        return { position: ti, captures };
    }

    const token = tokens[pi];
    // console.log(`Matching '${text[ti]}' at pos ${ti} against token:`, token);

    // Handle capture group start
    if (token.type === "groupStart") {
        const groupNum = token.groupNumber;
        
        // Mark the start position for this group
        const newCaptures = { ...captures, [`${groupNum}_start`]: ti };
        return matchFrom(text, ti, tokens, pi + 1, newCaptures);
    }

    // Handle capture group end
    if (token.type === "groupEnd") {
        const groupNum = token.groupNumber;
        const startPos = captures[`${groupNum}_start`];
        
        if (startPos === undefined) {
            throw new Error(`Group ${groupNum} end without start`);
        }
        
        const capturedText = text.slice(startPos, ti);
        // console.log(`Captured group ${groupNum}: "${capturedText}" (from pos ${startPos} to ${ti})`);
        
        const newCaptures = { ...captures, [groupNum]: capturedText };
        
        // Clean up the start position marker
        delete newCaptures[`${groupNum}_start`];
        
        return matchFrom(text, ti, tokens, pi + 1, newCaptures);
    }

    // Handle backreference
    if (token.type === "backref") {
        const groupNumber = token.group;
        const captured = captures[groupNumber];
        
        // console.log(`Backreference \\${groupNumber}: captured="${captured}", current text="${text.slice(ti, ti + 10)}"`);
        
        if (!captured) {
            // console.log(`Group ${groupNumber} not captured yet`);
            return false; // Referenced group hasn't been captured yet
        }
        
        // Check if the captured text matches at current position
        const textToMatch = text.slice(ti, ti + captured.length);
        // console.log(`Comparing "${textToMatch}" with captured "${captured}"`);
        
        if (textToMatch === captured) {
            // console.log(`Backreference match successful`);
            return matchFrom(text, ti + captured.length, tokens, pi + 1, captures);
        }
        // console.log(`Backreference match failed`);
        return false;
    }

    // Handle quantifiers for any token type
    if (token.quantifier === "+") {
        // Must match at least once
        if (!matchChar(text[ti], token)) return false;
        
        // Find the maximum possible match length
        let maxEnd = ti + 1;
        while (maxEnd < text.length && matchChar(text[maxEnd], token)) {
            maxEnd++;
        }
        
        // Try from longest match to shortest (backtracking)
        for (let end = maxEnd; end > ti; end--) {
            const result = matchFrom(text, end, tokens, pi + 1, captures);
            if (result !== false) {
                return result;
            }
        }
        return false;
    }
    
    if (token.quantifier === "*") {
        // Find the maximum possible match length
        let maxEnd = ti;
        while (maxEnd < text.length && matchChar(text[maxEnd], token)) {
            maxEnd++;
        }
        
        // Try from longest match to shortest (backtracking)
        for (let end = maxEnd; end >= ti; end--) {
            const result = matchFrom(text, end, tokens, pi + 1, captures);
            if (result !== false) {
                return result;
            }
        }
        return false;
    }

    // Handle optional character (?)
    if (token.quantifier === "?") {
        // Try matching the character first
        if (ti < text.length && matchChar(text[ti], token)) {
            const matchResult = matchFrom(text, ti + 1, tokens, pi + 1, captures);
            if (matchResult !== false) {
                return matchResult;
            }
        }
        
        // Try skipping (don't consume character)
        return matchFrom(text, ti, tokens, pi + 1, captures);
    }

    // Regular character match
    if (matchChar(text[ti], token)) {
        return matchFrom(text, ti + 1, tokens, pi + 1, captures);
    }

    return false;
}

function matches(text, tokens, anchorStart, anchorEnd, captures) {
    const startPositions = anchorStart ? [0] : Array.from({ length: text.length }, (_, i) => i);

    for (let start of startPositions) {
        const result = matchFrom(text, start, tokens, 0, captures);
        
        if (result !== false) {
            const end = result.position || result; // Handle both old and new return formats
            
            // For end anchor, match must consume entire string
            if (anchorEnd && end !== text.length) {
                continue;
            }
            return true;
        }
    }
    return false;
}

function main() {
    const pattern = process.argv[3];
    const filename = process.argv[4];
    
    // Read input from file or stdin
    let inputLines;
    if (filename) {
        // Read from file
        try {
            const fileContent = require("fs").readFileSync(filename, "utf-8");
            inputLines = fileContent.split('\n');
            // Remove the last empty line if file ends with newline
            if (inputLines.length > 0 && inputLines[inputLines.length - 1] === '') {
                inputLines.pop();
            }
        } catch (error) {
            console.error(`Error reading file ${filename}: ${error.message}`);
            process.exit(1);
        }
    } else {
        // Read from stdin - treat as single line for backward compatibility
        const inputLine = require("fs").readFileSync(0, "utf-8").trim();
        inputLines = [inputLine];
    }

    if (process.argv[2] !== "-E") {
        console.log("Expected first argument to be '-E'");
        process.exit(1);
    }

    // First expand any alternation groups in the pattern
    const patterns = expandAlternationGroups(pattern);
    const alternatives = patterns.map(tokenize);

    let hasMatches = false;

    // Check each line against all pattern alternatives
    for (const line of inputLines) {
        for (let i = 0; i < alternatives.length; i++) {
            const { tokens, anchorStart, anchorEnd, captures } = alternatives[i];
            if (matches(line, tokens, anchorStart, anchorEnd, captures)) {
                // Match found - print the line
                console.log(line);
                hasMatches = true;
                break; // Move to next line (don't test other alternatives for this line)
            }
        }
    }
    
    // Exit with appropriate code
    process.exit(hasMatches ? 0 : 1);
}

// Remove the event listener and only call main
main();
