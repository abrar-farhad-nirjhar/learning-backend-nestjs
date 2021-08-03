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

  @Mutation(() => Like)
  createLike(
    @Args('createLikeInput') createLikeInput: CreateLikeInput,
  ): Promise<Like> {
    return this.likeService.create(createLikeInput);
  }

  @Query(() => [Like])
  likes() {
    return this.likeService.findAll();
  }

  @Query(() => Like)
  like(@Args('id', { type: () => ID }) id: number) {
    return this.likeService.findOne(id);
  }

  // @Mutation(() => Like)
  // updateLike(@Args('updateLikeInput') updateLikeInput: UpdateLikeInput) {
  //   return this.likeService.update(updateLikeInput.id, updateLikeInput);
  // }

  // @Mutation(() => Like)
  // removeLike(@Args('id', { type: () => Int }) id: number) {
  //   return this.likeService.remove(id);
  // }
}
