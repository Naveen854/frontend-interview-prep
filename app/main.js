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


function matchCharacterGroups(inputLine, pattern) {
  const shouldNegated = pattern[1] === "^";
  const patternSet = new Set(pattern.replace("[","").replace("^","").replace("]","").split(""));
  const result = inputLine.split("").some(char => shouldNegated ? !patternSet.has(char): patternSet.has(char));
  return result;
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
