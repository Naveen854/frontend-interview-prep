var TimeLimitedCache = function() {
    this.cacheMap = new Map();
    this.timeoutKeyMap = new Map();
};

/** 
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 */
TimeLimitedCache.prototype.set = function(key, value, duration) {
    const hasKeyInCacheMap = this.cacheMap.has(key)
    if(hasKeyInCacheMap){
        clearTimeout(this.timeoutKeyMap.get(key))
    }
    this.cacheMap.set(key, value);
    let timerId = this.setTimerForKey(key,duration)
    this.timeoutKeyMap.set(key,timerId)
    return hasKeyInCacheMap
};

TimeLimitedCache.prototype.setTimerForKey = function(key,duration){
    function clearKeyValPairInCacheMap(){
        this.cacheMap.delete(key)
    }
    return setTimeout(clearKeyValPairInCacheMap.bind(this),duration)
}

/** 
 * @param {number} key
 * @return {number} value associated with key
 */
TimeLimitedCache.prototype.get = function(key) {
    return this.cacheMap.get(key) ?? -1
};

/** 
 * @return {number} count of non-expired keys
 */
TimeLimitedCache.prototype.count = function() {
    return this.cacheMap.size
};

const timeLimitedCache = new TimeLimitedCache()
console.log(timeLimitedCache.set(1, 42, 100)); // false
timerCall(()=>console.log(timeLimitedCache.get(1)),50)
timerCall(()=>console.log(timeLimitedCache.count()),50)
timerCall(()=>console.log(timeLimitedCache.get(1)),150)

function timerCall(func,delay){
    setTimeout(func, delay);
}