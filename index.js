class MyPromise {
    static PENDING = 'pending'
    static FULFILLED = 'fulfilled'
    static REJECTED = 'rejected'
    constructor(callBack) {
        this.status = MyPromise.PENDING
        this.value = null
        try {
            callBack(this.reslove.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }

    reslove(value) {
        if(this.status === MyPromise.PENDING) {
            this.status = MyPromise.FULFILLED
            this.value = value
        }
       
    }

    reject(reason) {
        if(this.status === MyPromise.PENDING) {
            this.status = MyPromise.REJECTED
            this.value = reason
        }
        
    }

    then(onFulfilled, onRejected) {
        if(typeof onFulfilled !== 'function') {
            onFulfilled = () => {}
        }
        if(typeof onRejected !== 'function') {
            onRejected = () => {}
        }
        if(this.status === MyPromise.FULFILLED) {
            onFulfilled(this.value)
        }

        if(this.status === MyPromise.REJECTED) {
            onRejected(this.value)
        }
    }

}

