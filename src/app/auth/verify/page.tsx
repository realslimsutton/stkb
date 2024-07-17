import VerificationForm from "./_components/verification-form";
import * as React from "react";

export default async function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <React.Suspense fallback={null}>
        <VerificationForm />
      </React.Suspense>
    </div>
  );
}
