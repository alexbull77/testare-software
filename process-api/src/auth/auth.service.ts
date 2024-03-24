import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    if (!user?.username) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'No username provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    console.log(user);

    const payload = { username: user.username, sub: user.userId };

    const role = (await this.usersService.findOne(user.username)).role;
    const selected_organization = (
      await this.usersService.findOne(user.username)
    )?.selected_organization;

    const userId = (await this.usersService.findOne(user.username))?.userId;

    return {
      access_token: this.jwtService.sign(payload),
      role,
      selected_organization,
      userId,
    };
  }

  async register(user: any) {
    if (!user?.username) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'No username provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user?.password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'No password provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user?.role) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'No role provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.role === 'regular_user' && !user.selected_organization) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'A regular user has to have an organization attached to it.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = this.usersService.pushOne(
      user.username,
      user.password,
      user.role,
      user?.selected_organization,
    );
    return response;
  }

  async getAllOrganizations() {
    return await this.usersService.findOrganizations();
  }
}
