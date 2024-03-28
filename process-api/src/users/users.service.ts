import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';

// This should be a real class/interface representing a user entity
export type User = any;

const usersPath = './tables/db_users.json';

@Injectable()
export class UsersService {
  async findOne(username: string): Promise<User | undefined> {
    try {
      const buffer = fs.readFileSync(usersPath, 'utf-8');
      const obj = JSON.parse(buffer);

      return obj.users?.find((user) => user.username === username);
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async findOrganizations(): Promise<User[] | undefined> {
    if (!fs.existsSync(usersPath)) {
      throw new InternalServerErrorException(`No users table exists.`);
    }

    try {
      const buffer = fs.readFileSync(usersPath, 'utf-8');
      const obj = JSON.parse(buffer);

      return obj.users
        ?.filter((user) => user.role === 'organization')
        .map((user) => ({
          username: user.username,
          userId: user.userId,
        }));
    } catch (e) {
      console.error(e);
      return;
    }
  }

  async pushOne(
    username: string,
    password: string,
    role: string,
    selected_organization?: string,
  ): Promise<string | HttpException> {
    if (!fs.existsSync(usersPath)) {
      throw new InternalServerErrorException(`No users table exists.`);
    }

    try {
      const buffer = fs.readFileSync(usersPath, 'utf-8');
      const obj = JSON.parse(buffer);

      // check for users with the same username

      const userWithSameUsername = obj.users.find(
        (user) => user.username === username,
      );

      if (userWithSameUsername) {
        return new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            error: `There already exists a user with username: ${username}, please enter something else.`,
          },
          HttpStatus.CONFLICT,
        );
      }

      // insert new user

      const userId = crypto.randomUUID();

      obj.users.push({
        username,
        password,
        userId,
        role,
        selected_organization,
      });

      fs.writeFileSync(usersPath, JSON.stringify(obj));

      console.log('User successfully added!');

      return userId;
    } catch (e) {
      console.error(e);
      return;
    }
  }
}
