import { Module, Scope } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard'
import { APP_GUARD } from '@nestjs/core'
import { PrismaModule } from 'src/prisma/prisma.module'
import { CaslModule } from 'src/casl/casl.module'

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '2h',
        algorithm: 'HS256',
      },
    }),
    PrismaModule,
    CaslModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
      scope: Scope.REQUEST, // para que o guard seja criado em cada requisição por conta do uso da caslAbilityService
      // sem a alteração no scope o seguinte erro ocorre: TypeError: Cannot read properties of undefined (reading 'getAllAndOverride') at AuthGuard.canActivate
    },
  ],
})
export class AuthModule {}
