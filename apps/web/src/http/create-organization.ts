import { api } from "./api-client"

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

type CreateOrganizationResponse = void

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest): Promise<CreateOrganizationResponse> {
  await api.post("organizations", {
    body: JSON.stringify({
      name,
      domain,
      shouldAttachUsersByDomain,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
}
