import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  @Field((type) => Boolean)
  isPublished: Boolean;

  @ManyToOne(() => User, (user) => user.posts)
  @Field((type) => User)
  author: User;
}
