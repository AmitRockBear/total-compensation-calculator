import { Suspense } from "react";

import { CompensationRoot } from "./_components/compensation/compensation-root";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <CompensationRoot />
    </Suspense>
  );
}
