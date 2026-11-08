"use client";

import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { useUser } from "@/hooks/use-user";
import { Loading } from "@/components/loading";

export default function LoginPage() {
  const { user, loading, error } = useUser(false);
  if (user) {
    redirect("/");
  }

  if (loading) return <Loading />;

  // 401/403 isn't an error, YOU AREN'T MEANT TO BE AUTHORIZED BEFORE LOGIN IN
  // (useUser resolves those to `user: null`, so `error` is undefined for a logged-out visitor)
  if (error && error.status != 401) {
    return (
      <p className="text-red-500">Something went wrong. Please try again.</p>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <LoginForm />
    </div>
  );
}
