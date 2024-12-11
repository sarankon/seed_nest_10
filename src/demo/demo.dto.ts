export class CreateDemoDto {
    email: string;
    password: string;
    roles: DemoRole[] = [];
    isEnabled?: boolean = true;
}

enum DemoRole {
    Admin = 'Admin',
    Moderator = 'Moderator',
    User = 'User',
}