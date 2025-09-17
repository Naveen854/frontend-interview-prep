/**
 * @param {number} x
 * @param {number} n
 * @return {number}
 */

/* Divide the problem into sub-problems
    * For n = 0 -> 1
    * For n = 1 -> x
    * For n = 2 -> again divide into smaller by dividing n/2 and find maxPow on it
    * Conquer part
    * b = b 

*/
function myPow(x, n) {
    if(n === 1){
        return x
    }
    if(n < 0){
        x = 1 / x
        n = -n
        return myPow(x,n)
    }
    let mid = Math.floor(n / 2)
    let b = myPow(x,mid)
    let result = (b * b) % 1337
    if(n % 2 === 0) {
        return result 
    } else{
        return result * x
    }
};