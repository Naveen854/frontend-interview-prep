const { group } = require("console");

const isDigitClass = (char) => char >= "0" && char <= "9";

function matchWCharacterClass(inputLine) {
    return inputLine.split("").some(char => 
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      isDigitClass(char) ||
      char === "_"
    );
};



const isWordInCharacterGroup = (word, groups) => {
  const isCharacterInGroup = (char) => {
    return groups.includes(char);
  }
  return word.split("").some(isCharacterInGroup);
}

function matchCharacterGroups(inputLine, pattern) {
  const shouldNegated = pattern[1] === "^";
  const patternArray = pattern.split("");
  const groups = shouldNegated ? patternArray.slice(2,-1) : patternArray.slice(1,-1);
  const result = isWordInCharacterGroup(inputLine, groups);
  return shouldNegated ? !result : result;
};

function matchPattern(inputLine, pattern) {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  }else if(pattern === "\\d"){
    return inputLine.split("").some(isDigitClass);
  }else if(pattern === "\\w"){
    return matchWCharacterClass(inputLine);
  }else if(pattern.startsWith("[") && pattern.endsWith("]")){
    return matchCharacterGroups(inputLine,pattern);
  }else {
    throw new Error(`Unhandled pattern ${pattern}`);
  }
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
  console.error("Logs from your program will appear here");

  // Uncomment this block to pass the first stage
  if (matchPattern(inputLine, pattern)) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
