import {
  AppAbility,
  PermActions,
} from 'src/casl/casl-ability/casl-ability.service'

declare global {
  namespace PrismaJson {
    type PermissionsList = Array<{
      action: PermActions
      resource: SubjectTypeOf<AppAbility>
      condition?: Record<string, any>
    }>
  }
}
