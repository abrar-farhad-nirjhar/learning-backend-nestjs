import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Post } from 'src/post/post.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Comment {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field((type) => ID)
  authorId: number;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @Field((type) => User)
  author: User;

  @Column()
  @Field((type) => ID)
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @Field((type) => Post)
  post: Post;
}
