import {
  getProjectChecklist,
  getProjectSummary,
  ProjectChecklistItem,
  ProjectChecklistSummary,
} from "@/lib/api";
import ProjectDashboard from "@/components/ProjectDashboard";

// Next 16 passes params as a Promise in server components
interface RouteParams {
  id: string;
}

interface Props {
  params: Promise<RouteParams>;
}

export default async function ProjectPage({ params }: Props) {
  // 🔑 unwrap the Promise to get the actual params object
  const { id: projectId } = await params;

  const [summary, checklist] = await Promise.all([
    getProjectSummary(projectId),
    getProjectChecklist(projectId),
  ]);

  return (
    <div className="max-w-5xl mx-auto">
      <ProjectDashboard
        projectId={projectId}
        summary={summary}
        checklist={checklist}
      />
    </div>
  );
}
