"use server"

import { HTTPError } from "ky"
import { z } from "zod"

import { signInWithPassword } from "@/http/sign-in-with-password"

const signInSchema = z.object({
  email: z.string().email({ message: "Provide a valid e-mail address." }),
  password: z.string().min(1, { message: "Provide your password" }),
})

export async function signInWithCredentials(_: unknown, data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { email, password } = result.data

  try {
    const response = await signInWithPassword({
      email,
      password,
    })

    return {
      success: true,
      message: null,
      errors: null,
    }
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return {
        success: false,
        message,
        errors: null,
      }
    }

    console.error(error)

    return {
      success: false,
      message: "Unexpected error, try again in a few minutes",
      errors: null,
    }
  }
}
