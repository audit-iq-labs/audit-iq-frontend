// src/app/projects/[id]/page.tsx
import ProjectOverviewPanel from "@/components/ProjectOverviewPanel";
import ProjectDashboard from "@/components/ProjectDashboard";
import {
  getProjectSummary,
  getProjectChecklistSummary,
  getProjectChecklist,
  getProjectQuality,
  importAiActTitleIV,
} from "@/lib/api";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import Link from "next/link";

interface RouteParams {
  id: string;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<RouteParams>; // ✅ back to Promise (works with your setup)
}) {
  // Next will pass { id: "<uuid>" } here; awaiting the Promise is harmless.
  const { id: projectId } = await params;

  if (!projectId) {
    // Extra safety: never call the backend with "undefined" again
    notFound();
  }

  // ✅ Server action passed down into the client component
  async function handleImportAiActTitleIV() {
    "use server";

    await importAiActTitleIV(projectId);
    revalidatePath(`/projects/${projectId}`);
  }

  // Fetch everything in parallel for this projectId
  const [summary, checklistSummary, checklist, quality] = await Promise.all([
    getProjectSummary(projectId),
    getProjectChecklistSummary(projectId),
    getProjectChecklist(projectId),
    getProjectQuality(projectId),
  ]);

    return (
    <div className="space-y-6">
      <ProjectOverviewPanel
        projectId={projectId}
        summary={summary}
        quality={quality}
      />

      <div className="space-y-3">
        {/* Top-right CTA to run single-document analysis */}
        <div className="flex justify-end">
          <Link
            href={`/analyze?projectId=${projectId}`}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            Run single-document check
          </Link>
        </div>

        <ProjectDashboard
          projectId={projectId}
          summary={checklistSummary}
          checklist={checklist}
          onImportAiActTitleIV={handleImportAiActTitleIV}
        />
      </div>
    </div>
  );
}
