"use client"

import { AlertTriangle, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import githubIcon from "@/assets/github-icon.svg"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useFormState } from "@/hooks/use-form-state"

import { signInWithCredentials } from "./actions"

const INITIAL_STATE = {
  success: false,
  message: null as string | null,
  errors: null as Record<string, string[]> | null,
}

export function SignInForm() {
  const [{ errors, message, success }, handleSubmit, isPending] = useFormState(
    signInWithCredentials
  )

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      {!success && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />

          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input
          type="email"
          name="email"
          id="email"
        />

        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors?.email[0]}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          id="password"
        />

        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors?.password[0]}
          </p>
        )}

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      <Button
        className="w-full"
        type="submit"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Sign in with e-mail"
        )}
      </Button>

      <Button
        className="w-full"
        variant="link"
        size="sm"
        asChild
      >
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      <Button
        className="w-full"
        variant="outline"
        type="button"
      >
        <Image
          src={githubIcon}
          className="mr-4 size-4 dark:invert"
          alt=""
        />
        Sign in with GitHub
      </Button>
    </form>
  )
}
