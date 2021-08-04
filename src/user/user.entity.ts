import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comment/comment.entity';
import { Like } from 'src/like/like.entity';
import { Post } from 'src/post/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @OneToMany(() => Post, (post) => post.author)
  @Field((type) => [Post], { nullable: true })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author)
  @Field((type) => [Comment], { nullable: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  @Field((type) => [Like], { nullable: true })
  likes: Like[];
}
