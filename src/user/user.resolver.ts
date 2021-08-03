import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { Like } from 'src/like/like.entity';
import { CreateUserInput } from './dto/create-user-input';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  user(@Args('id') id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @ResolveField(() => [Post])
  posts(@Parent() user: User): Promise<Post[]> {
    return this.userService.getPosts(user.id);
  }

  @ResolveField(() => [Like])
  likes(@Parent() user: User): Promise<Like[]> {
    return this.userService.getLikes(user.id);
  }

  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserInput);
  }
}
