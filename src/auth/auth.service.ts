import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup() {
    return { msg: 'Hello i am Sign up' };
  }

  signin() {
    return { msg: 'Hello i am Sign in' };
  }
}
