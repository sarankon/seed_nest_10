export class CreateUserDto {
    // id?: string
    username!: string
    password!: string

    // Basic Profile
    firstName!: string
    lastName!: string
    email!: string
    phone?: string
}
