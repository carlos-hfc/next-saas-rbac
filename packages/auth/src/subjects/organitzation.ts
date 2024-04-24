import { z } from "zod"

import { organizationtSchema } from "../models/organization"

export const organizationSubject = z.tuple([
  z.union([
    z.literal("manage"),
    z.literal("update"),
    z.literal("delete"),
    z.literal("transfer_ownership"),
  ]),
  z.union([z.literal("Organization"), organizationtSchema]),
])

export type OrganizationSubject = z.infer<typeof organizationSubject>
