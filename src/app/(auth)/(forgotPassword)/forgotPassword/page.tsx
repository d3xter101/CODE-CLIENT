"use client";

import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "@/components/auth/forgot-password";
import { useUser } from "@/hooks/use-user";
import { Loading } from "@/components/loading";

export default function LoginPage() {
  const { user, loading, error } = useUser(false);
  if (user) {
    redirect("/");
  }

  if (loading) return <Loading />;

  if (error.status != 401) {
    return (
      <p className="text-red-500">Something went wrong. Please try again.</p>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <ForgotPasswordForm />
    </div>
  );
}
