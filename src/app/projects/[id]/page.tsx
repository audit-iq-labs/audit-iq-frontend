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

      <ProjectDashboard
        projectId={projectId}
        summary={checklistSummary}
        checklist={checklist}
        onImportAiActTitleIV={handleImportAiActTitleIV}
      />
    </div>
  );
}
