import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compareSync } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import type { JwtPayload, LoginDto } from './auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginDto) {
    const user = await this.prismaService.user.findUnique({ where: { email } })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = compareSync(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const jwtPayload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email,
      role: user.role,
    }

    return { access_token: this.jwtService.sign(jwtPayload) }
  }
}
