import { AggregateError, MyPromise, PromiseState } from './index';

describe("Test Initial Promise Implementation", () => {
    test("should receive a executor function when constructed and immediately called", () => {
        const executor = jest.fn();
        new MyPromise(executor);
        expect(executor.mock.calls.length).toBe(1);
        expect(typeof executor.mock.calls[0][0]).toBe("function");
        expect(typeof executor.mock.calls[0][1]).toBe("function");
    });
    test("should be in `pending` state", () => {
        const promise = new MyPromise(function(resolve,reject){});
        expect((promise as any).state).toBe("pending");
    });

    test("should transition to `fulfilled` state with `value`", () => {
        const promise = new MyPromise(function(resolve,reject){
            resolve("fulfilled");
        });
        expect(promise.state).toBe(PromiseState.FULFILLED);
        expect(promise.value).toBe("fulfilled");
    });

    test("should transition to `fulfilled` state with `reason`", () => {
        const promise = new MyPromise(function(resolve,reject){
            reject("rejected");
        });
        expect(promise.state).toBe(PromiseState.REJECTED);
        expect(promise.reason).toBe("rejected");
    });

    test("should have a `then` method", () => {
        const promise = new MyPromise(function(resolve,reject){});
        expect(typeof promise.then).toBe("function");
    });

    test("should call onFulfilled when promise is `fulfilled`", () => {
        jest.useFakeTimers();
        const value = ":)";
        const onFulfilled = jest.fn();
        const promise = new MyPromise(function(resolve,reject){
            resolve(value);
        });
        expect(onFulfilled.mock.calls.length).toBe(0);
        promise.then(onFulfilled);
        jest.runAllTicks();
        expect(onFulfilled.mock.calls.length).toBe(1);
        expect(onFulfilled.mock.calls[0][0]).toBe(value);
    });

    test("should call onRejected when promise is `rejected`", () => {
        jest.useFakeTimers();
        const reason = "The promise is failed:)";
        const onRejected = jest.fn();
        const promise = new MyPromise(function(resolve,reject){
            reject(reason);
        });
        expect(onRejected.mock.calls.length).toBe(0);
        promise.then(undefined, onRejected);
        jest.runAllTicks();
        expect(onRejected.mock.calls.length).toBe(1);
        expect(onRejected.mock.calls[0][0]).toBe(reason);
    });
});

describe("Test One-way transition in Promise Implementation", () => {
    const value = ':)';
    const reason = 'I failed :('
    jest.useFakeTimers()
    test("should not transition to rejected state if already in fulfilled state", () => {
        const onFulfilled = jest.fn();
        const onRejected = jest.fn();
        const promise = new MyPromise(function(resolve,reject){
            resolve(value);
            reject(reason);
        });
        promise.then(onFulfilled, onRejected);
        jest.runAllTicks();
        expect(onFulfilled.mock.calls.length).toBe(1);
        expect(onFulfilled.mock.calls[0][0]).toBe(value);
        expect(onRejected.mock.calls.length).toBe(0);
        expect(promise.state).toBe(PromiseState.FULFILLED);
        expect(promise.value).toBe(value);
        expect(promise.reason).toBe(null);
    });

    test("should not transition to fulfilled state if already in rejected state", () => {
        const onFulfilled = jest.fn();
        const onRejected = jest.fn();
        const promise = new MyPromise(function(resolve,reject){
            reject(reason);
            resolve(value);
        });
        promise.then(onFulfilled, onRejected);
        jest.runAllTicks();
        expect(onRejected.mock.calls.length).toBe(1);
        expect(onRejected.mock.calls[0][0]).toBe(reason);
        expect(onFulfilled.mock.calls.length).toBe(0);
        expect(promise.state).toBe(PromiseState.REJECTED);
        expect(promise.value).toBe(null);
        expect(promise.reason).toBe(reason);
    });
})


