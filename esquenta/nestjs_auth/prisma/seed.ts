import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
const prisma = new PrismaClient()

async function main() {
  const password = await hash('123qwe', 1)

  await prisma.user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@email.com',
        password,
        role: 'ADMIN',
      },
      {
        name: 'Editor',
        email: 'editor@email.com',
        password,
        role: 'EDITOR',
      },
      {
        name: 'Reader',
        email: 'reader@email.com',
        password,
        role: 'READER',
      },
      {
        name: 'Writer',
        email: 'writer@email.com',
        password,
        role: 'WRITER',
      },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
