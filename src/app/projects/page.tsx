// src/app/projects/page.tsx
import Link from "next/link";
import { getProjects, Project } from "@/lib/api";

export const dynamic = "force-dynamic"; // avoid stale list while we iterate

export default async function ProjectsIndexPage() {
  let projects: Project[] = [];

  try {
    projects = await getProjects();
  } catch (err) {
    console.error("Failed to load projects", err);
  }

  return (
    <main className="max-w-5xl mx-auto py-8 space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
          <p className="text-sm text-gray-600">
            Select a project to view its AI Act compliance checklist.
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          New project
        </Link>
      </header>

      <section className="border rounded-lg bg-white shadow-sm">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Regulation</th>
              <th className="p-3 border-b w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-gray-500 text-sm"
                >
                  No projects yet. Once you ingest a regulation and create a
                  project in the backend, it will show up here.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="p-3">
                    <div className="font-medium">{p.name}</div>
                    {p.created_at && (
                      <div className="text-xs text-gray-500">
                        Created{" "}
                        {new Date(p.created_at).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    {p.regulation ?? "AI Act – Title IV"}
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/projects/${p.id}`}
                      className="text-xs text-blue-600 underline"
                    >
                      View checklist
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </main>
  );
}
