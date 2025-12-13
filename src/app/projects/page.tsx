// src/app/projects/page.tsx
import Link from "next/link";
import { getProjects } from "@/lib/api/projects";
import { ProjectListItem } from "@/lib/api/types";

export const dynamic = "force-dynamic"; // keep list fresh while we iterate

export default async function ProjectsIndexPage() {
  let projects: ProjectListItem[] | null = null;

  try {
    projects = await getProjects();
  } catch (err) {
    console.error("Failed to load projects", err);
  }

  const isEmpty = projects && projects.length === 0;

  return (
    <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-600">
            Select a project to view its AI Act checklist and evidence.
          </p>
        </div>

        <Link
          href="/projects/new"
          className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
        >
          + New project
        </Link>
      </header>

      <section className="bg-white rounded-xl shadow-sm border">
        <div className="border-b px-4 py-3">
          <h2 className="text-sm font-semibold">Project list</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2 w-1/2">Project</th>
                <th className="text-left px-4 py-2">Created</th>
                <th className="text-left px-4 py-2">Risk category</th>
                <th className="text-right px-4 py-2">Actions</th>
              </tr>
            </thead>

            {/* Hydration-safe tbody (same structure on server and client) */}
            <tbody>
              {/* SERVER + CLIENT ALWAYS RENDER ONE ROW FIRST */}
              {projects === null ? (
                // Loading state (SSR + CSR identical)
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-sm text-gray-500 text-center"
                  >
                    Loading projects…
                  </td>
                </tr>
              ) : isEmpty ? (
                // Empty state
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-sm text-gray-500 text-center"
                  >
                    No projects yet. Create your first project to start tracking
                    compliance work.
                  </td>
                </tr>
              ) : (
                // Actual project rows
                projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{p.name}</div>
                    </td>

                    <td className="px-4 py-3 align-top">
                      {/* Stable value to avoid timezone mismatches */}
                      {p.created_at?.slice(0, 10) ?? ""}
                    </td>

                    <td className="px-4 py-3 align-top">
                      {p.risk_category ?? "—"}
                    </td>

                    <td className="px-4 py-3 align-top text-right">
                      <Link
                        href={`/projects/${p.id}`}
                        className="text-xs text-blue-600 underline"
                      >
                        View project
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
