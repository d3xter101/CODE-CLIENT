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
  code: z.string().regex(/^\d{6}$/, "The code must be exactly 6 digits"),
});

export function ValidateEmailForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: ""
    },
  });


  const router = useRouter();

  async function formSubmitHandler(values: z.infer<typeof formSchema>) {
    try {
      const res = await api.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/member/validateEmail`,
        null,
        {
          params: { validationCode: values.code },
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

      router.push("/changePassword");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Validation failed."));
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(formSubmitHandler)}>
          <div className="flex flex-col gap-6 mt-10 ">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="font-serif text-2xl font-bold">Validate your email</h1>
              <p>
                A 6-digit code was sent to your email
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validation Code</FormLabel>
                    <FormControl>
                      <Input
                        id="code"
                        type="text"
                        placeholder="******"
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
                  "Validate Email"
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}