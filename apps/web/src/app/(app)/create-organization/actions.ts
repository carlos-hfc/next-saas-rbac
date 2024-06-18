"use server"

import { HTTPError } from "ky"
import { z } from "zod"

import { createOrganization } from "@/http/create-organization"

const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const organizationSchema = z
  .object({
    name: z.string().min(4, { message: "Include at least 4 characters." }),
    domain: z
      .string()
      .nullable()
      .refine(value => (value ? domainRegex.test(value) : true), {
        message: "Enter a valid domain.",
      }),
    shouldAttachUsersByDomain: z
      .union([z.literal("on"), z.literal("off"), z.boolean()])
      .transform(value => value === "on" || value === true)
      .default(false),
  })
  .refine(
    data => {
      if (data.shouldAttachUsersByDomain === true && !data.domain) return false

      return true
    },
    {
      message: "Domain is required when auto-join is enabled.",
      path: ["domain"],
    }
  )

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return {
      success: false,
      message: null,
      errors,
    }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    return {
      success: true,
      message: "Successfully saved the organization.",
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
