import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export type FilterOperator = 'eq' | 'ilike' | 'gte' | 'lte' | 'in';

export interface PostgrestFilter {
  column: string;
  op: FilterOperator;
  value: string | number | boolean | string[];
}

export interface PostgrestOrder {
  column: string;
  ascending?: boolean;
}

function extractTokenFromSupabaseCookie(raw: string): string | undefined {
  if (!raw) return undefined;

  // Supabase cookies are commonly either a direct token string or a JSON array
  // with [access_token, refresh_token, ...].
  if (raw.startsWith('[')) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && typeof parsed[0] === 'string') {
        return parsed[0];
      }
    } catch {
      return undefined;
    }
  }

  return raw;
}

function getAccessToken(): string | undefined {
  try {
    const store = cookies();
    const directToken = store.get('sb-access-token')?.value || store.get('supabase-auth-token')?.value;
    if (directToken) {
      return extractTokenFromSupabaseCookie(directToken);
    }

    // Supabase's default cookie format is sb-<project-ref>-auth-token.
    const supabaseAuthCookie = store
      .getAll()
      .find((cookie) => cookie.name.startsWith('sb-') && cookie.name.endsWith('-auth-token'));

    return extractTokenFromSupabaseCookie(supabaseAuthCookie?.value ?? '');
  } catch {
    return undefined;
  }
}

function buildHeaders(prefer?: string): HeadersInit {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    apikey: supabaseKey,
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (prefer) {
    headers.Prefer = prefer;
  }
  return headers;
}

function ensureEnv() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase environment variables are missing');
  }
}

function applyFilters(url: URL, filters: PostgrestFilter[] = []) {
  filters.forEach((filter) => {
    const value = Array.isArray(filter.value) ? filter.value.join(',') : filter.value;
    const formatted = filter.op === 'in' ? `in.(${value})` : `${filter.op}.${value}`;
    url.searchParams.append(filter.column, formatted);
  });
}

export async function postgrest<T>(options: {
  table: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  select?: string;
  filters?: PostgrestFilter[];
  or?: string;
  order?: PostgrestOrder;
  limit?: number;
  single?: boolean;
  body?: any;
  upsert?: boolean;
}): Promise<{ data?: T; error?: Error }> {
  ensureEnv();
  const method = options.method ?? 'GET';
  const select = options.select ?? '*';
  const url = new URL(`${supabaseUrl}/rest/v1/${options.table}`);
  url.searchParams.set('select', select);

  applyFilters(url, options.filters);

  if (options.or) {
    url.searchParams.set('or', options.or);
  }

  if (options.order) {
    url.searchParams.set('order', `${options.order.column}.${options.order.ascending === false ? 'desc' : 'asc'}`);
  }

  if (options.limit) {
    url.searchParams.set('limit', options.limit.toString());
  }

  const preferDirectives: string[] = [];
  if (method !== 'GET') {
    preferDirectives.push('return=representation');
  }
  if (options.upsert) {
    preferDirectives.push('resolution=merge-duplicates');
  }

  const headers = buildHeaders(preferDirectives.length ? preferDirectives.join(',') : undefined);

  const response = await fetch(url.toString(), {
    method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: 'no-store'
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const payload = response.status === 204 ? null : isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = (payload as any)?.message || response.statusText;
    return { error: new Error(message) };
  }

  if (options.single && Array.isArray(payload)) {
    return { data: (payload[0] ?? null) as T };
  }

  return { data: payload as T };
}

export async function getAuthUser(): Promise<{ id: string; email?: string | null } | null> {
  ensureEnv();
  const token = getAccessToken();
  if (!token) return null;

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`
    },
    cache: 'no-store'
  });

  if (!response.ok) return null;
  const data = await response.json();
  // Supabase returns the user object directly at this endpoint
  return data ?? null;
}
