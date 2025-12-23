// Applications & Matching API
// Pure focus: /api/applications/* and /api/matching/*
// NO CV, Job, or User operations here!

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/* ==================== Types ==================== */

// Application
export type ApplicationResponse = {
  app_id: number;
  job_id: number;
  candidate_id: number;
  cv_id: number;
  status: "pending" | "viewed" | "interviewing" | "rejected" | "hired";
  created_at: string;
};

// Application with enriched data (from GET endpoints)
export type ApplicationWithDetails = {
  app_id: number;
  job_id: number;
  cv_id: number;
  status: "pending" | "viewed" | "interviewing" | "rejected" | "hired";
  created_at: string;
};

export type ApplicationListResponse = {
  total: number;
  limit: number;
  skip: number;
  applications: ApplicationWithDetails[];
};

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

/* ==================== Helpers ==================== */
function getAuthHeader(): Record<string, string> {
  const t = typeof localStorage !== "undefined"
    ? localStorage.getItem("token")
    : null;

  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function parseOrThrow(res: Response) {
  const txt = await res.text();
  const body = txt ? JSON.parse(txt) : null;

  if (!res.ok) {
    throw {
      status: res.status,
      message: body?.detail ?? res.statusText,
      details: body,
    } as ApiError;
  }

  return body;
}

/* ==================== APPLICATIONS ==================== */

/**
 * Create new application
 * 
 * @param jobId - Job ID to apply for
 * @param candidateId - Candidate ID applying
 * @param cvId - CV ID to submit
 * @param coverLetter - Optional cover letter (max 5000 characters)
 * @returns Created application details
 * @throws ApiError if validation fails (job/candidate/CV not found, duplicate, etc.)
 */
export async function createApplication(
  jobId: number,
  candidateId: number,
  cvId: number,
  coverLetter?: string
): Promise<ApplicationResponse> {
  const res = await fetch(`${BASE}/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      job_id: jobId,
      candidate_id: candidateId,
      cv_id: cvId,
      cover_letter: coverLetter || "",
    }),
  });
  const body = await parseOrThrow(res);
  return body.data;
}

/**
 * Get applications submitted by a candidate
 * 
 * @param candidateId - Candidate ID
 * @param status - Optional status filter (pending, viewed, interviewing, rejected, hired)
 * @param limit - Results per page (1-100, default 50)
 * @param skip - Number of results to skip (pagination)
 * @returns Paginated list of applications
 */
export async function getApplicationsByCandidate(
  candidateId: number,
  status?: "pending" | "viewed" | "interviewing" | "rejected" | "hired",
  limit: number = 50,
  skip: number = 0
): Promise<ApplicationListResponse> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());
  params.append("skip", skip.toString());

  const res = await fetch(
    `${BASE}/applications/candidate/${candidateId}?${params.toString()}`,
    {
      method: "GET",
      headers: { ...getAuthHeader() },
    }
  );
  const body = await parseOrThrow(res);
  return body.data;
}

/**
 * Get applications for a job (recruiter view)
 * 
 * @param jobId - Job ID
 * @param status - Optional status filter (pending, viewed, interviewing, rejected, hired)
 * @param limit - Results per page (1-100, default 50)
 * @param skip - Number of results to skip (pagination)
 * @returns Paginated list of applications
 */
export async function getApplicationsByJob(
  jobId: number,
  status?: "pending" | "viewed" | "interviewing" | "rejected" | "hired",
  limit: number = 50,
  skip: number = 0
): Promise<ApplicationListResponse> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());
  params.append("skip", skip.toString());

  const res = await fetch(
    `${BASE}/applications/job/${jobId}?${params.toString()}`,
    {
      method: "GET",
      headers: { ...getAuthHeader() },
    }
  );
  const body = await parseOrThrow(res);
  return body.data;
}

/**
 * Update application status
 * 
 * @param appId - Application ID
 * @param status - New status (pending, viewed, interviewing, rejected, hired)
 * @returns Updated application
 * @throws ApiError if status is invalid or application not found
 */
export async function updateApplicationStatus(
  appId: number,
  status: "pending" | "viewed" | "interviewing" | "rejected" | "hired"
): Promise<ApplicationResponse> {
  const res = await fetch(`${BASE}/applications/${appId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({ status }),
  });
  const body = await parseOrThrow(res);
  return body.data;
}

/**
 * Delete an application
 * 
 * @param appId - Application ID to delete
 * @returns Success message
 * @throws ApiError if application not found
 */
export async function deleteApplication(appId: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/applications/${appId}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  const body = await parseOrThrow(res);
  return body.data ?? { message: "Application deleted successfully" };
}

/* ==================== MATCHING TYPES ==================== */

// Base match result (what's stored in DB)
export type MatchResult = {
  match_id: number;
  cv_id: number;
  job_id: number;
  score: number;
  metadata: {
    cosine_ann?: number;
    weighted_sim?: number;
    llm_score?: number;
    reason?: string;
  };
  created_at: string;
  updated_at: string;
};

// CV Summary (enriched data for job matches)
export type CVSummary = {
  title: string;
  location?: string;
  experience?: string;
  skills: string[];
  user_id: number;
};

// Job Summary (enriched data for CV matches)
export type JobSummary = {
  title: string;
  role: string;
  location?: string;
  job_type?: string;
  experience_level?: string;
  skills: string[];
  recruiter_id: number;
};

// Match with CV details (for recruiters viewing job matches)
export type MatchWithCV = {
  match_id: number;
  cv_id: number;
  score: number;
  metadata: {
    cosine_ann?: number;
    weighted_sim?: number;
    llm_score?: number;
    reason?: string;
  };
  created_at: string;
  updated_at: string;
  cv: CVSummary;  // Enriched on-the-fly from backend
};

// Match with Job details (for candidates viewing CV matches)
export type MatchWithJob = {
  match_id: number;
  job_id: number;
  score: number;
  metadata: {
    cosine_ann?: number;
    weighted_sim?: number;
    llm_score?: number;
    reason?: string;
  };
  created_at: string;
  updated_at: string;
  job: JobSummary;  // Enriched on-the-fly from backend
};

// List responses
export type JobMatchesResponse = {
  total: number;
  matches: MatchWithCV[];
};

export type CVMatchesResponse = {
  total: number;
  matches: MatchWithJob[];
};

// Run matching response
export type MatchSummary = {
  match_id: number;
  cv_id?: number;
  job_id?: number;
  score: number;
  reason: string;
};

export type RunMatchingResponse = {
  cv_id?: number;
  job_id?: number;
  total_found: number;
  total_saved: number;
  min_score: number;
  matches: MatchSummary[];  // Top 10 preview
};

/* ==================== MATCHING API FUNCTIONS ==================== */

/**
 * Run matching for a CV - find matching jobs and store results
 */
export async function runMatchingForCv(
  cvId: number,
  topK: number = 50,
  minScore: number = 0.7
): Promise<RunMatchingResponse> {
  const res = await fetch(`${BASE}/matching/cv/${cvId}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      top_k: topK,
      min_score: minScore,
    }),
  });
  return await parseOrThrow(res);
}

/**
 * Run matching for a Job - find matching CVs and store results
 */
export async function runMatchingForJob(
  jobId: number,
  topK: number = 50,
  minScore: number = 0.7
): Promise<RunMatchingResponse> {
  const res = await fetch(`${BASE}/matching/job/${jobId}/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({
      top_k: topK,
      min_score: minScore,
    }),
  });
  return await parseOrThrow(res);
}