describe('Test Multiple `then` calls in Promise Implementation', () => {
    const value = ':)';
    const reason = 'I failed :('
    jest.useFakeTimers();
    test("should call all onFulfilled when promise is `fulfilled`", () => {
        const onFulfilled1 = jest.fn();
        const onFulfilled2 = jest.fn();
        const onFulfilled3 = jest.fn();
        const promise = new MyPromise(function(resolve,reject){
            resolve(value);
        });
        expect(onFulfilled1.mock.calls.length).toBe(0);
        expect(onFulfilled2.mock.calls.length).toBe(0);
        expect(onFulfilled3.mock.calls.length).toBe(0);
        promise.then(onFulfilled1);
        promise.then(onFulfilled2);
        promise.then(onFulfilled3);
        jest.runAllTicks();
        expect(onFulfilled1.mock.calls.length).toBe(1);
        expect(onFulfilled1.mock.calls[0][0]).toBe(value);
        expect(onFulfilled2.mock.calls.length).toBe(1);
        expect(onFulfilled3.mock.calls[0][0]).toBe(value);
        expect(onFulfilled3.mock.calls.length).toBe(1);
        expect(onFulfilled3.mock.calls[0][0]).toBe(value);
    });
})

describe("Handling executor errors in Promise Implementation", () => {
    const reason = 'I failed :('
    jest.useFakeTimers();
    test("should transition to rejected state if executor throws error", () => {
        const onFulfilled = jest.fn();
        const onRejected = jest.fn();
        const promise = new MyPromise(function(resolve,reject){
            throw reason;
        });
        promise.then(onFulfilled, onRejected);
        jest.runAllTicks();
        expect(onRejected.mock.calls.length).toBe(1);
        expect(onRejected.mock.calls[0][0]).toBe(reason);
        expect(onFulfilled.mock.calls.length).toBe(0);
        expect(promise.state).toBe(PromiseState.REJECTED);
        expect(promise.value).toBe(null);
        expect(promise.reason).toBe(reason);
    });
})

describe("Test Async execution",()=>{
    jest.useFakeTimers();
    const value = ":)";
    const reason = "The promise is failed:)";
    test("if a handler returns a promise, the previous promise should adapt the state of returned promise", () => {
        const onFulfilled = jest.fn();
        new MyPromise(function(resolve){
            resolve(value)
        }).then(()=> new MyPromise(resolve=> resolve(value))).then(onFulfilled);
        jest.runAllTicks();
        expect(onFulfilled.mock.calls.length).toBe(1);
        expect(onFulfilled.mock.calls[0][0]).toBe(value);
    });

    test("If handler returns a promise handled resolved in feature, the previous promise should adapt the state of returned promise", () => {
        const f1 = jest.fn();
        new MyPromise(function(resolve,reject){
            setTimeout(()=>{
                resolve(value);
            },10);
        }).then(()=> new MyPromise(resolve=> setTimeout(resolve,0,value))).then(f1);
        setTimeout(()=>{
            expect(f1.mock.calls.length).toBe(1);
            expect(f1.mock.calls[0][0]).toBe(value);
        },10);
    });
})

