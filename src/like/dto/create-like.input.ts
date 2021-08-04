import { InputType, ID, Field } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput {
  userId?: number;
  @Field(() => ID)
  postId: number;
}
