"use server"

import { redirect } from "next/navigation"

export async function signInWithGithub() {
  const githubSignInURL = new URL("login/oauth/authorize", "https://github.com")

  githubSignInURL.searchParams.set("client_id", "d1cadaa68229a75d117d")
  githubSignInURL.searchParams.set(
    "redirect_uri",
    "http://localhost:3000/api/auth/callback"
  )
  githubSignInURL.searchParams.set("scope", "user")

  redirect(githubSignInURL.toString())
}
