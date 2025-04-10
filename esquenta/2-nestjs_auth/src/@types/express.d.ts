import 'express'
import type { JwtPayload } from 'src/auth/auth.dto'

declare global {
  namespace Express {
    export interface Request {
      jwtPayload?: JwtPayload
    }
  }
}
