import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Request } from 'express'
import { RequiredRoles } from 'src/auth/auth.decorator'
import { Roles } from '@prisma/client'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @RequiredRoles(Roles.WRITER, Roles.EDITOR)
  @Post()
  create(@Body() dto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create({
      ...dto,
      authorId: req.jwtPayload!.sub,
    })
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.READER)
  @Get()
  findAll() {
    return this.postsService.findAll()
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.READER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto)
  }

  @RequiredRoles(Roles.ADMIN)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id)
  }
}
