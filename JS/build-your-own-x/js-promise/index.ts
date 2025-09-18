type Executor<T> = (
  resolve: (value: T) => void,
  reject: (reason?: any) => void
) => void;

// Simple AggregateError polyfill for environments that don't have it
class AggregateError extends Error {
  errors: any[];
  constructor(errors: any[], message: string) {
    super(message);
    this.name = 'AggregateError';
    this.errors = errors;
  }
}

const PromiseState = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
} as const;

type PromiseState = (typeof PromiseState)[keyof typeof PromiseState];

function resolvePromise(
  promise: MyPromise<any>,
  x: any,
  resolve: Function,
  reject: Function
): void {
  if (promise === x) {
    reject(new TypeError("Chaining cycle detected for promise"));
    return;
  }

  let called = false;

  if (x instanceof MyPromise) {
    x.then(
      (value: any) => resolvePromise(promise, value, resolve, reject),
      (reason: any) => reject(reason)
    );
    return;
  }

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (value: any) => {
            // Test to ensure `resolve` or `reject` is called only once
            if (called) return;
            called = true;
            resolvePromise(promise, value, resolve, reject);
          },
          (reason: any) => {
            // Test to ensure `resolve` or `reject` is called only once
            if (called) return;
            called = true;
            reject(reason);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      // Test to ensure `resolve` or `reject` is called only once
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

class MyPromise<T = any> {
  private _state: PromiseState = PromiseState.PENDING;
  private _value: T | null = null;
  private _reason: any = null;
  private readonly onFulfilledCallbacks: Array<Function> = [];
  private readonly onRejectedCallbacks: Array<Function> = [];

  constructor(executor: Executor<any>) {
    try {
      executor(this._resolve.bind(this), this._reject.bind(this));
    } catch (err) {
      this._reject(err);
    }
  }

  public get state(): PromiseState {
    return this._state;
  }

  public get value(): any {
    return this._value;
  }

  public get reason(): any {
    return this._reason;
  }

  _resolve<T>(value: any): void {
    if (this._state !== PromiseState.PENDING) return;

    // Use resolvePromise to unwrap thenables or nested promises
    resolvePromise(
      this,
      value,
      this._finalResolve.bind(this),
      this._reject.bind(this)
    );
  }

  private _finalResolve(value: T): void {
    this._state = PromiseState.FULFILLED;
    this._value = value;
    this.onFulfilledCallbacks.forEach((fn) =>
      queueMicrotask(() => fn(this._value))
    );
  }

  _reject(reason: any): void {
    if (this._state !== PromiseState.PENDING) return;
    this._state = PromiseState.REJECTED;
    this._reason = reason;
    this.onRejectedCallbacks.forEach((fn) =>
      queueMicrotask(() => fn(this._reason))
    );
  }

  then<U = T, V = never>(
    onFulfilled?: (value: T) => U | MyPromise<U>,
    onRejected?: (reason: any) => V | MyPromise<V>
  ): MyPromise<U | V> {
    // Ensure callbacks are functions, otherwise pass through
    const resolvedOnFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value: T) => value as any;
    const resolvedOnRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason: any) => {
            throw reason;
          };
    const promise2 = new MyPromise<U | V>((resolve, reject) => {
      const scheduleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = resolvedOnFulfilled(this.value as T);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      const scheduleRejected = () => {
        queueMicrotask(() => {
          try {
            const x = resolvedOnRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      };

      if (this.state === PromiseState.FULFILLED) {
        scheduleFulfilled();
      } else if (this.state === PromiseState.REJECTED) {
        scheduleRejected();
      } else {
        this.onFulfilledCallbacks.push(scheduleFulfilled);
        this.onRejectedCallbacks.push(scheduleRejected);
      }
    });

    return promise2;
  }

  static resolve<T>(value: T | MyPromise<T>): MyPromise<T> {
    if (value instanceof MyPromise) {
      return value;
    }
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason: any): MyPromise<any> {
    return new MyPromise((_, reject) => reject(reason));
  }

  // .catch() method - syntactic sugar for .then(undefined, onRejected)
  catch<U = never>(onRejected?: (reason: any) => U | MyPromise<U>): MyPromise<T | U> {
    return this.then(undefined, onRejected);
  }

  // .finally() method - runs regardless of promise outcome
  finally(onFinally?: ()=> void): MyPromise<T> {
    return this.then(
      // On fulfillment: run finally, then preserve original value
      (value: any) => {
        return MyPromise.resolve(onFinally?.()).then(() => value);
      },
      // On rejection: run finally, then preserve original reason
      (reason: any) => {
        return MyPromise.resolve(onFinally?.()).then(() => {
          throw reason;
        });
      }
    );
  }

  static all<T>(promises: Array<MyPromise<T> | T>): MyPromise<T[]> {
    if(promises.length === 0) {
      return MyPromise.resolve<T[]>([]);
    }
    return new MyPromise((resolve, reject) => {
      const results: T[] = new Array(promises.length);
      let completed = 0;
      for (let i = 0; i < promises.length; i++) {
        MyPromise.resolve(promises[i]).then((value: T) => {
          results[i] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        }).catch((reason: any) => {
          reject(reason);
        });
      }
    });
  }

  static allSettled<T>(promises: Array<MyPromise<T> | T>): MyPromise<Array<{status: string, value?: T, reason?: any}>> {
    if(promises.length === 0) {
      return MyPromise.resolve<Array<{status: string, value?: T, reason?: any}>>([]);
    }
    return new MyPromise((resolve) => {
      const results: Array<{status: string, value?: T, reason?: any}> = new Array(promises.length);
      let completed = 0;
      for (const [i, promise] of promises.entries()) {
        MyPromise.resolve(promise).then((value: T) => {
          results[i] = { status: PromiseState.FULFILLED, value };
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        }).catch((reason: any) => {
          results[i] = { status: PromiseState.REJECTED, reason };
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        });
      }
    });
  }


  static any<T>(promises: Array<MyPromise<T> | T>): MyPromise<T> {
    if(promises.length === 0) {
      return MyPromise.reject(new AggregateError([], "All promises were rejected"));
    }
    return new MyPromise((resolve, reject) => {
      const errors: any[] = new Array(promises.length);
      let rejected = 0;
      for (const [i, promise] of promises.entries()) {
        MyPromise.resolve(promise).then(resolve).catch((reason: any) => {
          errors[i] = reason;
          rejected++;
          if (rejected === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
      }
    });
  }

  static race<T>(promises: Array<MyPromise<T> | T>): MyPromise<T> {
    return new MyPromise((resolve, reject) => {
      for (const promise of promises) {
        MyPromise.resolve(promise).then(resolve).catch(reject);
      }
    });
  }
}
export { MyPromise, PromiseState, AggregateError };
