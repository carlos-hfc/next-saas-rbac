import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { getProfile } from "@/http/get-profile"

export function isAuthenticated() {
  return !!cookies().get("token")?.value
}

export async function auth() {
  if (!isAuthenticated()) {
    redirect("/auth/sign-in")
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch {}

  redirect("/api/auth/sign-out")
}
