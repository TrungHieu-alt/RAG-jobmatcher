// Minimal fetch-based auth client (no abstractions, types local to file)

const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

// types
export type Role = "candidate" | "recruiter" | null;

export type UserRegisterRequest = { email: string; password: string; role: Role };
export type UserLoginRequest = { email: string; password: string };

export type UserResponse = {
  user_id: number;
  email: string;
  role: Role;
  created_at: string;
  updated_at: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: "bearer";
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
  if (!res.ok)
    throw { status: res.status, message: body?.detail ?? res.statusText, details: body } as ApiError;
  return body;
}

// ============ AUTH ============

export async function registerUser(payload: UserRegisterRequest): Promise<UserResponse> {
  const res = await fetch(`${BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });

  const data = await parseOrThrow(res);
  try {
    if (data?.access_token) localStorage.setItem("token", data.access_token);
  } catch {}

  return data;
}

export async function registerEmptyUser(email: string, password: string) {
  return registerUser({ email, password, role: null });
}

export async function loginUser(payload: UserLoginRequest): Promise<TokenResponse> {
  const res = await fetch(`${BASE}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await parseOrThrow(res);
  try {
    if (data?.access_token) localStorage.setItem("token", data.access_token);
  } catch {}

  return data;
}

export async function refreshToken(): Promise<TokenResponse> {
  const res = await fetch(`${BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });
  return parseOrThrow(res);
}
