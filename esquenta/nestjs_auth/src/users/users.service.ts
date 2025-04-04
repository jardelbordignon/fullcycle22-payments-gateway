/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { hashSync } from 'bcryptjs'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
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

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const { password, ...userWithoutPassword } = user

    return userWithoutPassword
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } })
    if (!user) {
      throw new NotFoundException('User not found')
    }

    const data: Prisma.UserUpdateInput = dto
    if (dto.password) {
      data.password = hashSync(dto.password, 8)
    }

    const updatedUser = await this.prisma.user.update({ where: { id }, data })

    const { password, ...userWithoutPassword } = updatedUser

    return userWithoutPassword
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } })
    return { message: 'User deleted successfully' }
  }
}
