import * as React from "react";

export default function PageHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex w-full items-center justify-center py-32 sm:pb-24 sm:pt-44">
      <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
        {children}
      </h1>
    </section>
  );
}
