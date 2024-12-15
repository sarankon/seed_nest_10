export class ResponseBody {
    statusCode!: number
    message!: Status
    data!: unknown

    constructor(statusCode, data) {
        this.statusCode = statusCode
        this.data = data

        if(this.statusCode == 200) {
            this.message = Status.success
        }
    }
}

enum Status {
    success = 'success',
}