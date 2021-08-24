import { BadRequestException, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Mutation,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Comment } from 'src/comment/comment.entity';
import { Like } from 'src/like/like.entity';
import { User } from 'src/user/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Resolver((of) => Post)
export class PostResolver {
  constructor(private postService: PostService) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  unPublishedPosts(@CurrentUser() user,): Promise<Post[]> {
    return this.postService.findAllUnpublished(user.id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post)
  post(@Args('id') id: number): Promise<Post> {
    return this.postService.findOne(id);
  }

  @ResolveField(() => User)
  author(@Parent() post: Post): Promise<User> {
    return this.postService.getUser(post.authorId);
  }
  @ResolveField(() => [Like])
  likes(@Parent() post: Post): Promise<Like[]> {
    return this.postService.getLikes(post.id);
  }
  @ResolveField(() => [Comment])
  comments(@Parent() post: Post): Promise<Comment[]> {
    return this.postService.getComments(post.id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  createPost(
    @CurrentUser() user,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    createPostInput.authorId = user.id;
    return this.postService.createPost(createPostInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async publishPost(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<Post> {
    const post = await this.postService.findOne(id);
    if (user.isAdmin || post.authorId !== user.id) {
      throw new BadRequestException('Only Admin or author can publish a post.');
    }
    return this.postService.publishPost(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async unPublishPost(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<Post> {
    const post = await this.postService.findOne(id);
    if (user.isAdmin || post.authorId !== user.id) {
      throw new BadRequestException(
        'Only Admin or author can unpublish a post.',
      );
    }

    return this.postService.unPublishPost(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async updatePost(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('content') content: string,
  ): Promise<Post> {
    const post = await this.postService.findOne(id);
    if (post.authorId !== user.id) {
      throw new BadRequestException('Only author can update a post.');
    }

    return this.postService.updatePost(id, content);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => String)
  async removePost(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<String> {
    const post = await this.postService.findOne(id);
    if (post.authorId !== user.id) {
      throw new BadRequestException('Only author can remove a post.');
    }
    await this.postService.deletePost(id);

    return 'Post has been removed';
  }
}
