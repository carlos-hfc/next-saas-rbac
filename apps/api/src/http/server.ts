import fastifyCors from "@fastify/cors"
import fastifyJwt from "@fastify/jwt"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUi from "@fastify/swagger-ui"
import { env } from "@saas/env"
import { fastify } from "fastify"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"

import { errorHandler } from "./error-handler"
import { authenticateWithGithub } from "./routes/auth/authenticate-with-github"
import { authenticateWithPassword } from "./routes/auth/authenticate-with-password"
import { createAccount } from "./routes/auth/create-account"
import { getProfile } from "./routes/auth/get-profile"
import { requestPasswordRecover } from "./routes/auth/request-password-recover"
import { resetPassword } from "./routes/auth/reset-password"
import { createOrganization } from "./routes/orgs/create-organization"

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifyCors)
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Next.js SaaS",
      description: "Full-stack SaaS app with multi-tenant & RBAC.",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "Bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(fastifySwaggerUi, {
  routePrefix: "/docs",
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

app.register(createAccount)
app.register(authenticateWithPassword)
app.register(getProfile)
app.register(requestPasswordRecover)
app.register(resetPassword)
app.register(authenticateWithGithub)

app.register(createOrganization)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP server running!`)
})
