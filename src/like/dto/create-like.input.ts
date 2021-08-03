import { InputType, ID, Field } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput {
  @Field(() => ID)
  userId: number;
  @Field(() => ID)
  postId: number;
}
