/**
 * Promise
 * tsc --watch ./index.ts
 * */
var PromiseState;
(function (PromiseState) {
    PromiseState["PENDING"] = "pending";
    PromiseState["FULFILLED"] = "fulfilled";
    PromiseState["REJECTED"] = "rejected";
})(PromiseState || (PromiseState = {}));
function isFunction(fn) {
    return fn && typeof fn === "function";
}
// 把 promise.value 放入 valueArr中，且改变需返回 promise 的状态
function isPromise(promise) {
    if ((typeof promise === "object" && promise !== null) ||
        typeof promise === "function") {
        return typeof promise.then === "function";
    }
    return false;
}
// 判断value有没有迭代器
function isIterable(value) {
    if (value !== null &&
        value !== undefined &&
        typeof value[Symbol.iterator] === "function") {
        return true;
    }
    return false;
}

// 导出 MyPromise 供其他模块使用
export var MyPromise = (function () {
    function MyPromise(executor, from) {
        console.log('-----------构造调用 from = ' + from)
        var _this = this;
        this.from = from;
        this.state = PromiseState.PENDING;
        this.value = undefined;
        this.reason = undefined;
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        var resolve = function (value) {
            if (_this.state === PromiseState.PENDING) {
                console.log('000000000000 from = ' + from + ' callback_size = ' + _this.onFulfilledCallbacks.length)
                _this.state = PromiseState.FULFILLED;
                _this.value = value;
                _this.onFulfilledCallbacks.forEach(function (fn) {
                    console.log('000000000000 call resolve from = ' + from)
                    return fn();
                });
            } else {
                    console.log('000000000000 屏蔽 resolve from = ' + from)
            }
        };
        var reject = function (reason) {
            if (_this.state === PromiseState.PENDING) {
                _this.state = PromiseState.REJECTED;
                _this.reason = reason;
                _this.onRejectedCallbacks.forEach(function (fn) {
                    console.log('000000000000 call reject from = ' + from)
                    return fn();
                });
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    }
    MyPromise.prototype.then = function (onFulfilled, onRejected, from) {
        // 链式操作核心
        var _this = this;
        onFulfilled = isFunction(onFulfilled) ? onFulfilled : function (data) { return data; };
        onRejected = isFunction(onRejected)
            ? onRejected
            : function (err) {
                throw err;
            };
        var promiseInst = new MyPromise(function (resolve, reject) {
            var res;
            if (_this.state === "fulfilled") {
                console.log('3333333333333 fulfilled from = ' + from);
                queueMicrotask(function () {
                    try {
                        res = onFulfilled(_this.value);
                        resolvePromise(promiseInst, res, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            if (_this.state === "rejected") {
                console.log('3333333333333 rejected from = ' + from);
                queueMicrotask(function () {
                    try {
                        res = onRejected(_this.reason);
                        resolvePromise(promiseInst, res, resolve, reject);
                    }
                    catch (err) {
                        reject(err);
                    }
                });
            }
            if (_this.state === "pending") {
                console.log('3333333333333 push from = ' + from);
                // 处理异步回调
                // 代理/修饰器思想
                _this.onFulfilledCallbacks.push(function () {
                    queueMicrotask(function () {
                        try {
                            console.log('4444444444444 onFulfilled from = ' + from + ' state = ' + _this.state);
                            res = onFulfilled(_this.value);
                            resolvePromise(promiseInst, res, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    });
                });
                _this.onRejectedCallbacks.push(function () {
                    queueMicrotask(function () {
                        try {
                            console.log('4444444444444 onRejected from = ' + from + ' state = ' + _this.state);
                            res = onRejected(_this.reason);
                            resolvePromise(promiseInst, res, resolve, reject);
                        }
                        catch (err) {
                            reject(err);
                        }
                    });
                });
            }
        }, from + ' in_then');
        return promiseInst;
    };
    /* then的语法糖 */
    MyPromise.prototype.catch = function (errCallBack) {
        return this.then(null, errCallBack);
    };
    /**
     * 在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。
     * 这为在 Promise是否成功完成后都需要执行的代码提供了一种方式。
     * finally 不会获取前一个promise的状态或值，而是将promise传给下个then,
     * finally 没有返回值
     */
    MyPromise.prototype.finally = function (finallyCB) {
        return this.then(function (value) {
            return MyPromise.resolve(finallyCB()).then(function () { return value; });
        }, function (reason) {
            return MyPromise.resolve(finallyCB()).then(function () {
                throw reason;
            });
        });
    };
    // MyPromise.resolve = function (value) {
    //     return new MyPromise(function (resolve) {
    //         resolve(value);
    //     });
    // };
    // MyPromise.reject = function (reason) {
    //     return new MyPromise(function (_, reject) {
    //         reject(reason);
    //     });
    // };
    MyPromise.all = function (promiseArr) {
        if (!isIterable(promiseArr)) {
            // 传入的promiseArr有没有迭代器
            throw new TypeError("object ".concat(promiseArr, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
        }
        var valueArr = [];
        var len = promiseArr.length;
        var storedValueNum = 0;
        if (len === 0) {
            return MyPromise.resolve([]);
        }
        return new MyPromise(function (resolve, reject) {
            promiseArr.forEach(function (promise, idx) {
                if (isPromise(promise)) {
                    promise.then(function (val) {
                        putInValueArr(val, idx, resolve);
                    }, reject /* reject直接转成失败态 */);
                }
                else {
                    putInValueArr(promise, idx, resolve);
                }
            });
            function putInValueArr(val, idx, resolve) {
                valueArr[idx] = val;
                if (++storedValueNum === len) {
                    resolve(valueArr);
                }
            }
        });
    };
    MyPromise.allSettled = function (promiseArr) {
        if (!isIterable(promiseArr)) {
            throw new TypeError("object ".concat(promiseArr, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
        }
        var valueArr = [];
        var len = promiseArr.length;
        var storedValueNum = 0;
        if (len === 0) {
            return MyPromise.resolve([]);
        }
        return new MyPromise(function (resolve) {
            promiseArr.forEach(function (promise, idx) {
                if (isPromise(promise)) {
                    promise.then(function (value) {
                        putInValueArr(PromiseState.FULFILLED, value, idx, resolve);
                    }, function (reason) {
                        putInValueArr(PromiseState.REJECTED, reason, idx, resolve);
                    });
                }
                else {
                    putInValueArr(PromiseState.FULFILLED, promise, idx, resolve);
                }
            });
        });
        function putInValueArr(status, value, idx, resolve) {
            switch (status) {
                case PromiseState.FULFILLED: {
                    valueArr[idx] = {
                        status: status,
                        value: value,
                    };
                }
                case PromiseState.REJECTED:
                    {
                        valueArr[idx] = {
                            status: status,
                            reason: value,
                        };
                    }
                    break;
            }
            if (++storedValueNum === len) {
                resolve(valueArr);
            }
        }
    };
    MyPromise.race = function (promiseArr) {
        if (!isIterable(promiseArr)) {
            // 判断是否可迭代
            throw new TypeError("object ".concat(promiseArr, " is not iterable (cannot read property Symbol(Symbol.iterator))"));
        }
        if (promiseArr.length === 0) {
            // 当参数为空数组时
            return MyPromise.resolve([]);
        }

        return new MyPromise(function (resolve, reject) {
            promiseArr.forEach(function (promise) {
                if (isPromise(promise)) {
                    promise.then(function (value) {
                        resolve(value);
                    }, function (reason) {
                        reject(reason);
                    }, promise.from + '_race use_then');
                }
                else {
                    resolve(promise);
                }
            });
        }, 'race');
    };
    return MyPromise;
}());
/**
 * 解决promise返回值为Promise实例问题
 */
function resolvePromise(promiseInst, res, resolve, reject) {
    var called = false;
    if (promiseInst === res) {
        return reject(new TypeError("objectErr"));
    }
    if ((typeof res === "object" && res !== null) || typeof res === "function") {
        try {
            var then = res.then;
            if (typeof then === "function") {
                /* 判断是否为promise对象实例 */
                then.call(res, function (val) {
                    if (called) {
                        return;
                    }
                    called = true;
                    // val 也有可能是promise
                    resolvePromise(promiseInst, val, resolve, reject);
                }, function (err) {
                    if (called) {
                        return;
                    }
                    called = true;
                    reject(err);
                });
            }
            else {
                if (called) {
                    return;
                }
                called = true;
                resolve(res /* 普通对象 */);
            }
        }
        catch (err) {
            if (called) {
                return;
            }
            called = true;
            reject(err);
        }
    }
    else {
        resolve(res);
    }
}


Promise.observe = function (pr, cb) {
    // 观察pr的决议
    pr.then(
        function fulfilled(msg) {
            // 安排异步回调（作为Job）
            Promise.resolve(msg).then(cb);
        },
        function rejected(err) {
            // 安排异步回调（作为Job）
            Promise.resolve(err).then(cb);
        }
    );
    // 返回最初的promise
    return pr;
};

function timeoutPromise(delay) {
    return new MyPromise(function (resolve, reject) {
        setTimeout(function () {
            resolve("Timeout!");
        }, delay);
    }, 'bbb');
}

// 测试代码包装在函数中，避免导入时自动执行
export function runTests() {
    const timestamp = Date.now();
    MyPromise.race([
        // Promise.observe(
        //     timeoutPromise(10000), // 试着运行foo()
        //     function cleanup(msg) {
        //         console.log(msg + '777777777777777777777 = ' + (Date.now() - timestamp));
        //         // 在foo()之后清理，即使它没有在超时之前完成
        //     }
        // ),
        new MyPromise(function (resolve, reject) {
            setTimeout(() => {
                console.log('777777777777777777777 = ' + (Date.now() - timestamp));
                resolve('hello world')
            }, 5000)
        }, 'aaa'),
        timeoutPromise(1000) // 给它3秒钟
    ]).then((v) => {
        console.log('vvvvvvvvv = ' + v)
    }, null, 'ccc')
}

