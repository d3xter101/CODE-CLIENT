"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordInput } from "@/hooks/use-profile";
import { getApiErrorMessage } from "@/lib/api-error";
import { fieldClassName } from "./field-styles";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((v) => v.newPassword !== v.currentPassword, {
    message: "New password must be different from the current one",
    path: ["newPassword"],
  });

type FormFields = z.infer<typeof schema>;

const emptyValues: FormFields = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function ChangePasswordForm({
  onSubmit,
}: {
  onSubmit: (input: ChangePasswordInput) => Promise<void>;
}) {
  const [showPasswords, setShowPasswords] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<FormFields>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const handleSubmit = async ({ currentPassword, newPassword }: FormFields) => {
    try {
      setSaving(true);
      await onSubmit({ currentPassword, newPassword });
      form.reset(emptyValues);
      toast.success("Password changed");
    } catch (err) {
      const message = getApiErrorMessage(err, "Couldn't change your password");
      if (message.toLowerCase().includes("current password")) {
        form.setError("currentPassword", { message });
      } else {
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const fields: { name: keyof FormFields; label: string; autoComplete: string }[] = [
    { name: "currentPassword", label: "Current password", autoComplete: "current-password" },
    { name: "newPassword", label: "New password", autoComplete: "new-password" },
    { name: "confirmPassword", label: "Confirm new password", autoComplete: "new-password" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Use at least 8 characters.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4" noValidate>
            {fields.map(({ name, label, autoComplete }) => (
              <FormField
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                      <Input className={fieldClassName} type={showPasswords ? "text" : "password"} autoComplete={autoComplete} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <div className="flex items-center justify-between gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPasswords((v) => !v)}>
                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPasswords ? "Hide" : "Show"} passwords
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Changing..." : "Change password"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
