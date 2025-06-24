export class ResponseBody {
    status!: number
    message!: Message
    data!: unknown

    constructor(status, data) {
        this.status = status
        this.data = data

        if (this.status == 200) {
            this.message = Message.success
        }
    }
}

enum Message {
    success = "success",
}
