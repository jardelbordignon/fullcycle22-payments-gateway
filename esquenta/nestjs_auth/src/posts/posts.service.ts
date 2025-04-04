import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreatePostDto & { authorId: string }) {
    return this.prisma.post.create({ data })
  }

  findAll() {
    return this.prisma.post.findMany()
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({ where: { id } })
    if (!post) {
      throw new NotFoundException('Post not found')
    }
    return post
  }

  async update(id: string, data: UpdatePostDto) {
    await this.findOne(id)
    return this.prisma.post.update({ where: { id }, data })
  }

  async remove(id: string) {
    await this.findOne(id)
    await this.prisma.post.delete({ where: { id } })
    return { postId: id }
  }
}
