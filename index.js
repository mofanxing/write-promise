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
}

