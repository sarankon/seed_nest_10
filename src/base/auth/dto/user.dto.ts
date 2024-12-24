import { Role } from "../role/role.enum"

export class UserDto {
    uuid!: number
    username!: string
    firstName!: string
    lastName!: string
    email!: string
    roles!: Role[]
}
