import type { Roles } from '@prisma/client'
import type { Rules } from 'src/casl/casl-ability/casl-ability.service'
export interface JwtPayload {
  sub: string
  name: string
  email: string
  role: Roles
  permissions: Rules
}

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  access_token: string
}
