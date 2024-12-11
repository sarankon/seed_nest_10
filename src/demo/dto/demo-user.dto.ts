export class CreateDemoUserDto {
    email: string;
    password: string;
    roles: UserRole[] = [];
    isEnabled?: boolean = true;
}

enum UserRole {
    Admin = 'Admin',
    Moderator = 'Moderator',
    User = 'User',
}