import { env } from "@saas/env"
import type { FastifyInstance } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import z from "zod"

import { prisma } from "@/lib/prisma"

import { BadRequest } from "../_errors/bad-request-error"

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/sessions/github",
    {
      schema: {
        tags: ["Auth"],
        summary: "Authenticate with GitHub",
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const githubOAuthURL = new URL(
        "https://github.com/login/oauth/access_token"
      )

      githubOAuthURL.searchParams.set("client_id", env.GITHUB_CLIENT_ID)
      githubOAuthURL.searchParams.set("client_secret", env.GITHUB_CLIENT_SECRET)
      githubOAuthURL.searchParams.set(
        "redirect_uri",
        env.GITHUB_CLIENT_REDIRECT_URI
      )
      githubOAuthURL.searchParams.set("code", code)

      const githubAccessTokenResponse = await fetch(githubOAuthURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
      })

      const githubAccessTokenData = await githubAccessTokenResponse.json()

      const { access_token: githubAccessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal("bearer"),
          scope: z.string(),
        })
        .parse(githubAccessTokenData)

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${githubAccessToken}`,
        },
      })

      const githubUserData = await githubUserResponse.json()

      const {
        id: githubId,
        name,
        email,
        avatar_url: avatarUrl,
      } = z
        .object({
          id: z.number().int().transform(String),
          avatar_url: z.string().url().nullable(),
          name: z.string().nullable(),
          email: z.string().nullable(),
        })
        .parse(githubUserData)

      if (email === null) {
        throw new BadRequest(
          "Your GitHub account must have an e-mail to authenticate"
        )
      }

      let user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: "GITHUB",
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: "GITHUB",
            providerAccountId: githubId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        {
          sub: user.id,
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
