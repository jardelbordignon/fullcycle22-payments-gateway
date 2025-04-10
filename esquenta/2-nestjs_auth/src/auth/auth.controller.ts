import { Body, Controller, Post } from '@nestjs/common'
import { Public } from './auth.decorator'
import { AuthService } from './auth.service'
import type { LoginDto } from './auth.dto'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto)
  }
}
