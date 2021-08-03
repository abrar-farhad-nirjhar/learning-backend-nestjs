import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentService } from 'src/comment/comment.service';
import { Like } from 'src/like/like.entity';
import { LikeService } from 'src/like/like.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './post.entity';
import { Comment } from 'src/comment/comment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => LikeService))
    private likeService: LikeService,
    @Inject(forwardRef(() => CommentService))
    private commentService: CommentService,
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
  getLikes(postId: number): Promise<Like[]> {
    return this.likeService.likesByPost(postId);
  }
  getComments(postId: number): Promise<Comment[]> {
    return this.commentService.commentsByPost(postId);
  }

  postsByUsers(authorId: number): Promise<Post[]> {
    return this.postRepository.find({ where: { authorId } });
  }
}
