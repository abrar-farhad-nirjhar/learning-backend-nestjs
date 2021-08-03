import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
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

  @Mutation(() => Post)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    return this.postService.createPost(createPostInput);
  }
}
