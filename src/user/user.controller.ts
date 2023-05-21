import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards';
import { GetUser } from 'src/common/decorators';
import { JwtPayload } from './types';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('me')
  current_user(@GetUser() user: JwtPayload) {
    return this.userService.current_user(user);
  }
}
