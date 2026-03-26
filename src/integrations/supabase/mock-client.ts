/**
 * Mock Supabase client for demo mode.
 * Mimics the real @supabase/ssr client API shape so all existing code works
 * without modification. Returns mock data from demo-mode.ts.
 */

import {
  isDemoMode,
  getMockDataForTable,
  DEMO_USER,
  DEMO_PROFILE,
} from '@/lib/demo-mode';

// ── Types ────────────────────────────────────────────────────────────────────

type FilterOp = { column: string; value: any };

interface MockResult {
  data: any;
  error: null;
  count?: number | null;
}

// ── Mock Query Builder ───────────────────────────────────────────────────────
// Supports chained calls: .from('table').select().eq().order().limit().single()

function createMockQueryBuilder(table: string) {
  let rows = getMockDataForTable(table);
  let filters: FilterOp[] = [];
  let isSingle = false;
  let isHead = false;
  let isCount = false;
  let limitN: number | null = null;
  let isInsert = false;
  let insertPayload: any = null;

  const builder: any = {
    select(_columns?: string, opts?: { count?: string; head?: boolean }) {
      if (opts?.count === 'exact') isCount = true;
      if (opts?.head) isHead = true;
      return builder;
    },
    insert(payload: any) {
      isInsert = true;
      insertPayload = Array.isArray(payload) ? payload[0] : payload;
      return builder;
    },
    update(_payload: any) {
      return builder;
    },
    delete() {
      return builder;
    },
    upsert(_payload: any) {
      return builder;
    },
    eq(column: string, value: any) {
      filters.push({ column, value });
      return builder;
    },
    neq(_column: string, _value: any) {
      return builder;
    },
    gt(_column: string, _value: any) {
      return builder;
    },
    gte(_column: string, _value: any) {
      return builder;
    },
    lt(_column: string, _value: any) {
      return builder;
    },
    lte(_column: string, _value: any) {
      return builder;
    },
    like(_column: string, _value: any) {
      return builder;
    },
    ilike(_column: string, _value: any) {
      return builder;
    },
    in(_column: string, _values: any[]) {
      return builder;
    },
    is(column: string, value: any) {
      filters.push({ column, value });
      return builder;
    },
    not(_column: string, _op: string, _value: any) {
      return builder;
    },
    or(_expr: string) {
      return builder;
    },
    filter(_column: string, _op: string, _value: any) {
      return builder;
    },
    order(_column: string, _opts?: { ascending?: boolean }) {
      return builder;
    },
    limit(n: number) {
      limitN = n;
      return builder;
    },
    range(_from: number, _to: number) {
      return builder;
    },
    single() {
      isSingle = true;
      return builder;
    },
    maybeSingle() {
      isSingle = true;
      return builder;
    },
    // Terminal: resolve as a Promise
    then(resolve: (result: MockResult) => void, reject?: (err: any) => void) {
      try {
        // Apply filters
        let result = [...rows];
        for (const f of filters) {
          result = result.filter((r) => r[f.column] === f.value);
        }

        if (isInsert && insertPayload) {
          const newRow = {
            id: `demo-${table}-${Date.now()}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...insertPayload,
          };
          result = [newRow];
        }

        if (limitN !== null) {
          result = result.slice(0, limitN);
        }

        if (isCount && isHead) {
          return resolve({ data: null, error: null, count: result.length });
        }

        if (isSingle) {
          return resolve({ data: result[0] || null, error: null });
        }

        return resolve({ data: result, error: null, count: result.length });
      } catch (err) {
        if (reject) reject(err);
      }
    },
  };

  return builder;
}

// ── Mock Auth ────────────────────────────────────────────────────────────────

const mockSession = {
  user: DEMO_USER as any,
  access_token: 'demo-access-token',
  refresh_token: 'demo-refresh-token',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
};

function createMockAuth() {
  return {
    getSession: () =>
      Promise.resolve({ data: { session: mockSession }, error: null }),
    getUser: () =>
      Promise.resolve({ data: { user: DEMO_USER as any }, error: null }),
    onAuthStateChange: (
      _callback: (event: string, session: any) => void
    ) => ({
      data: {
        subscription: {
          id: 'demo-subscription',
          unsubscribe: () => {},
        },
      },
    }),
    signOut: () => Promise.resolve({ error: null }),
    signInWithPassword: () =>
      Promise.resolve({ data: { session: mockSession, user: DEMO_USER }, error: null }),
    signUp: () =>
      Promise.resolve({ data: { session: mockSession, user: DEMO_USER }, error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: {}, error: null }),
    refreshSession: () =>
      Promise.resolve({ data: { session: mockSession }, error: null }),
    exchangeCodeForSession: () =>
      Promise.resolve({ data: { session: mockSession }, error: null }),
    updateUser: () =>
      Promise.resolve({ data: { user: DEMO_USER }, error: null }),
  };
}

// ── Mock Realtime Channel ────────────────────────────────────────────────────

function createMockChannel() {
  const channel: any = {
    on: () => channel,
    subscribe: () => channel,
    unsubscribe: () => {},
  };
  return channel;
}

// ── Mock Functions (Edge Functions) ──────────────────────────────────────────

function createMockFunctions() {
  return {
    invoke: (_name: string, _opts?: any) =>
      Promise.resolve({
        data: { success: true, message: 'Demo mode - edge function not called' },
        error: null,
      }),
  };
}

// ── Main: createMockSupabaseClient ───────────────────────────────────────────

export function createMockSupabaseClient() {
  return {
    auth: createMockAuth(),
    from: (table: string) => createMockQueryBuilder(table),
    channel: (_name: string) => createMockChannel(),
    removeChannel: (_channel: any) => {},
    functions: createMockFunctions(),
    rpc: (_fn: string, _params?: any) =>
      Promise.resolve({ data: null, error: null }),
  };
}
