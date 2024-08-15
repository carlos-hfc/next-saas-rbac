import { api } from "./api-client"

interface GetOrganizationResponse {
  organization: {
    id: string
    name: string
    slug: string
    domain: string | null
    shouldAttachUsersByDomain: boolean
    avatarUrl: string | null
    createdAt: string
    updatedAt: string
    ownerId: string
  }
}

export async function getOrganization(org: string) {
  const response = await api
    .get(`organizations/${org}`)
    .json<GetOrganizationResponse>()

  return response
}
