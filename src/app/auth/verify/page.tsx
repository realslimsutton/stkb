import { type SearchParams } from "~/types";
import { searchParamsSchema } from "./_lib/schema";
import { redirect } from "next/navigation";
import VerificationForm from "./_components/verification-form";
import { getUser } from "~/shop-titans/utils";

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

  const user = await getUser();
  if (user) {
    redirect("/");
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
