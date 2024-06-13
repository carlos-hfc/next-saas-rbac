"use server"

import { HTTPError } from "ky"
import { z } from "zod"

import { signUp } from "@/http/sign-up"

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Provide a valid e-mail address." }),
    name: z
      .string()
      .min(1, { message: "Provide your name" })
      .refine(value => value.split(" ").length > 1, {
        message: "Provide your full name.",
      }),
    password: z
      .string()
      .min(6, { message: "Password should have at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Password confirmation does not match.",
    path: ["confirmPassword"],
  })

export async function signUpAction(data: FormData) {
  const result = signUpSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, email, password } = result.data

  try {
    await signUp({
      name,
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
