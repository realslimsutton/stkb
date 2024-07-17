"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "~/auth/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function AuthUserDropdown({ name }: { name: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">{name}</Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem
          className="text-destructive"
          onClick={async () => {
            await logout();

            toast.success("You have been successfully logged out.", {
              action: {
                label: "Login",
                onClick: () => router.push("/auth/login"),
              },
            });

            router.push("/");
          }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
