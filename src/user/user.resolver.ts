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
import { Comment } from 'src/comment/comment.entity';
import { Req, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver((of) => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  @UseGuards(GqlAuthGuard)
  users(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
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

  @ResolveField(() => [Comment])
  comments(@Parent() user: User): Promise<Comment[]> {
    return this.userService.getComments(user.id);
  }


  @Mutation(() => User)
  createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.userService.createUser(createUserInput);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  currentUser( @CurrentUser() user,): Promise<User> {
    return this.userService.findOne(user.id);
  }


}