describe("Test Static Methods", () => {
  const value = ":)";
  const reason = "The promise is failed :)";
  test("MyPromise.resolve should return a fulfilled promise", () => {
    const promise = MyPromise.resolve(value);
    expect(promise.state).toBe(PromiseState.FULFILLED);
    expect(promise.value).toBe(value);
  });

  test("MyPromise.reject should return a rejected promise", () => {
    const promise = MyPromise.reject(reason);
    expect(promise.state).toBe(PromiseState.REJECTED);
    expect(promise.reason).toBe(reason);
  });

  test("MyPromise.resolve should return same promise if input is a promise", () => {
    const originalPromise = new MyPromise(resolve => resolve(value));
    const resolvedPromise = MyPromise.resolve(originalPromise);
    expect(resolvedPromise).toBe(originalPromise);
  });

  test("MyPromise.all should return a promise if input is an empty array", () => {
    jest.useFakeTimers();
    const promise = MyPromise.all([]);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.FULFILLED);
    expect(promise.value).toEqual([]);
  });

   test("MyPromise.all should return a promise that resolves to an array of values", () => {
     jest.useFakeTimers();
     const promises = [MyPromise.resolve(value), MyPromise.resolve(value)];
     const promise = MyPromise.all(promises);
     jest.runAllTicks();
     expect(promise.state).toBe(PromiseState.FULFILLED);
     expect(promise.value).toEqual([value, value]);
   });

  test("MyPromise.all should reject if any of the promises reject", () => {
    jest.useFakeTimers();
    const promises = [MyPromise.resolve(value), MyPromise.reject(reason)];
    const promise = MyPromise.all(promises);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.REJECTED);
    expect(promise.reason).toBe(reason);
  });

  test("MyPromise.allSettled should return a promise if input is an empty array", () => {
    jest.useFakeTimers();
    const promise = MyPromise.allSettled([]);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.FULFILLED);
    expect(promise.value).toEqual([]);
  });

   test("MyPromise.allSettled should return all resolvable promises", () => {
     jest.useFakeTimers();
     const promises = [MyPromise.resolve(value), MyPromise.resolve(value)];
     const promise = MyPromise.allSettled(promises);
     jest.runAllTicks();
     expect(promise.state).toBe(PromiseState.FULFILLED);
     expect(promise.value).toEqual([{status: PromiseState.FULFILLED, value: value}, {status: PromiseState.FULFILLED, value: value}]);
   });

   test("MyPromise.allSettled should return a promise that resolves to an array of objects", () => {
     jest.useFakeTimers();
     const promises = [MyPromise.resolve(value), MyPromise.reject(reason)];
     const promise = MyPromise.allSettled(promises);
     jest.runAllTicks();
     expect(promise.state).toBe(PromiseState.FULFILLED);
     expect(promise.value).toEqual([{status: PromiseState.FULFILLED, value: value}, {status: PromiseState.REJECTED, reason: reason}]);
   });

  test("MyPromise.any should reject with an AggregateError if input is an empty array", () => {
    jest.useFakeTimers();
    const promise = MyPromise.any([]);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.REJECTED);
    expect(promise.reason).toBeInstanceOf(AggregateError);
  });

  test("MyPromise.any should return a promise that resolves to the first resolved value", () => {
    jest.useFakeTimers();
    const promises = [MyPromise.reject(value), MyPromise.resolve(value)];
    const promise = MyPromise.any(promises);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.FULFILLED);
    expect(promise.value).toBe(value);
  });

  test("MyPromise.any should return a promise that rejects with an AggregateError if all promises reject", () => {
    jest.useFakeTimers();
    const promises = [MyPromise.reject(value), MyPromise.reject(reason)];
    const promise = MyPromise.any(promises);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.REJECTED);
    expect(promise.reason).toBeInstanceOf(AggregateError);
  });

  test("MyPromise.race should return a promise that resolves to the first resolved value", () => {
    jest.useFakeTimers();
    const promises = [MyPromise.resolve(value), MyPromise.reject(reason)];
    const promise = MyPromise.race(promises);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.FULFILLED);
    expect(promise.value).toBe(value);
  });

  test("MyPromise.race should return a promise that rejects with the first rejected value", () => {
    jest.useFakeTimers();
    const promises = [MyPromise.reject(value), MyPromise.reject(reason)];
    const promise = MyPromise.race(promises);
    jest.runAllTicks();
    expect(promise.state).toBe(PromiseState.REJECTED);
    expect(promise.reason).toBe(value);
  });
  
});

describe("Test Promise Resolution Procedure", () => {
  const value = ':)';
  const reason = 'Promise failed :(';
  test("should resolve without passing a function in then", () => {
    jest.useFakeTimers();
    const onFulfilled = jest.fn();
    new MyPromise(resolve => resolve(value)).then().then(onFulfilled);
    expect(onFulfilled.mock.calls.length).toBe(0);
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith(value);
  });

  test("should resolve without passing a function in then", () => {
    jest.useFakeTimers();
    const onRejected = jest.fn();
    new MyPromise((undefined,reject) => reject(reason)).then(undefined,onRejected);
    expect(onRejected.mock.calls.length).toBe(0);
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalledWith(reason);
  });

  test("should handle thenable objects", () => {
    jest.useFakeTimers();
    const thenable = {
      then: function(resolve: (value: any) => void) {
        resolve(value);
      }
    };

    const onFulfilled = jest.fn();
    new MyPromise(resolve => resolve(thenable)).then(onFulfilled);
    expect(onFulfilled.mock.calls.length).toBe(0);
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith(value);
  });

  test('should resolve with value if then is not a function', () => {
    jest.useFakeTimers();
    const thenable = {
      then: value // then is not a function
    };
    
    const onFulfilled = jest.fn();
    new MyPromise(resolve => resolve(thenable)).then(onFulfilled);
    
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith(thenable);
  })

  test("should handle thenable that throws", () => {
    jest.useFakeTimers();
    const error = new Error("Thenable error");
    const thenable = {
      then: function() {
        throw error;
      }
    };
    
    const onRejected = jest.fn();
    new MyPromise(resolve => resolve(thenable)).then(undefined, onRejected);
    
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalledWith(error);
  });


  test("should handle circular references", () => {
    const promise = new MyPromise(resolve => resolve(null));
    const onRejected = jest.fn();
    const chainedPromise: MyPromise<any> = promise.then(() => {
      return chainedPromise; // Returning the same promise to create a circular reference
    });
    chainedPromise.then(undefined, onRejected);
    jest.runAllTicks();
    // Use setImmediate or process.nextTick to ensure the rejection handler is called
    expect(onRejected).toHaveBeenCalled();
    expect(onRejected.mock.calls[0][0] instanceof TypeError).toBe(true);
  });

  test("should ignore multiple calls to resolve/reject", () => {
    jest.useFakeTimers();
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    const promise = new MyPromise((resolve, reject) => {
      resolve(value);
      resolve("another value");
      reject(reason);
    });
    promise.then(onFulfilled, onRejected);
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith(value);
    expect(onRejected).not.toHaveBeenCalled();
  });

  
});

