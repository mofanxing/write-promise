class MyPromise {
  static PENDING = "pending";
  static FULFILLED = "fulfilled";
  static REJECTED = "rejected";
  constructor(callBack) {
    this.status = MyPromise.PENDING;
    this.value = null;
    try {
      callBack(this.reslove.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  reslove(value) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.FULFILLED;
      this.value = value;
    }
  }

  reject(reason) {
    if (this.status === MyPromise.PENDING) {
      this.status = MyPromise.REJECTED;
      this.value = reason;
    }
  }

  then(onFulfilled, onRejected) {
    if (typeof onFulfilled !== "function") {
      onFulfilled = () => {};
    }
    if (typeof onRejected !== "function") {
      onRejected = () => {};
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
  reslove("解决");
});
p.then((res) => {
  console.log(res);
});
setTimeout(() => {
    console.log('timeout')
})

console.log("执行完成");
