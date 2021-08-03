import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { UserModule } from 'src/user/user.module';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    forwardRef(() => UserModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentModule),
  ],
  providers: [PostService, PostResolver],
  exports: [PostService],
})
export class PostModule {}