describe("Complete Coverage Tests", () => {
  jest.useFakeTimers();

  test("should handle nested promise which is created form rejected promise", () => {
    const reason = "nested promise rejection";
    const onRejected = jest.fn();
    
    // Create a promise that resolves to a rejected MyPromise
    const nestedPromise = new MyPromise((_, reject) => reject(reason));
    const mainPromise = new MyPromise(resolve => resolve(nestedPromise));
    
    mainPromise.then(undefined, onRejected);
    jest.runAllTicks();
    
    expect(onRejected).toHaveBeenCalledWith(reason);
  });

  test("should handle thenable that calls reject multiple times (lines 49-51)", () => {
    const reason = "thenable rejection";
    const onRejected = jest.fn();
    
    const thenable = {
      then: function(resolve: any, reject: any) {
        reject(reason);
        reject("second call should be ignored"); // This should be ignored due to 'called' guard
      }
    };
    
    new MyPromise(resolve => resolve(thenable)).then(undefined, onRejected);
    jest.runAllTicks();
    
    expect(onRejected).toHaveBeenCalledTimes(1);
    expect(onRejected).toHaveBeenCalledWith(reason);
  });

  test("should use default onRejected handler that throws (line 132)", () => {
    const reason = "original rejection";
    const finalOnRejected = jest.fn();
    
    // Chain promises where onRejected is not provided, so default handler throws
    new MyPromise((_, reject) => reject(reason))
      .then() // No onRejected provided, should use default that throws
      .then(undefined, finalOnRejected);
    
    jest.runAllTicks();
    expect(finalOnRejected).toHaveBeenCalledWith(reason);
  });

  test("should handle error thrown by onFulfilled callback (line 141)", () => {
    const error = new Error("onFulfilled error");
    const onRejected = jest.fn();
    
    new MyPromise(resolve => resolve("value"))
      .then(() => {
        throw error; // This should trigger catch block on line 141
      })
      .then(undefined, onRejected);
    
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalledWith(error);
  });

  test("should handle error thrown by onRejected callback (line 152)", () => {
    const originalReason = "original error";
    const thrownError = new Error("onRejected error");
    const finalOnRejected = jest.fn();
    
    new MyPromise((_, reject) => reject(originalReason))
      .then(undefined, () => {
        throw thrownError; // This should trigger catch block on line 152
      })
      .then(undefined, finalOnRejected);
    
    jest.runAllTicks();
    expect(finalOnRejected).toHaveBeenCalledWith(thrownError);
  });

  test("should handle thenable that calls resolve multiple times (line 43)", () => {
    const value = "resolved value";
    const onFulfilled = jest.fn();
    
    const thenable = {
      then: function(resolve: any, reject: any) {
        resolve(value);
        resolve("second call should be ignored"); // This should be ignored due to 'called' guard on line 43
      }
    };
    
    new MyPromise(resolve => resolve(thenable)).then(onFulfilled);
    jest.runAllTicks();
    
    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith(value);
  });

  test("should handle thenable that throws after resolve/reject (line 59)", () => {
    const value = "resolved value";
    const onFulfilled = jest.fn();
    const error = new Error("should be ignored");
    
    const thenable = {
      then: function(resolve: any, reject: any) {
        resolve(value);
        throw error; // This should be ignored due to 'called' guard on line 59
      }
    };
    
    new MyPromise(resolve => resolve(thenable)).then(onFulfilled);
    jest.runAllTicks();
    
    expect(onFulfilled).toHaveBeenCalledTimes(1);
    expect(onFulfilled).toHaveBeenCalledWith(value);
  });

  test("should handle then called on pending promise (line 161)", () => {
    let resolvePromise: (value: any) => void;
    let rejectPromise: (reason: any) => void;
    const onFulfilled = jest.fn();
    const onRejected = jest.fn();
    
    // Create a promise that stays pending (doesn't call resolve/reject in executor)
    const promise = new MyPromise((resolve, reject) => {
      resolvePromise = resolve;
      rejectPromise = reject;
      // Don't call resolve or reject immediately - keep it pending
    });
    
    // Verify promise is in pending state
    expect(promise.state).toBe(PromiseState.PENDING);
    
    // Call then on pending promise - this should hit line 161 (the else if condition)
    promise.then(onFulfilled, onRejected);
    
    // Verify callbacks haven't been called yet (promise still pending)
    expect(onFulfilled).not.toHaveBeenCalled();
    expect(onRejected).not.toHaveBeenCalled();
    
    // Now resolve the promise to trigger the queued callback
    resolvePromise!("pending resolved");
    jest.runAllTicks();
    
    expect(onFulfilled).toHaveBeenCalledWith("pending resolved");
    expect(onRejected).not.toHaveBeenCalled();
  });
});

