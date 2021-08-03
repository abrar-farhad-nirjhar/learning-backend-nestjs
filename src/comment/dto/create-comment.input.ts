import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  content: string;
  @Field(() => ID)
  authorId: number;
  @Field(() => ID)
  postId: number;
}
