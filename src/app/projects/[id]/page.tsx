// src/app/projects/[id]/page.tsx
import ProjectOverviewPanel from "@/components/ProjectOverviewPanel";
import ProjectDashboard from "@/components/ProjectDashboard";
import {
  getProjectSummary,
  getProjectChecklistSummary,
  getProjectChecklist,
  getProjectQuality,
} from "@/lib/api";

interface RouteParams {
  id: string;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { id: projectId } = await params;

  // Fetch everything in parallel
  const [summary, checklistSummary, checklist, quality] = await Promise.all([
    getProjectSummary(projectId),         // rich ProjectSummary
    getProjectChecklistSummary(projectId),// ProjectChecklistSummary
    getProjectChecklist(projectId),       // detailed items
    getProjectQuality(projectId),         // quality/gaps
  ]);

  return (
    <div className="space-y-6">
      {/* Top overview header + KPI cards */}
      <ProjectOverviewPanel
        projectId={projectId}
        summary={summary}
        quality={quality}
      />

      {/* Checklist + status table */}
      <ProjectDashboard
        projectId={projectId}
        summary={checklistSummary}   // ✅ now a proper ProjectChecklistSummary
        checklist={checklist}
      />
    </div>
  );
}
