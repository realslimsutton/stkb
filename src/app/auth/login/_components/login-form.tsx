"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { generateUrl } from "~/lib/utils";
import { loginRequestSchema } from "../_lib/schema";

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
      const response = await fetch(
        generateUrl("/api/xsolla/xsollaStartEmailAuth", {
          email: data.email,
        }),
      );

      const json = (await response.json()) as unknown;

      const {
        message: { operation_id: operationId },
      } = json as {
        message: { operation_id?: string };
      };

      if (!operationId) {
        const {
          message: { code },
        } = json as {
          message: { code?: string };
        };

        if (code === "010-005") {
          throw new Error();
        }
      }

      return {
        operationId: operationId,
        status: response.status,
      };
    },
  });

  async function onSubmit(data: z.infer<typeof loginRequestSchema>) {
    const toastId = toast.loading("Sending login code...");

    try {
      const response = await mutation.mutateAsync(data);

      if (response.status !== 200) {
        toast.error("Invalid email address", {
          id: toastId,
        });
        return;
      }

      if (!response?.operationId) {
        throw new Error();
      }

      toast.success("Check your email for a login code", {
        id: toastId,
      });

      const searchParams = new URLSearchParams({
        email: data.email,
        operationId: response.operationId,
      });

      router.push(`/auth/verify?${searchParams.toString()}`);
    } catch {
      toast.error("Too many requests, please try again later", {
        id: toastId,
      });
    }
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
                    This is the email used with your{" "}
                    <Link
                      href="https://st-central.net/kabam-cross-connect-guide/"
                      target="_blank"
                      className="underline transition-colors hover:text-primary"
                    >
                      Kabam Cross Connect
                    </Link>{" "}
                    account.
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
