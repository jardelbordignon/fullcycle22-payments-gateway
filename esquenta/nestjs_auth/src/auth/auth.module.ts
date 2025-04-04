import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard'
import { APP_GUARD } from '@nestjs/core'

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
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
