// src/lib/api/index.ts

// Types live here (single source of truth)
export * from "./types";
export * from "./quality";

// Low-level HTTP helpers
export { API_BASE_URL, apiGet, apiPost, apiPut, apiDelete } from "./client";

// Projects
export {
  getProjects,
  createProject,
  getProjectSummary,
  getProjectActivity,
} from "./projects";

// ✅ Your projects module exports this name
export { importAiActTitleIV } from "./projects";

// ✅ Backwards-compatible alias (what your UI/tests were using earlier)
export { importAiActTitleIV as importAiActChecklist } from "./projects";

// Checklist (these exist in checklist.ts)
export {
  getProjectChecklist,
  getProjectChecklistSummary,
  getProjectChecklistWithEvidence,
  updateChecklistItem, // we'll add this in checklist.ts below
} from "./checklist";

// Evidence (we’ll add these in evidence.ts below)
export {
  listEvidence,
  addEvidenceUrl,
  deleteEvidence,
  uploadEvidenceFile,
} from "./evidence";

// Documents / analysis (these exist in documents.ts)
export {
  uploadAnalysisDocument,
  analyzeDocument,
  getDocumentAnalysis,
  getDocumentGapSummary,
  getProjectDocuments,
} from "./documents";

// ✅ Backwards-compatible alias for older imports
export { getProjectDocuments as listProjectDocuments } from "./documents";
