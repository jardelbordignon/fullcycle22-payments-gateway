import { AbilityBuilder, PureAbility, SubjectRawRule } from '@casl/ability'
import { PackRule, unpackRules } from '@casl/ability/extra'
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma'
import { Injectable, Scope } from '@nestjs/common'
import { Post, Roles, User } from '@prisma/client'

export type Rules = PackRule<SubjectRawRule<any, any, any>>[]

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

// rbac - role based access control -> olha para o papel do usuário e verifica se ele tem permissão para acessar o recurso
// abac - attribute based access control -> olha para os atributos do recurso, para o contexto das regras de negócio, trazendo mais flexibilidade e abrangência
// acl - access control list -> lista de permissões

@Injectable({
  scope: Scope.REQUEST /** para que o ability seja criado em cada requisição */,
})
export class CaslAbilityService {
  ability: AppAbility

  createForUser(user: User) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)
    rolePermissions[user.role](user, builder)

    const userPermissions = user.permissions as PrismaJson.PermissionsList
    userPermissions?.forEach(({ action, resource, condition }) => {
      builder.can(action, resource, condition)
    })

    this.ability = builder.build()
    return this.ability
  }

  createForRules(rules: Rules) {
    const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)

    unpackRules(rules).forEach(rule => {
      builder.rules.push(rule)
    })

    this.ability = builder.build()
    return this.ability
  }
}
