/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hashSync } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly caslAbilityService: CaslAbilityService,
  ) {}

  async create(dto: CreateUserDto) {
    const { ability } = this.caslAbilityService

    if (ability.cannot('create', 'User')) {
      throw new ForbiddenException('You are not allowed to create a user')
    }

    const userFromEmail = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })
    if (userFromEmail) {
      throw new ConflictException('An user with this email already exists')
    }

    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: hashSync(dto.password, 8),
      },
    })

    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  async findAll() {
    const users = await this.prisma.user.findMany()
    return users.map(
      ({ password, ...userWithoutPassword }) => userWithoutPassword,
    )
  }

  private async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return user
  }

  async findOne(id: string) {
    const user = await this.getUser(id)

    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.getUser(id)

    const data: Prisma.UserUpdateInput = dto
    if (dto.password) {
      data.password = hashSync(dto.password, 8)
    }

    const updatedUser = await this.prisma.user.update({ where: { id }, data })

    const { password, ...userWithoutPassword } = updatedUser

    return userWithoutPassword
  }

  async remove(id: string) {
    await this.getUser(id)
    return this.prisma.user.delete({ where: { id } })
  }
}
