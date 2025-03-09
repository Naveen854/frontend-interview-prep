/***
 * generator function ---> only yield promises.
 *  - generator.next - should return promise
 * Our function should pass the values resolved by the promise back to the generator.
 *  - return next.value
 * If the promise rejects, your function should throw that error back to the generator.
 *  - generator.throw
 * cancel callback is called before the generator is done, your function should throw an error back to the generator.
 *  - design promise assign cancel reject
 * That error should be the string "Cancelled" (Not an Error object).
 * If the error was caught, the returned promise should resolve with the next value that was yielded or returned
 * Otherwise, the promise should reject with the thrown error. No more code should be executed.
 * When the generator is done, the promise your function returned should resolve the value the generator returned.
 *  If, however, the generator throws an error, the returned promise should reject with the error.
 * 
 */

/**
 * @param {Generator} generator
 * @return {[Function, Promise]}
 */
var cancellable = function(generator) {
    let cancelled = false;
    let cancel;
    let cancellablePromise = new Promise((_,reject)=>{
        cancel = ()=>{
            cancelled = true
            reject("Cancelled")
        }
    })
    let promise = (async ()=>{
        let next = generator.next()
        while(!cancelled || !next.done){
            try{
                generator.next(await Promise.race([next.value,cancellablePromise]))
            }catch(e){
                generator.throw(e)
            }
        }
        return next.value
    })()
    return [cancel, promise]
};


generatorFunction = function*() { 
    yield new Promise(res => setTimeout(res, 200)); 
    return "Success"; 
}
const [cancel, promise] = cancellable(generatorFunction());
setTimeout(cancel, 50);
console.log(promise.catch(console.log)); // logs "Cancelled" at t=50ms
