import { forwardRef, Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeResolver } from './like.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './like.entity';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    forwardRef(() => UserModule),
    forwardRef(() => PostModule),
  ],
  providers: [LikeResolver, LikeService],
  exports: [LikeService],
})
export class LikeModule {}
