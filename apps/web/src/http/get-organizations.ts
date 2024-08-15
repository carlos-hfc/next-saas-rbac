import { api } from "./api-client"

interface GetOrganizationsResponse {
  organizations: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getOrganizations() {
  const response = await api
    .get("organizations", {
      next: {
        tags: ["organizations"],
      },
    })
    .json<GetOrganizationsResponse>()

  return response
}
