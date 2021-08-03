import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async findOne(id: number): Promise<Post> {
    return this.postRepository.findOne(id);
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find();
  }

  createPost(CreatePostInput: CreatePostInput): Promise<Post> {
    const post = this.postRepository.create(CreatePostInput);
    return this.postRepository.save(post);
  }

  getUser(authorId: number): Promise<User> {
    return this.userService.findOne(authorId);
  }

  postsByUsers(authorId: number): Promise<Post[]> {
    return this.postRepository.find({ where: { authorId } });
  }
}
