import React, { Suspense } from "react";
import ItemsContent from "./ItemsContent";

export default function ItemPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ItemsContent />
    </Suspense>
  );
}
