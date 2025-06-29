export class CreateUserDto {
    // Base
    id?: number

    // User
    uuid?: string
    username?: string
    password?: string

    // Basic Profile
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
}
