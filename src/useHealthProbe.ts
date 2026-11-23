import { useEffect, useState } from "react";

type Probe<T> =
  | { state: "pending" | "fail"; data: null }
  | { state: "pass"; data: T };

const POLL_MS = 30_000;
const TIMEOUT_MS = 5_000;

export function useHealthProbe<T>(url: string | null, accepts: (data: unknown) => data is T): Probe<T> {
  const [result, setResult] = useState<Probe<T>>({ state: "pending", data: null });

  useEffect(() => {
    if (!url) return;
    let active = true;
    let request: AbortController | null = null;
    const check = async () => {
      if (request || document.hidden) return;
      const controller = new AbortController();
      request = controller;
      const timeout = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
      try {
        const response = await fetch(url, { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Health check failed");
        const data: unknown = await response.json();
        if (!accepts(data)) throw new Error("Unexpected health response");
        if (active) setResult({ state: "pass", data });
      } catch {
        if (active) setResult({ state: "fail", data: null });
      } finally {
        window.clearTimeout(timeout);
        request = null;
      }
    };

    void check();
    const interval = window.setInterval(check, POLL_MS);
    window.addEventListener("online", check);
    window.addEventListener("offline", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      active = false;
      request?.abort();
      window.clearInterval(interval);
      window.removeEventListener("online", check);
      window.removeEventListener("offline", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [url, accepts]);

  return url ? result : { state: "pending", data: null };
}
