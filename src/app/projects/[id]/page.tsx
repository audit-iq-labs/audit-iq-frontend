import {
  getProjectChecklist,
  getProjectSummary,
  getProjectQuality,
  ProjectChecklistItem,
  ProjectChecklistSummary,
} from "@/lib/api";
import ProjectDashboard from "@/components/ProjectDashboard";
import ProjectOverviewPanel from "@/components/ProjectOverviewPanel";

// Next 13 passes params as a Promise in server components
interface RouteParams {
  id: string;
}

interface Props {
  params: Promise<RouteParams>;
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = id;

  // Fetch everything in parallel
  const [summary, checklist, quality] = await Promise.all([
    getProjectSummary(projectId),
    getProjectChecklist(projectId),
    getProjectQuality(projectId),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* New high-level overview, read-only */}
      <ProjectOverviewPanel
        projectId={projectId}
        summary={summary}
        quality={quality}
      />

      {/* Existing interactive checklist & evidence dashboard */}
      <ProjectDashboard
        projectId={projectId}
        summary={summary}
        checklist={checklist}
      />
    </div>
  );
}
