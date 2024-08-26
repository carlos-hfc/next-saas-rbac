"use client"

import { AlertTriangle, Loader2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFormState } from "@/hooks/use-form-state"

import { createInviteAction } from "./actions"

export function CreateInviteForm() {
  const [{ errors, message, success }, handleSubmit, isPending] =
    useFormState(createInviteAction)

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Invite failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="john@example.com"
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors?.email[0]}
            </p>
          )}
        </div>

        <Select
          name="role"
          defaultValue="MEMBER"
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Member</SelectItem>
            <SelectItem value="BILLING">Billing</SelectItem>
          </SelectContent>
        </Select>

        <Button
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Invite user"
          )}
        </Button>
      </div>
    </form>
  )
}
