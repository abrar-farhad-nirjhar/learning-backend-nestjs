import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    @Inject(forwardRef(() => PostService)) private postService: PostService,
  ) {}
  create(createCommentInput: CreateCommentInput) {
    const comment = this.commentRepository.create(createCommentInput);
    return this.commentRepository.save(comment);
  }

  findAll() {
    return this.commentRepository.find();
  }

  findOne(id: number) {
    return this.commentRepository.findOne(id);
  }

  getPost(postId: number): Promise<Post> {
    return this.postService.findOne(postId);
  }
  getAuthor(authorId: number): Promise<User> {
    return this.userService.findOne(authorId);
  }
  commentsByPost(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { postId } });
  }
  commentsByUser(authorId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { authorId } });
  }

  update(id: number, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
