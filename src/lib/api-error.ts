import { AxiosError } from "axios";

/**
 * Turns a backend error into a readable message.
 * The backend answers `{ error: "..." }` or, for validation errors, `{ field: "message" }`
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  const data = (err as AxiosError<Record<string, string>>)?.response?.data;
  if (data && typeof data === "object") {
    if (data.error) return data.error;
    const first = Object.values(data)[0];
    if (typeof first === "string") return first;
  }
  return fallback;
}
