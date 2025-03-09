/**
 * @param {Function} fn
 * @param {number} t
 * @return {Function}
 */
var timeLimit = function(fn, t) {
    return async function(...args) {
        let start = performance.now()
        const result =  await fn.apply(null,args)
        let end = performance.now()
        if((end-start) > t){
            throw new Error("Time Limit Exceeded")
        }else{
            return result
        }
    }
};

/**
 * const limited = timeLimit((t) => new Promise(res => setTimeout(res, t)), 100);
 * limited(150).catch(console.log) // "Time Limit Exceeded" at t=100ms
 */

const fn = async (n) => { 
    await new Promise(res => setTimeout(res, 100)); 
    return n * n; 
}
const limited = timeLimit(fn,50)

const start = performance.now()
let result;
try {
   const res = await limited([5])
   result = {"resolved": res, "time": Math.floor(performance.now() - start)};
} catch (err) {
   result = {"rejected": err, "time": Math.floor(performance.now() - start)};
}
console.log(result) // Output