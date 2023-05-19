import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './types';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async current_user(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: payload.email,
        id: payload.sub,
      },
    });
    return user;
  }
}
