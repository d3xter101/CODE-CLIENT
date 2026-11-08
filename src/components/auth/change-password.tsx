"use client";

import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { useRouter } from "next/navigation";
import { Loading } from "../loading";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"], // this will attach the error to the confirmation field
  });

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: ""
    },
  });

  const router = useRouter();

  async function formSubmitHandler(values: z.infer<typeof formSchema>) {
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/member/changePassword`,
        null,
        {
          params: { newPassword: values.password },
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          withCredentials: true,
        }
      );

      if (!res.data) {
        toast.error("Error, please try again later");
        return;
      } else {
        toast.success(res.data.message);
      }

      router.push("/");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to change password, try again later."));
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitHandler)}>
          <div className="flex flex-col gap-6 mt-10 ">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-serif text-2xl font-bold">Change your password</h1>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        id="password"
                        type="password"
                        placeholder="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passwordConfirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password Confirmation</FormLabel>
                    <FormControl>
                      <Input
                        id="passwordConfirmation"
                        type="password"
                        placeholder="Password Confirmation"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loading className="text-primary-foreground" />
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
      </div>
  );
}