/**
 * Get matches for a CV with enriched Job data
 * Backend enriches data on-the-fly
 */
export async function getMatchesForCv(
  cvId: number,
  minScore: number = 0.0,
  limit: number = 50,
  skip: number = 0
): Promise<CVMatchesResponse> {
  const params = new URLSearchParams();
  params.append("min_score", minScore.toString());
  params.append("limit", limit.toString());
  params.append("skip", skip.toString());

  const res = await fetch(
    `${BASE}/matching/cv/${cvId}/matches?${params.toString()}`,
    {
      method: "GET",
      headers: { ...getAuthHeader() },
    }
  );
  return await parseOrThrow(res);
}

/**
 * Get matches for a Job with enriched CV data
 * Backend enriches data on-the-fly
 */
export async function getMatchesForJob(
  jobId: number,
  minScore: number = 0.0,
  limit: number = 50,
  skip: number = 0
): Promise<JobMatchesResponse> {
  const params = new URLSearchParams();
  params.append("min_score", minScore.toString());
  params.append("limit", limit.toString());
  params.append("skip", skip.toString());

  const res = await fetch(
    `${BASE}/matching/job/${jobId}/matches?${params.toString()}`,
    {
      method: "GET",
      headers: { ...getAuthHeader() },
    }
  );
  return await parseOrThrow(res);
}

/**
 * Delete all matches for a CV
 */
export async function deleteMatchesForCv(cvId: number): Promise<{ deleted_count: number }> {
  const res = await fetch(`${BASE}/matching/cv/${cvId}/matches`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  const body = await parseOrThrow(res);
  return body.data;
}

/**
 * Delete all matches for a Job
 */
export async function deleteMatchesForJob(jobId: number): Promise<{ deleted_count: number }> {
  const res = await fetch(`${BASE}/matching/job/${jobId}/matches`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  const body = await parseOrThrow(res);
  return body.data;
}