import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from 'src/common/guards';
import { Request } from 'express';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AtGuard)
  @Get('me')
  current_user(@Req() req: Request) {
    console.log(req.user);
  }
}
