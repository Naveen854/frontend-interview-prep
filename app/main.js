const isDigitClass = (char) => char >= "0" && char <= "9";

function matchWCharacterClass(inputLine) {
    return inputLine.split("").every(char => 
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z") ||
      isDigitClass(char) ||
      char === "_"
    );
  }

function matchPattern(inputLine, pattern) {
  if (pattern.length === 1) {
    return inputLine.includes(pattern);
  }else if(pattern === "\\d"){
    console.log("Pattern is \\d");
    return inputLine.split("").some(isDigitClass);
  }else if(pattern === "\\w"){
    return matchWCharacterClass(inputLine);
  } else {
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

  console.error("Logs from your program will appear here");

  // Uncomment this block to pass the first stage
  if (matchPattern(inputLine, pattern)) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
