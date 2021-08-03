import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PostModule } from 'src/post/post.module';
import { LikeModule } from 'src/like/like.module';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => PostModule),
    forwardRef(() => LikeModule),
    forwardRef(() => CommentModule),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
