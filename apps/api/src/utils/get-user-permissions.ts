import { defineAbilityFor, type Role, userSchema } from "@saas/auth"

interface GetUserPermissionsRequest {
  id: string
  role: Role
}

export function getUserPermissions({ id, role }: GetUserPermissionsRequest) {
  const authUser = userSchema.parse({
    id,
    role,
  })

  const ability = defineAbilityFor(authUser)

  return ability
}