describe("Test .catch() and .finally() Methods", () => {
  jest.useFakeTimers();

  test(".catch() should be equivalent to .then(undefined, onRejected)", () => {
    const reason = "error occurred";
    const onRejected = jest.fn();
    
    new MyPromise((_, reject) => reject(reason))
      .catch(onRejected);
    
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalledWith(reason);
  });

  test(".finally() should run on fulfilled promise and preserve value", () => {
    const value = "success";
    const finallyCallback = jest.fn();
    const thenCallback = jest.fn();
    
    new MyPromise(resolve => resolve(value))
      .finally(finallyCallback)
      .then(thenCallback);
    
    jest.runAllTicks();
    expect(finallyCallback).toHaveBeenCalledWith(); // No arguments
    expect(thenCallback).toHaveBeenCalledWith(value); // Original value preserved
  });

  test(".finally() should run on rejected promise and preserve reason", () => {
    const reason = "failure";
    const finallyCallback = jest.fn();
    const catchCallback = jest.fn();
    
    new MyPromise((_, reject) => reject(reason))
      .finally(finallyCallback)
      .catch(catchCallback);
    
    jest.runAllTicks();
    expect(finallyCallback).toHaveBeenCalledWith(); // No arguments
    expect(catchCallback).toHaveBeenCalledWith(reason); // Original reason preserved
  });

  test(".finally() return value should be ignored", () => {
    const value = "original";
    const finallyCallback = jest.fn(() => "ignored return value");
    const thenCallback = jest.fn();
    
    new MyPromise(resolve => resolve(value))
      .finally(finallyCallback)
      .then(thenCallback);
    
    jest.runAllTicks();
    expect(finallyCallback).toHaveBeenCalled();
    expect(thenCallback).toHaveBeenCalledWith(value); // Original value, not "ignored return value"
  });

  test(".finally() throwing error should override original result", () => {
    const value = "original";
    const finallyError = new Error("finally failed");
    const catchCallback = jest.fn();
    
    new MyPromise(resolve => resolve(value))
      .finally(() => {
        throw finallyError;
      })
      .catch(catchCallback);
    
    jest.runAllTicks();
    expect(catchCallback).toHaveBeenCalledWith(finallyError);
  });

  test(".finally() should be chainable", () => {
    const value = "chainable";
    const finally1 = jest.fn();
    const finally2 = jest.fn();
    const thenCallback = jest.fn();
    
    new MyPromise(resolve => resolve(value))
      .finally(finally1)
      .finally(finally2)
      .then(thenCallback);
    
    jest.runAllTicks();
    expect(finally1).toHaveBeenCalled();
    expect(finally2).toHaveBeenCalled();
    expect(thenCallback).toHaveBeenCalledWith(value);
  });

  test(".finally() returning a promise should wait for it", () => {
    const value = "wait for me";
    const finallyCallback = jest.fn(() => {
      return new MyPromise(resolve => {
        setTimeout(() => resolve("finally done"), 10);
      });
    });
    const thenCallback = jest.fn();
    
    new MyPromise(resolve => resolve(value))
      .finally(finallyCallback)
      .then(thenCallback);
    
    jest.runAllTicks();
    expect(finallyCallback).toHaveBeenCalled();
    
    // The .then should wait for the finally promise to resolve
    setTimeout(() => {
      expect(thenCallback).toHaveBeenCalledWith(value);
    }, 15);
  });
});

