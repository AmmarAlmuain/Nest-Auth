import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ minlength: 3, maxlength: 15, required: true, unique: true })
  username: string;

  @Prop({ minlength: 6, maxlength: 256, required: true, unique: true })
  email: string;

  @Prop({ minlength: 8, maxlength: 32, required: true, unique: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
