import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Comment } from 'src/comment/comment.entity';
import { Like } from 'src/like/like.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Post {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id: number;

  @Column()
  @Field()
  content: string;

  @Column()
  @Field((type) => Boolean, { defaultValue: false })
  isPublished: Boolean;

  @Column()
  @Field((type) => ID)
  authorId: number;

  @ManyToOne(() => User, (user) => user.posts)
  @Field((type) => User)
  author: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  @Field((type) => [Comment], { nullable: true })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  @Field((type) => [Like], { nullable: true })
  likes: Like[];
}
