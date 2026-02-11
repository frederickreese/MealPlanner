'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Household } from '../types/household';

export function HouseholdSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('householdId');
  const search = searchParams.toString();

  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch('/api/food/households', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load households');
        return res.json();
      })
      .then((data: Household[]) => {
        setHouseholds(data);
        setError('');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load households');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    if (households.length === 0 || selectedId) return;

    const params = new URLSearchParams(search);
    params.set('householdId', households[0].id);
    router.replace(`${pathname}?${params.toString()}`);
  }, [households, pathname, router, search, selectedId]);

  if (loading) return <p className="text-sm text-gray-500">Loading households...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (households.length === 0) {
    return <p className="text-sm text-gray-600">No households yet. Create one to begin.</p>;
  }

  return (
    <select
      className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
      value={selectedId ?? households[0].id}
      onChange={(e) => {
        const params = new URLSearchParams(search);
        params.set('householdId', e.target.value);
        router.push(`${pathname}?${params.toString()}`);
      }}
      aria-label="Select household"
    >
      {households.map((hh) => (
        <option key={hh.id} value={hh.id}>
          {hh.name} {hh.timezone ? `(${hh.timezone})` : ''}
        </option>
      ))}
    </select>
  );
}
