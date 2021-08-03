import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
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
}
