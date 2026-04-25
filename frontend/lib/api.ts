const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const API_URL = `${API_BASE_URL}/api/v1`;

// ─── Types ──────────────────────────────────────────────────────────────────

export interface UserPublic {
  id: string;
  email: string;
  username: string;
  name: string;
  preferred_domains: string[];
  preferred_languages: string[];
  created_at: string;
}

export interface AuthResponse {
  user: UserPublic;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: string;
  refresh_expires_at: string;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

export interface ProgressResponse {
  experience_points: number;
  health_points: number;
  max_health_points: number;
  health_next_regen_at: string | null;
  health_regen_seconds: number;
  level: number;
  level_name: string;
  xp_for_current_level: number;
  xp_for_next_level: number | null;
  xp_to_next_level: number | null;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  experience_points: number;
  level: number;
  level_name: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
}

// ─── Questions API Types ─────────────────────────────────────────────────────

export interface RefactorChallenge {
  type: "refactor";
  instruction: string;
  initial_code: string;
  eval_rubric: string[];
}

export interface DragAndDropChallenge {
  type: "drag_and_drop";
  instruction: string;
  code_with_blanks: string;
  options: string[];
}

export interface PredictOutputChallenge {
  type: "predict_output";
  instruction: string;
  code_snippet: string;
  options: string[];
}

export type Challenge = RefactorChallenge | DragAndDropChallenge | PredictOutputChallenge;

export interface PublicQuestion {
  challenge_id: string;
  topic_context: string;
  difficulty_score?: number;
  challenges: Challenge[];
}

export interface GenerateQuestionRequest {
  main_topic: string;
  subtopic: string;
  educational_tip: string;
}

export interface GenerateQuestionResponse {
  question_key: string;
  question: PublicQuestion;
}

export interface VerifyQuestionRequest {
  question_key: string;
  challenge_index: number;
  answer: string | Record<string, string>;
  success_threshold?: number;
}

export interface RubricBreakdownItem {
  criterion: string;
  met: boolean;
  comment: string;
}

export interface VerifyQuestionResponse {
  correct: boolean;
  challenge_type: string;
  score?: number;
  feedback?: string;
  rubric_breakdown?: RubricBreakdownItem[];
  correct_answer?: string | Record<string, string>;
  experience_points: number;
  xp_earned: number;
  health_points: number;
  hp_consumed: number;
  health_next_regen_at: string | null;
  level: number;
  level_name: string;
  xp_for_current_level: number;
  xp_for_next_level: number | null;
  xp_to_next_level: number | null;
}

// ─── Token Management ────────────────────────────────────────────────────────

const ACCESS_TOKEN_KEY = "codelingo_access_token";
const REFRESH_TOKEN_KEY = "codelingo_refresh_token";

function saveTokens(access: string, refresh: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
  }
}

function getAccessToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
}

function getRefreshToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

function clearTokens() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

function getAuthHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const token = getAccessToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
}

function getRefreshHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const token = getRefreshToken();
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractErrorMessage(error: ApiError): string {
  if (typeof error.detail === "string") return error.detail;
  if (Array.isArray(error.detail)) {
    return error.detail.map((e) => e.msg).join(". ");
  }
  return "An unexpected error occurred.";
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorData: ApiError = { detail: "An unexpected error occurred." };
    try {
      errorData = await res.json();
    } catch {
      // ignore parse errors
    }
    throw new Error(extractErrorMessage(errorData));
  }
  return res.json() as Promise<T>;
}

// ─── Auth API ────────────────────────────────────────────────────────────────

export async function loginUser(
  username: string,
  password: string
): Promise<AuthResponse> {
  // Backend login uses OAuth2PasswordRequestForm (application/x-www-form-urlencoded)
  const body = new URLSearchParams({ username, password });

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
    credentials: "include",
  });

  const data = await handleResponse<AuthResponse>(res);
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

export async function registerUser(
  email: string,
  name: string,
  password: string
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
    credentials: "include",
  });

  const data = await handleResponse<AuthResponse>(res);
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  clearTokens();
}

export async function getCurrentUser(): Promise<UserPublic> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<UserPublic>(res);
}

export async function refreshToken(): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    headers: getRefreshHeaders(),
    credentials: "include",
  });
  const data = await handleResponse<AuthResponse>(res);
  saveTokens(data.access_token, data.refresh_token);
  return data;
}

// ─── Progress API ────────────────────────────────────────────────────────────

export async function getMyProgress(): Promise<ProgressResponse> {
  const res = await fetch(`${API_URL}/progress/me`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<ProgressResponse>(res);
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardResponse> {
  const res = await fetch(`${API_URL}/progress/leaderboard?limit=${limit}`, {
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<LeaderboardResponse>(res);
}

// ─── Questions API ───────────────────────────────────────────────────────────

export async function generateQuestion(
  payload: GenerateQuestionRequest
): Promise<GenerateQuestionResponse> {
  const res = await fetch(`${API_URL}/questions/generate`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<GenerateQuestionResponse>(res);
}

export async function fetchQuestionByKey(key: string): Promise<PublicQuestion> {
  const res = await fetch(`${API_URL}/questions/${key}`, {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  });
  return handleResponse<PublicQuestion>(res);
}

export async function verifyAnswer(
  payload: VerifyQuestionRequest
): Promise<VerifyQuestionResponse> {
  const res = await fetch(`${API_URL}/questions/verify`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
    credentials: "include",
  });
  return handleResponse<VerifyQuestionResponse>(res);
}

// ─── Users API ───────────────────────────────────────────────────────────────

export async function updateLanguage(language: string): Promise<UserPublic> {
  const res = await fetch(`${API_URL}/users/me/language`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ language }),
    credentials: "include",
  });
  return handleResponse<UserPublic>(res);
}
