// src/app/projects/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "@/lib/api";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [jurisdiction, setJurisdiction] = useState<string | null>("EU");
  const [regulation, setRegulation] = useState<string | null>("AI_ACT");
  const [riskCategory, setRiskCategory] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const project = await createProject({
        name: name.trim(),
        jurisdiction,
        regulation,
        risk_category: riskCategory,
      });

      // On success, go straight to the detail page
      router.push(`/projects/${project.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Create new project
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Define a new AI system or product you want to keep compliant.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-xl p-4 bg-white">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Project name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g. AI Hiring Assistant"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Jurisdiction
          </label>
          <select
            value={jurisdiction ?? ""}
            onChange={(e) => setJurisdiction(e.target.value || null)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="EU">EU</option>
            <option value="DE">Germany (DE)</option>
            <option value="AU">Australia (AU)</option>
            <option value="">Other / not specified</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Primary regulation
          </label>
          <select
            value={regulation ?? ""}
            onChange={(e) => setRegulation(e.target.value || null)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="AI_ACT">EU AI Act</option>
            <option value="GDPR">GDPR</option>
            <option value="">Other / not specified</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Risk category (optional)
          </label>
          <select
            value={riskCategory ?? ""}
            onChange={(e) => setRiskCategory(e.target.value || null)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Not set</option>
            <option value="minimal">Minimal risk</option>
            <option value="limited">Limited risk</option>
            <option value="high">High risk</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isSubmitting ? "Creating…" : "Create project"}
          </button>
        </div>
      </form>
    </div>
  );
}
