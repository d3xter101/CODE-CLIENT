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
import Link from "next/link";
import api from "@/lib/axios";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";
import { useRouter } from "next/navigation";
import { Loading } from "../loading";
import { useUser } from "@/hooks/use-user";

const formSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const { mutate } = useUser(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        {
          email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
          withCredentials: true, // important if API sends refresh_token cookie
        }
      );

      if (!res.data) {
        toast.error("Login failed. Please try again.");
        return;
      }

      // ✅ refresh user state
      await mutate();

      toast.success("Successfully logged in!");
      router.push("/");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Login failed. Please try again."));
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6 mt-10 ">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-serif text-2xl font-bold">Welcome to Code.</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your email below to login to your account
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" {...field} />
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
                  "Login"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="text-center text-xs">
        <Link
          href="/forgotPassword"
          className="underline underline-offset-4 hover:text-primary"
        >
          Forgot your password?
        </Link>
      </div>

      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{" "}
        {/*<Link
          href="/terms-of-service"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}*/}
        <Link
          href="/privacy-policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
