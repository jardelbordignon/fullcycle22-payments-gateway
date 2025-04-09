import { AbilityBuilder, PureAbility } from '@casl/ability'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Injectable, Scope } from '@nestjs/common'
import { Post, Roles, User } from '@prisma/client'

// A permissão manage é um especial na lib casl, ela não tem restrições
export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete'
export type PermissionResource = Subjects<{ User: User; Post: Post }> | 'all'
export type AppAbility = PureAbility<
  [PermActions, PermissionResource],
  PrismaQuery
>
export type DefinePermissions = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

const rolePermissions: Record<Roles, DefinePermissions> = {
  ADMIN(user, { can }) {
    can('manage', 'all')
  },
  EDITOR(user, { can }) {
    can('create', 'Post')
    can('read', 'Post')
    can('update', 'Post', ['content', 'published'])
  },
  WRITER(user, { can }) {
    can('create', 'Post')
    can('read', 'Post', { authorId: user.id })
    can('update', 'Post', { authorId: user.id })
  },
  READER(user, { can }) {
    can('read', 'Post', { published: true })
  },
}

@Injectable({
  scope: Scope.REQUEST /** para que o ability seja criado em cada requisição */,
})
export class CaslAbilityService {
  ability: AppAbility

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)
    rolePermissions[user.role](user, builder)
    this.ability = builder.build()
    return this.ability
  }
}
