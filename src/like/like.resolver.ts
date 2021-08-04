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
import { LikeService } from './like.service';
import { Like } from './like.entity';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { User } from 'src/user/user.entity';
import { Post } from 'src/post/post.entity';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver((of) => Like)
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @ResolveField(() => User)
  user(@Parent() like: Like): Promise<User> {
    return this.likeService.getUser(like.userId);
  }

  @ResolveField(() => Post)
  post(@Parent() like: Like): Promise<Post> {
    return this.likeService.getPost(like.postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Like)
  async createLike(
    @CurrentUser() user,
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
  ): Promise<Like> {
    createLikeInput.userId = user.id;

    const post = await this.likeService.getPost(createLikeInput.postId);

    if (!post.isPublished) {
      throw new BadRequestException('Post is not published.');
    }

    return this.likeService.create(createLikeInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Like])
  likes() {
    return this.likeService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Like)
  like(@Args('id', { type: () => ID }) id: number) {
    return this.likeService.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async removeLike(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<String> {
    const like = await this.likeService.findOne(id);
    const post = await this.likeService.getPost(like.postId);
    if (post.authorId !== user.id) {
      throw new BadRequestException(
        'Only author of the post can remove a like',
      );
    }
    await this.likeService.removeLike(id);

    return 'Like has been removed';
  }
}
