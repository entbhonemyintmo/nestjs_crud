import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AtStrategy } from './strategies';

@Module({
  controllers: [UserController],
  providers: [UserService, AtStrategy],
})
export class UserModule {}
