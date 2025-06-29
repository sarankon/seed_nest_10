export class UserDto {
    uuid!: string
    username!: string
    firstName?: string
    lastName?: string
    email?: string
    roles?: Array<unknown>
    groups?: Array<unknown>
    organization?: unknown

    tokenUuid?: string
}
