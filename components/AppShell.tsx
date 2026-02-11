'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { HouseholdSelector } from './HouseholdSelector';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center font-bold">MP</div>
          <div>
            <p className="text-lg font-semibold">Meal Planner</p>
            <p className="text-sm text-gray-500">Plan meals with ease</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <HouseholdSelector />
          <Link className="text-sm text-gray-700" href="#">
            Account
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </div>
  );
}
