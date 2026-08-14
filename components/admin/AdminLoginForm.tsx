"use client";

import { useActionState } from "react";
import { signInAdmin, type SignInState } from "@/lib/actions/auth";

const initialState: SignInState = {};

export default function AdminLoginForm() {
  const [state, action, pending] = useActionState(signInAdmin, initialState);

  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-1.5">
        <span className="text-sm text-foreground">Email</span>
        <input
          type="email"
          name="email"
          autoComplete="username"
          required
          placeholder="admin@example.com"
          className="w-full rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm text-foreground">Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className="w-full rounded-md border border-border bg-[#0b0e14] px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-foreground-muted/50 focus:border-primary"
        />
      </label>

      {state.error ? (
        <p className="text-sm text-danger" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="btn w-full text-sm disabled:pointer-events-none disabled:opacity-55"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
