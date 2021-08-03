import {
  Resolver,
  Query,
  Args,
  Mutation,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Resolver((of) => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  posts(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @Query(() => Post)
  post(@Args('id') id: number): Promise<Post> {
    return this.postService.findOne(id);
  }

  @ResolveField(() => User)
  author(@Parent() post: Post): Promise<User> {
    return this.postService.getUser(post.authorId);
  }

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    return this.postService.createPost(createPostInput);
  }
}
