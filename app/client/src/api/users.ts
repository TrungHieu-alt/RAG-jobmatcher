// User read/delete + profile creation + profile fetch/update.
// Types are local to this file.

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export type Role = "candidate" | "recruiter" | null;

export type UserResponse = {
  user_id: number;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type ApiError = {
  status: number;
  message: string;
  details?: any;
};

function getAuthHeader(): Record<string, string> {
  const t =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;

  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function parseOrThrow(res: Response) {
  const txt = await res.text();
  const body = txt ? JSON.parse(txt) : null;
  if (!res.ok)
    throw {
      status: res.status,
      message: body?.detail ?? res.statusText,
      details: body,
    } as ApiError;
  return body;
}

// ======================================================
// =============== USER BASIC ROUTES ====================
// ======================================================

export async function getUser(userId: number): Promise<UserResponse> {
  const res = await fetch(`${BASE}/users/${encodeURIComponent(String(userId))}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });
  return parseOrThrow(res);
}

export async function updateUserRole(
  userId: number,
  role: "candidate" | "recruiter"
) {
  const res = await fetch(`${BASE}/users/${userId}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ role }),
  });
  return parseOrThrow(res);
}

export async function deleteUser(
  userId: number
): Promise<{ message: string }> {
  const res = await fetch(`${BASE}/users/${encodeURIComponent(String(userId))}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return parseOrThrow(res);
}

// ======================================================
// ================== LIST CANDIDATES ===================
// ======================================================

export type ListCandidate = {
  user_id: number;
  full_name: string | null;
  location: string | null;
  experience_years: string | null;
  skills: string[] | null;
  summary: string | null;
};

export async function listCandidates(): Promise<ListCandidate[]> {
  const res = await fetch(`${BASE}/candidate/profiles`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });
  return parseOrThrow(res);
}

// ======================================================
// ================== CANDIDATE PROFILE =================
// ======================================================

// Convert "5-7" → "5", "10+" → "10"
function normalizeExperience(exp?: string | null): string | null {
  if (!exp) return null;

  exp = exp.trim();

  if (exp.endsWith("+")) {
    const base = parseInt(exp.replace("+", "").trim(), 10);
    return isNaN(base) ? null : String(base);
  }

  if (exp.includes("-")) {
    const [min] = exp.split("-");
    const base = parseInt(min.trim(), 10);
    return isNaN(base) ? null : String(base);
  }

  const num = parseInt(exp, 10);
  return isNaN(num) ? null : String(num);
}

export interface CandidateProfilePayload {
  full_name: string | null;
  location: string | null;
  experience_years: string | null;
  skills: string[] | null;
  summary: string | null;
}

export type CandidateProfileResponse = CandidateProfilePayload;

// ---------- CREATE ----------
export async function createCandidateProfile(
  userId: number,
  data: {
    full_name?: string;
    location?: string;
    experience?: string;
    skills?: string[];
    bio?: string;
  }
) {
  const payload: CandidateProfilePayload = {
    full_name: data.full_name ?? "blank",
    location: data.location ?? null,
    experience_years: normalizeExperience(data.experience),
    skills: data.skills ?? null,
    summary: data.bio ?? null,
  };

  const res = await fetch(`${BASE}/candidate/profile/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });

  return parseOrThrow(res);
}

// ---------- GET ----------
export async function getCandidateProfile(
  userId: number
): Promise<CandidateProfileResponse> {
  const res = await fetch(`${BASE}/candidate/profile/${userId}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  return parseOrThrow(res);
}

// ---------- UPDATE ----------
export async function updateCandidateProfile(
  userId: number,
  data: {
    full_name?: string | null;
    location?: string | null;
    experience?: string | null;
    skills?: string[] | null;
    bio?: string | null;
  }
) {
  const payload: CandidateProfilePayload = {
    full_name: data.full_name ?? null,
    location: data.location ?? null,
    experience_years: normalizeExperience(data.experience),
    skills: data.skills ?? null,
    summary: data.bio ?? null,
  };

  const res = await fetch(`${BASE}/candidate/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });

  return parseOrThrow(res);
}

// ======================================================
// ================== RECRUITER PROFILE =================
// ======================================================

export interface RecruiterProfilePayload {
  company_name: string | null;
  recruiter_title: string | null;
  company_logo: string | null;
  about_company: string | null;
  hiring_fields: string[] | null;
}

export type RecruiterProfileResponse = RecruiterProfilePayload;

// ---------- CREATE ----------
export async function createRecruiterProfile(
  userId: number,
  data: {
    companyName?: string;
    title?: string;
    companyLogo?: string | null;
    companyDescription?: string;
    hiringIndustry?: string[];
  }
) {
  const payload: RecruiterProfilePayload = {
    company_name: data.companyName ?? null,
    recruiter_title: data.title ?? null,
    company_logo: data.companyLogo ?? null,
    about_company: data.companyDescription ?? null,
    hiring_fields: data.hiringIndustry ?? null,
  };

  const res = await fetch(`${BASE}/recruiter/profile/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });

  return parseOrThrow(res);
}

// ---------- GET ----------
export async function getRecruiterProfile(
  userId: number
): Promise<RecruiterProfileResponse> {
  const res = await fetch(`${BASE}/recruiter/profile/${userId}`, {
    method: "GET",
    headers: { ...getAuthHeader() },
  });

  return parseOrThrow(res);
}

// ---------- UPDATE ----------
export async function updateRecruiterProfile(
  userId: number,
  data: {
    companyName?: string | null;
    title?: string | null;
    companyLogo?: string | null;
    companyDescription?: string | null;
    hiringIndustry?: string[] | null;
  }
) {
  const payload: RecruiterProfilePayload = {
    company_name: data.companyName ?? null,
    recruiter_title: data.title ?? null,
    company_logo: data.companyLogo ?? null,
    about_company: data.companyDescription ?? null,
    hiring_fields: data.hiringIndustry ?? null,
  };

  const res = await fetch(`${BASE}/recruiter/profile/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(payload),
  });

  return parseOrThrow(res);
}
