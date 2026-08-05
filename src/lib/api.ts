/**
 * API abstraction layer.
 * All backend calls go through here — swap BASE_URL to point at the Python backend.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "";

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
};

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export type ContactPayload = {
  name: string;
  contact: string;
  /** Honeypot — must stay empty. Filled = bot. */
  company?: string;
};

export type ContactResponse = {
  success: boolean;
  message: string;
};

export const api = {
  contact: {
    submit: (payload: ContactPayload) =>
      request<ContactResponse>("/api/contact", {
        method: "POST",
        body: payload,
      }),
  },
};
