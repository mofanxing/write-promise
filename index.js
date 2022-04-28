class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(execute) {
    this.status = MyPromise.PENDING;
    this.value = null;
    this.callbacks = [];
    try {
      execute(this.reslove.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  reslove(value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.value = value;
      queueMicrotask(() => {
        this.callbacks.forEach((callback) => {
          callback.onFulfilled(value);
        });
      });
    }
  }

  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.value = reason;
      queueMicrotask(() => {
        this.callbacks.forEach((callback) => {
          callback.onRejected(reason);
        });
      });
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => this.value;
    }
    if (typeof onRejected !== "function") {
      onRejected = () => {throw this.value};
    }

    return new MyPromise((reslove, reject) => {
      if (this.status === MyPromise.PENDING) {
        this.callbacks.push({
          onFulfilled: (value) => {
            try {
              let result = onFulfilled(value);
              if(result instanceof MyPromise) {
                result.then(reslove,reject)
              }else {
                reslove(result)
              }
            } catch (error) {
              reject(error);
            }
          },
          onRejected: (value) => {
            try {
              let result = onRejected(value);
              if(result instanceof MyPromise) {
                result.then(reslove,reject)
              }else {
                reslove(result)
              }
            } catch (error) {
              reject(error);
            }
          },
        });
      }

      if (this.status === MyPromise.FULFILLED) {
        queueMicrotask(() => {
          try {
            let result = onFulfilled(this.value);
            reslove(result)
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === MyPromise.REJECTED) {
        queueMicrotask(() => {
          try {
            let result = onRejected(this.value);
            reslove(result)
          } catch (error) {
            reject(error);
          }
        });
      }
    });
  }
}
const p = new MyPromise((reslove, reject) => {
  setTimeout(() => {
    reslove('1111')
    console.log("sss");
  }, 1000);
});
p.then(
  (res) => {
    return new MyPromise((reslove, reject) => {
      setTimeout(() => {
        reslove('新的promise')
      },1000)
    })
  },
  (rej) => {
    console.log(rej);
    return 'a000'
  }
).then().then(res => {
  console.log(res,111)
},rej => {
  console.log(rej, '222rej')
})
setTimeout(() => {
  console.log("timeout");
});

console.log("执行完成");


// const m = new Promise((reslove, reject) => {
//   reslove(1)
// })
// m.then((res) => {
//   console.log(llll)
//   console.log(res, '111res')
// }).then().then((res) => {
//   console.log(res, 'res333')
// }, rej => {
//   console.log(rej, '333rej')
// }).then(res => {
//   console.log(res, '44res')
// },rej => {
//   console.log(rej, 'rej444')
// })
