import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Like {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column()
  @Field((type) => ID)
  userId: number;

  @ManyToOne(() => User, (user) => user.likes)
  @Field((type) => User)
  user: User;

  @Column()
  @Field((type) => ID)
  postId: number;

  @ManyToOne(() => Post, (post) => post.likes)
  @Field((type) => Post)
  post: Post;
}
