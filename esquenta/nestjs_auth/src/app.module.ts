import { Module } from '@nestjs/common'
import { UsersModule } from './users/users.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule, PostsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
