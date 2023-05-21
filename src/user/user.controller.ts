import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('me')
  current_user(@GetUser() user: User) {
    delete user.hash;
    return user;
  }
}
