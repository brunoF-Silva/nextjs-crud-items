import React, { Suspense } from "react";
import ClientsContent from "./ClientsContent";

export default function ClientsPage() {
  return (
    <Suspense fallback={<p>Loading clients...</p>}>
      <ClientsContent />
    </Suspense>
  );
}