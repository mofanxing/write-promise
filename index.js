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
      onFulfilled = () => {};
    }
    if (typeof onRejected !== "function") {
      onRejected = () => {};
    }

    if (this.status === MyPromise.PENDING) {
      this.callbacks.push({
        onFulfilled: (value) => {
          try {
            onFulfilled(value);
          } catch (error) {
            onRejected(error);
          }
        },
        onRejected: (value) => {
          try {
            onRejected(value);
          } catch (error) {
            onRejected(error);
          }
        },
      });
    }

    if (this.status === MyPromise.FULFILLED) {
      queueMicrotask(() => {
        try {
          onFulfilled(this.value);
        } catch (error) {
          onRejected(error);
        }
      });
    }

    if (this.status === MyPromise.REJECTED) {
      queueMicrotask(() => {
        try {
          onRejected(this.value);
        } catch (error) {
          onRejected(error);
        }
      });
    }
  }
}
const p = new MyPromise((reslove, reject) => {
  setTimeout(() => {
    reject("拒绝");
    console.log('sss')
  }, 1000);
});
p.then(
  (res) => {
    console.log(res);
  },
  (rej) => {
    console.log(rej);
  }
);

setTimeout(() => {
  console.log("timeout");
});

console.log("执行完成");
