import ProjectDashboard, {
  Summary,
  ChecklistItem,
} from "@/components/ProjectDashboard";
import { apiGet } from "@/lib/api";

interface Props {
  params: { id: string };
}

export default async function ProjectPage({ params }: Props) {
  const { id: projectId } = await params;  // ✅ params is a Promise

  const summary = await apiGet<Summary>(`/projects/${projectId}/summary`);
  const checklist = await apiGet<ChecklistItem[]>(`/projects/${projectId}/checklist`);

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
