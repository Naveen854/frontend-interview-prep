// Given two non-negative integers, num1 and num2 represented as string, return the sum of num1 and num2 as a string.

// You must solve the problem without using any built-in library for handling large integers (such as BigInteger). You must also not convert the inputs to integers directly.

// Example 1:

// Input: num1 = "11", num2 = "123"
// Output: "134"
// Example 2:

// Input: num1 = "456", num2 = "77"
// Output: "533"
// Example 3:

// Input: num1 = "0", num2 = "0"
// Output: "0"

/**
 * @param {string} num1
 * @param {string} num2
 * @return {string}
 */
var addStrings = function(num1, num2) {
    let carry = 0
    let n1 = num1.length - 1;
    let n2 = num2.length - 1;
    let result = ''
    while(n1 >= 0 || n2 >= 0 || carry){
        let sum = 0
        if(n1 >= 0){
            sum += num1[n1] - '0'
            n1--
        }
        
        if(n2 >= 0){
            sum += num2[n2] - '0'
            n2--
        }
        if(carry){
            sum += carry
        }
        carry = Math.floor(sum / 10)
        sum = sum % 10
        result = sum + result
    }
    return result
};

console.log(addStrings("11","123") === "134")
console.log(addStrings("456","77") === "533")

// Variant 2 : Add Decimal Strings;
// Problem: Given 2 strings str1 and str2, which represent numbers in string, perform addition of the numbers and return the result as a string.

// Example 1: str1 = "123.52" and str2 = "11.2", output should be "134.72"
// Example 2: str1 = "110.75" and str2 = "9", output should be "119.75"

// Constraints: You may not convert entire string to integer directly. Strings may be null and will always have values >=0.0

// we reuse the implementation of addTwoStrings without carry
function addTwoNumberStrings(num1,num2,carry){
    let n1 = num1.length - 1;
    let n2 = num2.length - 1;
    let result = ''
    while(n1 >= 0 || n2 >= 0 || carry){
        let sum = 0
        if(n1 >= 0){
            sum += num1[n1] - '0'
            n1--
        }
        
        if(n2 >= 0){
            sum += num2[n2] - '0'
            n2--
        }
        if(carry){
            sum += carry
        }
        carry = Math.floor(sum / 10)
        result = (sum % 10 )+ result
    }
    return [result,carry]
}

function addTwoDecimals(num1,num2){
    let [inte1 = '',decimal1=''] = num1.split('.')
    let [inte2='',decimal2=''] = num2.split('.')
    if(decimal1.length == 0 && decimal2.length === 0){
        const [sum,carry] = addTwoNumberStrings(inte1,inte2,0)
        return carry ? carry + sum : sum 
    }
    if(decimal2.length > decimal1.length){
        decimal1 = decimal1.padEnd(decimal2.length,"0")
    }else{
        decimal2 = decimal2.padEnd(decimal1.length,"0")
    }
    let [decimalSum,decimalCarry] = addTwoNumberStrings(decimal1,decimal2,0)
    let [integerSum,integerCarry] = addTwoNumberStrings(inte1,inte2,decimalCarry)
    
    return integerCarry ? integerCarry + integerSum + "." + decimalSum : integerSum + "." + decimalSum
}

console.log(addTwoDecimals("11.","22."))
console.log(addTwoDecimals("19.","29."))
console.log(addTwoDecimals("11.33","22.1"))