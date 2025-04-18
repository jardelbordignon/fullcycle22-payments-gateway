import {
  SetMetadata,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common'
import { Roles } from '@prisma/client'
import { JwtPayload } from './auth.dto'

export const ROLES_KEY = 'roles'
export const IS_PUBLIC_KEY = 'isPublic'

/**
 * @description Decorator to set the route as public
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true)

/**
 * @description Decorator to set the roles required to access a route
 * @param roles - The roles required to access the route
 */
export const RequiredRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles)

/**
 * @description Param Decorator to get the current authenticated user
 * @param prop - The user property to return, if not provided, the whole user object is returned
 * @example
 *   getUsers(@CurrentUser() user: JwtPayload) {}
 *   getUsers(@CurrentUser('sub') userId: string) {}
 */
export const CurrentUser = createParamDecorator(
  (prop: keyof JwtPayload, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest<{ user: JwtPayload }>()
    return prop ? user?.[prop] : user
  },
)
