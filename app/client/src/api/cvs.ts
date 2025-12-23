const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

/*
  Frontend types (camelCase)
*/
export type Cv = {
  id: number;
  userId: number;
  title: string;
  location?: string | null;
  experience?: string | null;
  skills: string[];
  summary?: string | null;
  fullText?: string | null;
  pdfUrl?: string | null;
  isMain?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CvCreatePayload = {
  title: string;
  location?: string | null;
  experience?: string | null;
  skills?: string[];
  summary?: string | null;
  fullText?: string | null;
  pdfUrl?: string | null;
  isMain?: boolean;
};

export type CvUpdatePayload = Partial<CvCreatePayload>;

export type StatusResponse = { status: string };
export type ApiError = { status: number; message: string; details?: unknown };


function getAuthHeader(): Record<string, string> {
  try {
    const t = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch { return {}; }
}


/* Backend (snake_case) */
type BackendCv = {
  cv_id: number;
  user_id: number;
  title: string;
  location?: string | null;
  experience?: string | null;
  skills: string[];
  summary?: string | null;
  full_text?: string | null;
  pdf_url?: string | null;
  is_main?: boolean;
  created_at: string;
  updated_at: string;
};

function mapBackendCv(b: BackendCv): Cv {
  return {
    id: b.cv_id,
    userId: b.user_id,
    title: b.title,
    location: b.location ?? null,
    experience: b.experience ?? null,
    skills: Array.isArray(b.skills) ? b.skills : [],
    summary: b.summary ?? null,
    fullText: b.full_text ?? null,
    pdfUrl: b.pdf_url ?? null,
    isMain: b.is_main ?? false,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  };
}

function buildSnakePayload(payload: CvCreatePayload | CvUpdatePayload): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (payload.title !== undefined) out.title = payload.title;
  if (payload.location !== undefined) out.location = payload.location;
  if (payload.experience !== undefined) out.experience = payload.experience;
  if (payload.skills !== undefined) out.skills = payload.skills;
  if (payload.summary !== undefined) out.summary = payload.summary;
  if (payload.fullText !== undefined) out.full_text = payload.fullText;
  if (payload.pdfUrl !== undefined) out.pdf_url = payload.pdfUrl;
  if (payload.isMain !== undefined) out.is_main = payload.isMain;
  return out;
}


/* ===========================================
   POST /cv/create/{user_id}
=========================================== */
export async function createCv(userId: number, payload: CvCreatePayload): Promise<Cv> {
  try {
    const res = await fetch(`${BASE}/cv/create/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(buildSnakePayload(payload)),
    });
    const json = await res.json();
    if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
    return mapBackendCv(json as BackendCv);
  } catch (err) {
    throw { status: 0, message: "Network error", details: err };
  }
}


/* ===========================================
   GET /cv/{cv_id}
=========================================== */
export async function getCv(id: number): Promise<Cv> {
  const res = await fetch(`${BASE}/cv/${id}`, { headers: getAuthHeader() });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return mapBackendCv(json as BackendCv);
}


/* ===========================================
   GET /cv/user/{user_id}
=========================================== */
export async function getUserCvs(userId: number): Promise<Cv[]> {
  const res = await fetch(`${BASE}/cv/user/${userId}`, { headers: getAuthHeader() });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return (json as BackendCv[]).map(mapBackendCv);
}


/* ===========================================
   GET /cv/main/user/{user_id}
=========================================== */
export async function getMainCv(userId: number): Promise<Cv> {
  const res = await fetch(`${BASE}/cv/main/user/${userId}`, { headers: getAuthHeader() });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return mapBackendCv(json as BackendCv);
}


/* ===========================================
   PUT /cv/{cv_id}
=========================================== */
export async function updateCv(id: number, payload: CvUpdatePayload): Promise<Cv> {
  const res = await fetch(`${BASE}/cv/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(buildSnakePayload(payload)),
  });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return mapBackendCv(json as BackendCv);
}


/* ===========================================
   DELETE /cv/{cv_id}
=========================================== */
export async function deleteCv(id: number): Promise<StatusResponse> {
  const res = await fetch(`${BASE}/cv/${id}`, { method: "DELETE", headers: getAuthHeader() });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return { status: "ok" };
}


/* ===========================================
   POST /cv/upload/{user_id}
   Upload from PDF or text file
=========================================== */
export async function uploadCv(userId: number, file: File, isMain = false): Promise<Cv> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("is_main", String(isMain));

  const res = await fetch(`${BASE}/cv/upload/${userId}`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: fd,
  });

  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };

  return mapBackendCv(json as BackendCv);
}


/* ===========================================
   POST /cv/upload-text/{user_id}
   Upload from plain text
=========================================== */
export async function uploadCvText(userId: number, fullText: string, title?: string, isMain = false): Promise<Cv> {
  const fd = new FormData();
  fd.append("full_text", fullText);
  if (title) fd.append("title", title);
  fd.append("is_main", String(isMain));

  const res = await fetch(`${BASE}/cv/upload-text/${userId}`, {
    method: "POST",
    headers: { ...getAuthHeader() },
    body: fd,
  });

  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };

  return mapBackendCv(json as BackendCv);
}


/* ===========================================
   GET /cv/match/{cv_id}/jobs
   Find matching jobs for a CV
=========================================== */
export async function findMatchingJobs(cvId: number, topK: number = 5): Promise<any[]> {
  const res = await fetch(`${BASE}/cv/match/${cvId}/jobs?top_k=${topK}`, { 
    headers: getAuthHeader() 
  });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return json as any[];
}


/* ===========================================
   GET /cv/match/{cv_id}/jobs/{job_id}
   Get detailed match score between CV and Job
=========================================== */
export async function getCvJobMatch(cvId: number, jobId: number): Promise<any> {
  const res = await fetch(`${BASE}/cv/match/${cvId}/jobs/${jobId}`, { 
    headers: getAuthHeader() 
  });
  const json = await res.json();
  if (!res.ok) throw { status: res.status, message: json?.detail, details: json };
  return json;
}