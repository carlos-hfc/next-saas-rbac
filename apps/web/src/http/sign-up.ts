import { api } from "./api-client"

interface SignUpRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = void

export async function signUp({
  name,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post("users", {
    body: JSON.stringify({
      email,
      password,
      name,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}
