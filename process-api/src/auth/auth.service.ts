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
          message: 'No username provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user?.password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No password provided',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { username: user.username, sub: user.userId };

    const userFound = await this.usersService.findOne(user.username);

    if (!userFound) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'No user with such credentials exists! Please provide valid username and password!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user?.password !== userFound?.password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: `Wrong password for ${userFound?.username}. Please try again!`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const role = userFound?.role;

    if (!role) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'User has no role attached! Please contact your administrator!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const userId = userFound?.userId;

    if (!userId) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User has no userId! Please contact your administrator!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const selected_organization = userFound?.selected_organization;

    return {
      access_token: this.jwtService.sign(payload),
      role,
      selected_organization,
      userId,
    };
  }

  async register(user: any) {
    console.log(user);
    if (!user?.username) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No username provided!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!user?.password) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'No password provided!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user?.role) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'No role provided!',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (user.role === 'regular_user' && !user.selected_organization) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message:
            'A regular user has to have an organization attached to him/her!',
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
