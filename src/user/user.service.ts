import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LikeService } from 'src/like/like.service';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user-input';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
    @Inject(forwardRef(() => LikeService))
    private likeService: LikeService,
  ) {}

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  createUser(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  getPosts(authorId: number) {
    return this.postService.postsByUsers(authorId);
  }

  getLikes(userId: number) {
    return this.likeService.likesByUser(userId);
  }
}
