import Link, { type LinkProps } from "next/link";
import { cn } from "~/lib/utils";

export default function Logo({
  className,
  ...props
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps) {
  return (
    <Link
      className={cn(
        "mr-6 rounded bg-foreground px-3 py-1 text-2xl font-bold text-background",
        className,
      )}
      {...props}
    >
      STKB
    </Link>
  );
}
