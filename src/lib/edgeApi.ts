const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://accvrbqjndibljfpsspc.supabase.co";
const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjY3ZyYnFqbmRpYmxqZnBzc3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMDIxNjYsImV4cCI6MjEwMDg3ODE2Nn0.L8kQq5322O2l0fR55OS5eiURZqpGazY0y6gK2ozx7Zs";

export function edgeFunctionUrl(name: string) {
  return `${SUPABASE_URL}/functions/v1/${name}`;
}

export async function callEdgeFunction<T>(
  name: string,
  body: Record<string, unknown>,
  accessToken?: string
): Promise<T> {
  const res = await fetch(edgeFunctionUrl(name), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${accessToken || SUPABASE_ANON}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      (data as { error?: string; message?: string }).error ||
        (data as { message?: string }).message ||
        `Request failed (${res.status})`
    );
  }
  return data as T;
}
