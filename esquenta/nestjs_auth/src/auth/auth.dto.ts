export interface JwtPayload {
  sub: string
  name: string
  email: string
  role: string
}

export interface LoginDto {
  email: string
  password: string
}

export interface LoginResponseDto {
  access_token: string
}
