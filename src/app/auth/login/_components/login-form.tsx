"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import loginRequest from "../_actions/login-request";
import { loginRequestSchema } from "../_lib/schema";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof loginRequestSchema>>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof loginRequestSchema>) => {
      const form = new FormData();
      form.append("email", data.email);

      return await loginRequest(form);
    },
    onSuccess: (data, variables) => {
      if (!data?.operationId) {
        form.setError("email", {
          message: "Invalid email address",
        });
        return;
      }

      toast.success("Check your email for a login code");

      const searchParams = new URLSearchParams({
        email: variables.email,
        operationId: data.operationId,
      });

      router.push(`/auth/verify?${searchParams.toString()}`);
    },
    onError: () => {
      form.setError("email", {
        message: "Invalid email address",
      });
    },
  });

  async function onSubmit(data: z.infer<typeof loginRequestSchema>) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>

            <CardDescription>
              Enter your email below to receive a code in your inbox.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormDescription>
                    This is the email used with your Kabam account.
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button
              className="w-full"
              disabled={form.formState.isSubmitting || mutation.isPending}
            >
              Continue
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
