import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    try {
      // password hash
      const hash = await argon.hash(dto.password);
      // password save
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      // return the user
      delete user.hash;
      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
    }
  }

  async signin(dto: AuthDto) {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // return error exception if user not exist
    if (!user) throw new ForbiddenException('credentials incorrect');
    // verify password if user exist
    const passsMatches = await argon.verify(user.hash, dto.password);

    if (!passsMatches) throw new ForbiddenException('credentials incorrect');

    delete user.hash;
    return user;
    // return the user if password match
  }
}
