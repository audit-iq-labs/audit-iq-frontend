// src/app/analyze/page.tsx

import { Suspense } from "react";
import AnalyzeClient from "./AnalyzeClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-gray-500">Loading…</div>}>
      <AnalyzeClient />
    </Suspense>
  );
}
