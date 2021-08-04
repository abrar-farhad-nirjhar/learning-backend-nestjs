import { BadRequestException } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { AuthJwtOutput } from './dto/auth-jwt.output';
import { LoginUserInput } from './dto/login-user.input';

@Resolver()
export class AuthResolver {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Query(() => AuthJwtOutput)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput) {
    console.log(loginUserInput.email);
    const user: any = await this.userService.login(loginUserInput.email);
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    console.log(user.password);
    if (!(await bcrypt.compare(loginUserInput.password, user.password))) {
      throw new BadRequestException('Invalid Credentials');
    }

    const jwt = await this.jwtService.signAsync({
      user: { id: user.id, email: user.email },
    });

    return { jwt };
  }
}
