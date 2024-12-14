export class ResponseBody {
    code!: string
    status!: Status
    data!: unknown

    constructor(code, data) {
        this.code = code
        this.data = data

        if(this.code == "200") {
            this.status = Status.success
        } else {
            this.status = Status.error
        }
    }
}

enum Status {
    success = 'success',
    error = 'error'
}