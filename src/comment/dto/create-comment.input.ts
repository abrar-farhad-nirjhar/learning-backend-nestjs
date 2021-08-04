import { InputType, Int, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field()
  content: string;
  authorId?: number;
  @Field(() => ID)
  postId: number;
}