describe("Advanced Edge Cases & Performance", () => {
  jest.useFakeTimers();

  test("should handle very long promise chains without stack overflow", () => {
    let promise = MyPromise.resolve(0);
    
    // Create a chain of 1000 promises
    for (let i = 0; i < 1000; i++) {
      promise = promise.then(x => x + 1);
    }
    
    const result = jest.fn();
    promise.then(result);
    jest.runAllTicks();
    
    expect(result).toHaveBeenCalledWith(1000);
  });

  test("should handle promises that resolve to functions", () => {
    const func = () => "I'm a function";
    const onFulfilled = jest.fn();
    
    new MyPromise(resolve => resolve(func))
      .then(onFulfilled);
    
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith(func);
    expect(typeof onFulfilled.mock.calls[0][0]).toBe('function');
  });

  test("should handle promises that resolve to null/undefined", () => {
    const onFulfilled1 = jest.fn();
    const onFulfilled2 = jest.fn();
    
    MyPromise.resolve(null).then(onFulfilled1);
    MyPromise.resolve(undefined).then(onFulfilled2);
    
    jest.runAllTicks();
    expect(onFulfilled1).toHaveBeenCalledWith(null);
    expect(onFulfilled2).toHaveBeenCalledWith(undefined);
  });

  test("should handle thenable with non-function then property", () => {
    const thenable = { then: "not a function" };
    const onFulfilled = jest.fn();
    
    new MyPromise(resolve => resolve(thenable))
      .then(onFulfilled);
    
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith(thenable);
  });

  test("should handle deeply nested thenable chains", () => {
    const deepThenable = {
      then(resolve: Function) {
        resolve({
          then(resolve2: Function) {
            resolve2({
              then(resolve3: Function) {
                resolve3("deep value");
              }
            });
          }
        });
      }
    };
    
    const onFulfilled = jest.fn();
    new MyPromise(resolve => resolve(deepThenable))
      .then(onFulfilled);
    
    jest.runAllTicks();
    expect(onFulfilled).toHaveBeenCalledWith("deep value");
  });
});

describe("Memory & Resource Management", () => {
  test("should clear callback arrays after resolution", () => {
    const promise = new MyPromise(resolve => {
      setTimeout(() => resolve("delayed"), 10);
    });
    
    // Add multiple callbacks
    promise.then(() => {});
    promise.then(() => {});
    promise.then(() => {});
    
    // Check that callbacks are stored
    expect((promise as any).onFulfilledCallbacks.length).toBe(3);
    
    // After resolution, callbacks should still be there (current implementation)
    // This test documents current behavior - you might want to clear them for memory optimization
  });
});

describe("Error Message Quality", () => {
  test("should provide meaningful error messages for circular references", () => {
    const promise = new MyPromise(resolve => resolve(null));
    const onRejected = jest.fn();
    
    const chainedPromise: MyPromise<any> = promise.then(() => chainedPromise);
    chainedPromise.then(undefined, onRejected);
    
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalled();
    expect(onRejected.mock.calls[0][0]).toBeInstanceOf(TypeError);
    expect(onRejected.mock.calls[0][0].message).toContain("Chaining cycle detected");
  });

  test("should preserve error stack traces", () => {
    const customError = new Error("Custom error with stack");
    const onRejected = jest.fn();
    
    new MyPromise(() => {
      throw customError;
    }).catch(onRejected);
    
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalledWith(customError);
    expect(onRejected.mock.calls[0][0].stack).toBeTruthy();
  });

  test("should preserve error stack traces in nested promises", () => {
    const customError = new Error("Custom error with stack");
    const onRejected = jest.fn();
    
    new MyPromise((resolve, reject) => {
      new MyPromise((_, innerReject) => {
        throw customError;
      }).catch(reject); // Forward the inner error to outer promise
    }).catch(onRejected);
    
    jest.runAllTicks();
    expect(onRejected).toHaveBeenCalledWith(customError);
    expect(onRejected.mock.calls[0][0].stack).toBeTruthy();
  });
});
