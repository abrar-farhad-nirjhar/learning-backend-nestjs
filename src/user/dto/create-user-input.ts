import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @IsEmail()
  @Field()
  email: string;

  @Field()
  password: string;
}
