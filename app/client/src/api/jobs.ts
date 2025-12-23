// Job-related endpoints
// Fixed: Backend returns job_id, not id

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export type JobPostRequest = {
  title: string;
  role: string;
  location: string;
  job_type: string;
  experience_level: string;
  skills?: string[];
  salary_min?: number | null;
  salary_max?: number | null;
  full_text?: string | null;
  pdf_url?: string | null;
};

// Backend response uses job_id, not id
export type JobPostResponse = {
  job_id: number;  // ✅ Changed from id
  recruiter_id: number;
  title: string;
  role: string;
  location: string;
  job_type: string;
  experience_level: string;
  skills: string[];
  salary_min?: number | null;
  salary_max?: number | null;
  full_text?: string | null;
  pdf_url?: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiError = { status: number; message: string; details?: any };

function getAuthHeader(): Record<string, string> {
  const t = typeof localStorage !== "undefined"
    ? localStorage.getItem("token")
    : null;

  return t ? { Authorization: `Bearer ${t}` } : {};
}


async function parseOrThrow(res: Response) {
  const txt = await res.text();
  const body = txt ? JSON.parse(txt) : null;
  if (!res.ok) throw { status: res.status, message: body?.detail ?? res.statusText, details: body } as ApiError;
  return body;
}

/* ===========================================
   POST /jobs/create/{recruiter_id}
   Create job manually with structured data
=========================================== */
export async function createJob(recruiterId: number, payload: JobPostRequest): Promise<JobPostResponse> {
  const res = await fetch(`${BASE}/jobs/create/${encodeURIComponent(String(recruiterId))}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(res);
}

/* ===========================================
   POST /jobs/upload/{recruiter_id}
   Upload job from file (PDF or text)
=========================================== */
export async function uploadJobFile(recruiterId: number, file: File, metadata?: Partial<JobPostRequest>): Promise<JobPostResponse> {
  const fd = new FormData();
  fd.append("file", file);
  
  // Add optional metadata fields
  if (metadata) {
    if (metadata.title) fd.append("title", metadata.title);
    if (metadata.role) fd.append("role", metadata.role);
    if (metadata.location) fd.append("location", metadata.location);
    if (metadata.job_type) fd.append("job_type", metadata.job_type);
    if (metadata.experience_level) fd.append("experience_level", metadata.experience_level);
    if (metadata.salary_min !== undefined) fd.append("salary_min", String(metadata.salary_min));
    if (metadata.salary_max !== undefined) fd.append("salary_max", String(metadata.salary_max));
  }

  const res = await fetch(`${BASE}/jobs/upload/${encodeURIComponent(String(recruiterId))}`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: fd,
  });
  return parseOrThrow(res);
}

/* ===========================================
   POST /jobs/upload-text/{recruiter_id}
   Upload job from plain text description
=========================================== */
export async function uploadJobText(
  recruiterId: number,
  fullText: string,
  metadata?: {
    title?: string;
    role?: string;
    location?: string;
    job_type?: string;
    experience_level?: string;
    salary_min?: number | null;
    salary_max?: number | null;
  }
): Promise<JobPostResponse> {
  const fd = new FormData();
  fd.append("full_text", fullText);
  
  if (metadata) {
    if (metadata.title) fd.append("title", metadata.title);
    if (metadata.role) fd.append("role", metadata.role);
    if (metadata.location) fd.append("location", metadata.location);
    if (metadata.job_type) fd.append("job_type", metadata.job_type);
    if (metadata.experience_level) fd.append("experience_level", metadata.experience_level);
    if (metadata.salary_min !== undefined) fd.append("salary_min", String(metadata.salary_min));
    if (metadata.salary_max !== undefined) fd.append("salary_max", String(metadata.salary_max));
  }

  const res = await fetch(`${BASE}/jobs/upload-text/${encodeURIComponent(String(recruiterId))}`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: fd,
  });
  return parseOrThrow(res);
}

/* ===========================================
   GET /jobs
   Get all jobs
=========================================== */
export async function listJobs(): Promise<JobPostResponse[]> {
  const res = await fetch(`${BASE}/jobs`, { method: "GET", headers: { ...getAuthHeader() } });
  return parseOrThrow(res);
}

/* ===========================================
   GET /jobs/{job_id}
   Get single job
=========================================== */
export async function getJob(jobId: number): Promise<JobPostResponse> {
  const res = await fetch(`${BASE}/jobs/${encodeURIComponent(String(jobId))}`, { 
    method: "GET", 
    headers: { ...getAuthHeader() } 
  });
  return parseOrThrow(res);
}

/* ===========================================
   GET /jobs/recruiter/{recruiter_id}
   Get all jobs from a recruiter
=========================================== */
export async function getRecruiterJobs(recruiterId: number): Promise<JobPostResponse[]> {
  const res = await fetch(`${BASE}/jobs/recruiter/${encodeURIComponent(String(recruiterId))}`, { 
    method: "GET", 
    headers: { ...getAuthHeader() } 
  });
  return parseOrThrow(res);
}

/* ===========================================
   PUT /jobs/{job_id}
   Update job
=========================================== */
export async function updateJob(jobId: number, payload: JobPostRequest): Promise<JobPostResponse> {
  const res = await fetch(`${BASE}/jobs/${encodeURIComponent(String(jobId))}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });
  return parseOrThrow(res);
}

/* ===========================================
   DELETE /jobs/{job_id}
   Delete job
=========================================== */
export async function deleteJob(jobId: number): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/jobs/${encodeURIComponent(String(jobId))}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });
  return parseOrThrow(res);
}

/* ===========================================
   GET /jobs/match/{job_id}/cvs
   Find matching CVs for a job
=========================================== */
export async function findMatchingCvs(jobId: number, topK: number = 5): Promise<any[]> {
  const res = await fetch(`${BASE}/jobs/match/${jobId}/cvs?top_k=${topK}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });
  return parseOrThrow(res);
}

/* ===========================================
   GET /jobs/match/{job_id}/cvs/{cv_id}
   Get detailed match score between job and CV
=========================================== */
export async function getJobCvMatch(jobId: number, cvId: number): Promise<any> {
  const res = await fetch(`${BASE}/jobs/match/${jobId}/cvs/${cvId}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });
  return parseOrThrow(res);
}