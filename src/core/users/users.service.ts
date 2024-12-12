import { Injectable } from '@nestjs/common';
import { UserLogin } from './user-login.dto';


@Injectable()
export class UsersService {
    private readonly users = [
        {
          id: 1,
          username: 'user',
          password: 'pass',
        }
    ];

    async findOne(username: string): Promise<UserLogin | undefined> {
        return this.users.find(user => user.username === username);
    }
}



