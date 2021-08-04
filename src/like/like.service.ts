import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/post/post.entity';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateLikeInput } from './dto/create-like.input';
import { UpdateLikeInput } from './dto/update-like.input';
import { Like } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
  ) {}
  create(createLikeInput: CreateLikeInput) {
    const like = this.likeRepository.create(createLikeInput);
    return this.likeRepository.save(like);
  }

  findAll() {
    return this.likeRepository.find();
  }

  findOne(id: number) {
    return this.likeRepository.findOne(id);
  }

  async removeLike(id: number) {
    const like = await this.likeRepository.findOne(id);
    await this.likeRepository.remove(like);
  }

  getPost(postId: number): Promise<Post> {
    return this.postService.findOne(postId);
  }

  getUser(userId: number): Promise<User> {
    return this.userService.findOne(userId);
  }

  likesByPost(postId: number): Promise<Like[]> {
    return this.likeRepository.find({ where: { postId } });
  }

  likesByUser(userId: number): Promise<Like[]> {
    return this.likeRepository.find({ where: { userId } });
  }

  update(id: number, updateLikeInput: UpdateLikeInput) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }
}
