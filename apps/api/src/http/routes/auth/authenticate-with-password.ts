import { compare } from "bcryptjs"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { prisma } from "@/lib/prisma"

import { BadRequest } from "../_errors/bad-request-error"

export async function authenticateWithPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/password",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with e-mail and password",
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const userFromEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!userFromEmail) {
        throw new BadRequest("Invalid credentials")
      }

      if (userFromEmail.password === null) {
        throw new BadRequest("User does not have a password. Use social login.")
      }

      const isPasswordValid = await compare(password, userFromEmail.password)

      if (!isPasswordValid) {
        throw new BadRequest("Invalid credentials")
      }

      const token = await reply.jwtSign(
        {
          sub: userFromEmail.id,
        },
        {
          sign: {
            expiresIn: "7d",
          },
        }
      )

      return reply.status(201).send({ token })
    }
  )
}
