import {
  BadRequestException,
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
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service'
import type { Request } from 'express'
import type { JwtPayload } from './auth.dto'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const targets = [
      context.getHandler(), // methods
      context.getClass(), // classes
    ]

    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      targets,
    )

    if (isPublic) return true

    // caso o endpoint não seja público, o access token é verificado e o user autenticado é buscado no banco de dados.

    const request: Request = context.switchToHttp().getRequest()
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new UnauthorizedException('Required access token')
    }

    try {
      const jwtPayload = this.jwtService.verify<JwtPayload>(token, {
        algorithms: ['HS256'],
      })

      // const user = await this.prismaService.user.findUnique({
      //   where: { id: payload.sub },
      // })

      // if (!user) {
      //   throw new UnauthorizedException('Invalid access token')
      // }

      // verifica se o endpoint exige alguma role específica e se o user autenticado possui uma dessas roles.

      const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
        ROLES_KEY,
        targets,
      )

      const { role, permissions } = jwtPayload

      if (requiredRoles) {
        const hasRole = role === Roles.ADMIN || requiredRoles.includes(role)
        if (!hasRole) throw new ForbiddenException('Insufficient role')
      }

      // até aqui está garantido que o user está autenticado e tem permissão para acessar o endpoint,
      // a partir daqui, a autorização é feita pela casl, criando um ability para o user autenticado,
      // com isso serão verificadas as permissões específicas a ele nas services através de (can ou cannot ...)

      this.caslAbilityService.createForRules(permissions)
      //request.user = user
      request.jwtPayload = jwtPayload

      return true
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'jwt expired') {
          throw new UnauthorizedException('Access token expired')
        }
        if (
          error.message === 'malformed token' ||
          error.message === 'Required access token'
        ) {
          throw new ForbiddenException(error.message)
        }
      }
      console.error(error)
      throw new BadRequestException('Error on auth guard', { cause: error })
    }
  }
}
