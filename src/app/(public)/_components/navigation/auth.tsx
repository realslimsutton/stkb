import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "~/components/ui/navigation-menu";
import { getUser } from "~/shop-titans/utils";
import AuthUserDropdown from "./auth-user-dropdown";

export default async function AuthNavigation() {
  const user = await getUser();

  return (
    <>
      {user && (
        <NavigationMenuItem>
          <AuthUserDropdown name={user.name} />
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
