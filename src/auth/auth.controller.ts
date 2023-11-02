import { Controller, Post, Body, Res } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user';
import { Model } from 'mongoose';
import { UserDto } from 'src/dtos/user';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    @InjectModel(User.name) private UserModel: Model<any>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post('register')
  async register(
    @Body() userDto: UserDto,
    @Res() response: Response,
  ): Promise<any> {
    const { username, email, password } = userDto;
    if (!username || !email || !password) {
      return response.status(401).send('All fields required.');
    }
    try {
      const isUsernameUsed = await this.UserModel.findOne({ username }),
        isEmailUsed = await this.UserModel.findOne({ email });
      if (isUsernameUsed || isEmailUsed) {
        return response
          .status(409)
          .send(
            'User already exists. Please choose a different username or email!',
          );
      }
    } catch (error) {
      response.status(500).send('Somethun went wrong. Please try again later!');
    }
    try {
      const user = new this.UserModel(userDto);
      await user.save();
      return response.send(
        await this.jwtService.signAsync(
          { userId: user._id },
          { secret: this.configService.get<string>('JWT_SECRET') },
        ),
      );
    } catch (error) {
      response.status(500).send('Somethun went wrong. Please try again later!');
    }
  }

  @Post()
  async login(
    @Body() userDto: UserDto,
    @Res() response: Response,
  ): Promise<any> {
    const { email, password } = userDto;
    if (!email || !password) {
      return response
        .status(401)
        .send('Invalid credentials. Please enter a credentials!');
    }
    try {
      const user = await this.UserModel.findOne({ email });
      if (!user)
        return response
          .status(401)
          .send('Invalid credentials. Please enter a credentials!');
      const decryptPasword = await user.verifyPasswordSync(password);
      if (!decryptPasword)
        return response
          .status(401)
          .send('Invalid credentials. Please enter a credentials!');
      return response.send(
        await this.jwtService.signAsync(
          { userId: user._id },
          { secret: this.configService.get<string>('JWT_SECRET') },
        ),
      );
    } catch (error) {
      response.status(500).send('Somethun went wrong. Please try again later!');
    }
  }
}
