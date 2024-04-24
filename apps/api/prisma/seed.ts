import { faker } from "@faker-js/faker"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  await prisma.organization.deleteMany()
  await prisma.user.deleteMany()

  const password = await hash("123456", 1)

  const [user, anotherUserOne, anotherUserTwo] = await Promise.all([
    prisma.user.create({
      data: {
        name: "John Doe",
        email: "john@acme.com",
        password,
        avatarUrl: "https://github.com/carlos-hfc.png",
      },
    }),
    prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        avatarUrl: faker.image.avatarGitHub(),
      },
    }),
    prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password,
        avatarUrl: faker.image.avatarGitHub(),
      },
    }),
  ])

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Admin)",
      slug: "acme-admin",
      domain: "acme.com",
      avatarUrl: faker.image.avatarGitHub(),
      shouldAttachUsersByDomain: true,
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: "ADMIN",
            },
            {
              userId: anotherUserOne.id,
              role: "MEMBER",
            },
            {
              userId: anotherUserTwo.id,
              role: "MEMBER",
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Member)",
      slug: "acme-member",
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: "MEMBER",
            },
            {
              userId: anotherUserOne.id,
              role: "ADMIN",
            },
            {
              userId: anotherUserTwo.id,
              role: "MEMBER",
            },
          ],
        },
      },
    },
  })

  await prisma.organization.create({
    data: {
      name: "Acme Inc (Billing)",
      slug: "acme-billing",
      avatarUrl: faker.image.avatarGitHub(),
      ownerId: user.id,
      projects: {
        createMany: {
          data: [
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
            {
              name: faker.lorem.word(5),
              slug: faker.lorem.slug(5),
              description: faker.lorem.paragraph(),
              avatarUrl: faker.image.avatarGitHub(),
              ownerId: faker.helpers.arrayElement([
                user.id,
                anotherUserOne.id,
                anotherUserTwo.id,
              ]),
            },
          ],
        },
      },
      members: {
        createMany: {
          data: [
            {
              userId: user.id,
              role: "BILLING",
            },
            {
              userId: anotherUserOne.id,
              role: "ADMIN",
            },
            {
              userId: anotherUserTwo.id,
              role: "MEMBER",
            },
          ],
        },
      },
    },
  })
}

main().then(() => console.log("Database seeded!"))
