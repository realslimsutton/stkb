import Link from "next/link";
import { toast } from "sonner";
import { logout } from "~/auth/utils";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "~/components/ui/navigation-menu";
import { getUser } from "~/shop-titans/utils";

export default async function AuthNavigation() {
  const user = await getUser();

  return (
    <>
      {user && (
        <NavigationMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">{user.name}</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-48">
              <DropdownMenuItem
                className="text-destructive"
                onClick={async () => {
                  await logout();

                  toast.success("You have been successfully logged out.");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
      )}

      {!user && (
        <NavigationMenuLink asChild>
          <Button asChild>
            <Link href="/auth/login">Get Started</Link>
          </Button>
        </NavigationMenuLink>
      )}
    </>
  );
}
