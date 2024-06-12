import { api } from "./api-client"

interface SignInWithCredentialsRequest {
  email: string
  password: string
}

interface SignInWithCredentialsResponse {
  token: string
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithCredentialsRequest) {
  const response = await api
    .post("sessions/password", {
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .json<SignInWithCredentialsResponse>()

  return response
}
