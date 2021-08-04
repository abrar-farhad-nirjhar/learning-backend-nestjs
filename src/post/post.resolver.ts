import { UseGuards } from '@nestjs/common';
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
  constructor(private postService: PostService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return this.postService.findAll();
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
}
