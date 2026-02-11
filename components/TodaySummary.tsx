'use client';

import { useEffect, useState } from 'react';
import { MealSlot } from '../types/mealPlan';

export function TodaySummary({ householdId }: { householdId: string }) {
  const [data, setData] = useState<MealSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!householdId) {
      setData([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/food/households/${householdId}/today-meals`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load today meals');
        return res.json();
      })
      .then((json: MealSlot[]) => {
        setData(json);
        setError('');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Error loading today');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [householdId]);

  if (!householdId) return null;
  if (loading) return <div className="card p-4">Loading today...</div>;
  if (error) return <div className="card p-4 text-red-600">{error}</div>;
  if (data.length === 0) return <div className="card p-4 text-gray-600">No meals planned for today.</div>;

  return (
    <div className="card p-4">
      <p className="text-sm font-semibold text-gray-700">Today</p>
      <div className="mt-3 space-y-2">
        {data.map((slot) => (
          <div key={`${slot.date}-${slot.meal_type}`} className="flex items-center justify-between border-b pb-2 last:border-0">
            <span className="capitalize text-gray-700">{slot.meal_type}</span>
            <span className="text-sm text-gray-600">{slot.external_note || slot.recipe_id || 'Unassigned'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
