"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { loginRequestSchema } from "../_lib/schema";
import { useMutation } from "@tanstack/react-query";
import { generateUrl } from "~/lib/utils";
import { env } from "~/env";
import { toast } from "sonner";
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
    mutationFn: (data: z.infer<typeof loginRequestSchema>) =>
      fetch(
        generateUrl(
          "https://stkb.vercel.app/api/xzolla/oauth2/login/email/request",
          {
            response_type: "code",
            client_id: env.NEXT_PUBLIC_ST_CLIENT_ID,
            scope: "offline",
            state: "randomteststring",
            redirect_uri: "https://login.xsolla.com/api/blank",
            engine: "unity",
            engine_v: "2022.3.20f1",
            sdk: "login",
            sdk_v: "0.7.1",
          },
        ),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: data.email, send_link: false }),
        },
      ),
  });

  async function onSubmit(data: z.infer<typeof loginRequestSchema>) {
    let searchParams = null;
    let success = false;

    try {
      const response = await mutation.mutateAsync(data);

      const { operation_id: operationId } = (await response.json()) as {
        operation_id?: string;
      };
      if (!operationId) {
        toast.error("An unknown error has occured", {
          description: "Please try again later",
        });
        return;
      }

      searchParams = new URLSearchParams({
        email: data.email,
        operationId,
      });

      success = true;
    } catch (err) {
      console.log(err);
    }

    if (!searchParams || !success) {
      return;
    }

    toast.success("Email sent", {
      description: "Please check your email for the code",
    });

    router.push(`/auth/verify?${searchParams.toString()}`);
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
