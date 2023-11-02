import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user';
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.plugin(require('mongoose-bcrypt'));
          return schema;
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [JwtService, ConfigService]
})
export class AuthModule {}
