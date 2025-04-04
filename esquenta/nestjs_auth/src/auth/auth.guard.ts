import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common'
import type { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import type { JwtPayload } from './auth.dto'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ])

    if (isPublic) return true

    const request: Request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Required access token')
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        algorithms: ['HS256'],
      })

      const user = await this.prismaService.user.findUnique({
        where: { id: payload.sub },
      })

      if (!user) {
        throw new UnauthorizedException('Invalid access token')
      }

      request.user = user

      return true
    } catch (error) {
      console.error(error)
      throw new UnauthorizedException('Invalid access token', { cause: error })
    }
  }
}

export const Public = () => SetMetadata('public', true)
