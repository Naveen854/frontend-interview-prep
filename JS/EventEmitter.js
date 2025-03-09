class EventEmitter {
    constructor(){
        this.eventWithCallbacks = new Map()
    }
    /**
     * @param {string} eventName
     * @param {Function} callback
     * @return {Object}
     */
    subscribe(eventName, callback) {
        let callbacksMap = this.eventWithCallbacks.get(eventName)
        if(!callbacksMap){
            callbacksMap = new Map()
        }
        const callbackId = Symbol()
        callbacksMap.set(callbackId,callback)
        this.eventWithCallbacks.set(eventName, callbacksMap)
        return {
            unsubscribe: () => {
                if(!callbacksMap.get(callbackId)){
                    throw "Already unsubscribed"
                }
                callbacksMap.delete(callbackId)
                return undefined
            }
        };
    }
    
    /**
     * @param {string} eventName
     * @param {Array} args
     * @return {Array}
     */
    emit(eventName, args = []) {
        let result = []
        const callbacksMap = this.eventWithCallbacks.get(eventName)
        if(!callbacksMap){
            return result
        }
        callbacksMap.forEach((fn)=>{
            result.push(fn.apply(null,args))
        })
        return result;
    }
}

// const emitter = new EventEmitter();

// const sub1 = emitter.subscribe("firstEvent",x => x + 1)
// const sub2 = emitter.subscribe("firstEvent",x => x + 2)
// sub1.unsubscribe()
// console.log(emitter.emit("firstEvent",5))
// const emitter = new EventEmitter();
// emitter.emit("firstEvent"); // [], no callback are subscribed yet
// emitter.subscribe("firstEvent", function cb1() { return 5; });
// emitter.subscribe("firstEvent", function cb2() { return 6; });
// console.log(emitter.emit("firstEvent")); // [5, 6], returns the output of cb1 and cb2

// [[], ["firstEvent", "x => x + 1"], ["firstEvent", "x => x + 2"], [0], ["firstEvent", [5]]]
const emitter = new EventEmitter();
const sub1 = emitter.subscribe("firstEvent", x => x + 1);
const sub2 = emitter.subscribe("firstEvent", x => x + 2);
sub1.unsubscribe(); // undefined
console.log(emitter.emit("firstEvent", [5])); // [7]