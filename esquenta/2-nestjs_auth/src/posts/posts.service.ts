import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { accessibleBy } from '@casl/prisma'
import {
  CaslAbilityService,
  PermActions,
} from 'src/casl/casl-ability/casl-ability.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  private checkAbility(action: PermActions) {
    const { ability } = this.caslAbilityService
    if (ability.cannot(action, 'Post')) {
      throw new ForbiddenException(`You are not allowed to ${action} posts`)
    }
    return ability
  }

  create(data: CreatePostDto & { authorId: string }) {
    this.checkAbility('create')
    return this.prisma.post.create({ data })
  }

  findAll() {
    const ability = this.checkAbility('read')

    return this.prisma.post.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').Post],
      },
    })
  }

  async findOne(id: string, action: PermActions = 'read') {
    const ability = this.checkAbility(action)

    const post = await this.prisma.post.findUnique({
      where: { id, AND: [accessibleBy(ability, action).Post] },
    })

    if (!post) {
      throw new NotFoundException('Post not found')
    }

    return post
  }

  async update(id: string, data: UpdatePostDto) {
    await this.findOne(id, 'update')
    return this.prisma.post.update({ where: { id }, data })
  }

  async remove(id: string) {
    await this.findOne(id, 'delete')
    await this.prisma.post.delete({ where: { id } })
    return { postId: id }
  }
}
