import Image from "next/image";
import * as React from "react";
import { cn } from "~/lib/utils";

type AvatarProps = {
  src?: string | null;
  rounded?: boolean;
} & Omit<React.ComponentPropsWithRef<typeof Image>, "src">;
export default function Avatar({
  src,
  rounded = true,
  className,
  height,
  width,
  alt,
  ...props
}: AvatarProps) {
  const fallbackUrl = () => {
    const searchParams = new URLSearchParams({
      name: alt,
      color: "ebebeb",
      background: "36333b",
    });

    return `https://ui-avatars.com/api/?${searchParams.toString()}`;
  };
  return (
    <Image
      src={src ?? fallbackUrl()}
      alt={alt}
      height={height ?? 40}
      width={width ?? 40}
      className={cn(
        "max-w-none object-cover object-center",
        {
          "rounded-full": rounded,
        },
        className,
      )}
      {...props}
    />
  );
}
