import { api } from "./api-client"

interface SignInWithGithubRequest {
  code: string
}

interface SignInWithGithubResponse {
  token: string
}

export async function signInWithGithub({ code }: SignInWithGithubRequest) {
  const response = await api
    .post("sessions/github", {
      body: JSON.stringify({
        code,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .json<SignInWithGithubResponse>()

  return response
}
