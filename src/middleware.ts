import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Phase 1: Mock auth only — no server-side auth checks.
// Route gating is handled client-side via useMockAuth.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
