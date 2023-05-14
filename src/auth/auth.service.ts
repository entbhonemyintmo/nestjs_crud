import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/JwtPayload.type';
import { ConfigService } from '@nestjs/config';
import { JwtTokens } from './types/JwtTokens.type';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
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

  async signin(dto: AuthDto): Promise<JwtTokens> {
    // find user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // return error exception if user does not exist
    if (!user) throw new ForbiddenException('credentials incorrect');
    // verify password if user exist
    const passsMatches = await argon.verify(user.hash, dto.password);

    if (!passsMatches) throw new ForbiddenException('credentials incorrect');

    // if generate tokens if password match
    const [access_token, refresh_token] = await Promise.all([
      this.generate_token(
        { sub: user.id, email: user.email },
        this.config.get('JWT_ACCESS_SECRET'),
      ),
      this.generate_token(
        { sub: user.id, email: user.email },
        this.config.get('JWT_REFRESH_SECRET'),
      ),
    ]);

    // return the tokens if password match
    return { access_token, refresh_token, auth_method: 'Bearer' };
  }

  private async generate_token(
    payload: JwtPayload,
    secret: string,
    expiresIn = '15m',
  ) {
    const token = await this.jwt.signAsync(payload, { expiresIn, secret });
    return token;
  }
}
