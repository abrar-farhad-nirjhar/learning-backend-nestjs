import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthJwtOutput {
  @Field()
  jwt: string;
}
