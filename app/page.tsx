import React, { Suspense } from "react";
import ItemsContent from "./ItemsContent";

// This single line tells Vercel to NEVER cache this page.
// It guarantees the page fetches fresh data from my NestJS backend on every single reload.
export const dynamic = "force-dynamic";

export default function ItemPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ItemsContent />
    </Suspense>
  );
}
