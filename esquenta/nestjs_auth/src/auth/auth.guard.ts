import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { Roles } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorator'
import type { Request } from 'express'
import type { JwtPayload } from './auth.dto'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const targets = [context.getHandler(), context.getClass()]

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    )

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

      const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
        ROLES_KEY,
        targets,
      )

      if (requiredRoles) {
        const hasRole =
          user.role === Roles.ADMIN || requiredRoles.includes(user.role)
        if (!hasRole) throw new ForbiddenException('Insufficient permissions')
      }

      return true
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'jwt expired') {
          throw new UnauthorizedException('Access token expired')
        }
        if (error.message === 'jwt malformed') {
          throw new UnauthorizedException('Invalid access token')
        }
        if (error.message === 'Insufficient permissions') {
          throw new ForbiddenException('Insufficient permissions')
        }
      }
      console.error(error)
      throw new UnauthorizedException('Invalid access token', { cause: error })
    }
  }
}
