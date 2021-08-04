import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver((of) => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @ResolveField(() => User)
  author(@Parent() comment: Comment): Promise<User> {
    return this.commentService.getAuthor(comment.authorId);
  }

  @ResolveField(() => Post)
  post(@Parent() comment: Comment): Promise<Post> {
    return this.commentService.getPost(comment.postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  async createComment(
    @CurrentUser() user,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    createCommentInput.authorId = user.id;
    const post = await this.commentService.getPost(createCommentInput.postId);

    if (!post.isPublished) {
      throw new BadRequestException('Post is not published.');
    }
    return this.commentService.create(createCommentInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Comment])
  comments() {
    return this.commentService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Comment)
  comment(@Args('id', { type: () => ID }) id: number) {
    return this.commentService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  async updateComment(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('content') content: string,
  ): Promise<Comment> {
    const comment = await this.commentService.findOne(id);
    if (comment.authorId !== user.id) {
      throw new BadRequestException('Only author can update a comment.');
    }

    return this.commentService.updateComment(id, content);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async removeComment(
    @CurrentUser() user,
    @Args('id', { type: () => ID }) id: number,
  ) {
    const comment = await this.commentService.findOne(id);
    const post = await this.commentService.getPost(comment.postId);
    if (post.authorId !== user.id) {
      throw new BadRequestException('Only the author can remove a comment.');
    }
    await this.commentService.removeComment(id);
    return 'Comment has been removed';
  }
}
