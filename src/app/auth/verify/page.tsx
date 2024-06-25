import { type SearchParams } from "~/types";
import { searchParamsSchema } from "./_lib/schema";
import { redirect } from "next/navigation";
import VerificationForm from "./_components/verification-form";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const parsedSearchParams =
    await searchParamsSchema.safeParseAsync(searchParams);

  if (!parsedSearchParams.success || !parsedSearchParams.data) {
    redirect("/auth/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <VerificationForm
        email={parsedSearchParams.data.email}
        operationId={parsedSearchParams.data.operationId}
      />
    </div>
  );
}
