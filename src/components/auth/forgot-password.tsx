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

const formSchema = z.object({
  email: z.email("Please enter a valid email address")
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ""
    },
  });

  const router = useRouter();

  async function formSubmitHandler(values: z.infer<typeof formSchema>) {
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/member/forgotPassword`,
        null,
        {
          params: { email: values.email },
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

      router.push("/validateEmail");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Couldn't send the recovery code, try again later."));
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitHandler)}>
          <div className="flex flex-col gap-6 mt-10 ">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-serif text-2xl font-bold">Recover Your Account.</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email below to recover your account
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
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
                  "Send Validation Email"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
