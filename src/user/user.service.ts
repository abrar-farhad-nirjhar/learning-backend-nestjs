import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { LikeService } from 'src/like/like.service';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user-input';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
    @Inject(forwardRef(() => LikeService))
    private likeService: LikeService,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
  ) {}

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async createUser(createUserInput: CreateUserInput): Promise<User> {
    createUserInput.password = await bcrypt.hash(createUserInput.password, 12);
    const user = this.userRepository.create(createUserInput);
    return this.userRepository.save(user);
  }

  async login(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  getPosts(authorId: number) {
    return this.postService.postsByUsers(authorId);
  }

  getLikes(userId: number) {
    return this.likeService.likesByUser(userId);
  }

  getComments(authorId: number) {
    return this.commentService.commentsByUser(authorId);
  }
}
