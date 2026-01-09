import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    console.log(`[QueryClient] Fetching: ${url}`);
    try {
      const res = await fetch(url, {
        credentials: "include",
      });

      console.log(`[QueryClient] Response status for ${url}: ${res.status}`);

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`[QueryClient] Got 401, returning null`);
        return null;
      }

      if (!res.ok) {
        const text = await res.text();
        console.error(`[QueryClient] API Error for ${url}:`, {
          status: res.status,
          statusText: res.statusText,
          body: text
        });
        throw new Error(`${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log(`[QueryClient] Successfully fetched ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`[QueryClient] Failed to fetch ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
