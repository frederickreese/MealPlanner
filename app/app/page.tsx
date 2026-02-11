'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MealPlanCard } from '../../components/MealPlanCard';
import { TodaySummary } from '../../components/TodaySummary';
import { useEffect, useMemo, useState } from 'react';
import { addDays, formatISO } from 'date-fns';
import { GoalFocus, MealPlan } from '../../types/mealPlan';

async function createPlan(payload: {
  householdId: string;
  name: string;
  startDate: string;
  endDate: string;
  goalFocus?: GoalFocus;
}) {
  const res = await fetch(`/api/food/households/${payload.householdId}/meal-plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: payload.name,
      startDate: payload.startDate,
      endDate: payload.endDate,
      goalFocus: payload.goalFocus
    })
  });
  if (!res.ok) throw new Error('Failed to create plan');
  return res.json();
}

export default function PlannerHomePage() {
  const router = useRouter();
  const params = useSearchParams();
  const householdId = params.get('householdId') || '';
  const defaultStartDate = useMemo(() => formatISO(new Date(), { representation: 'date' }), []);
  const defaultEndDate = useMemo(
    () => formatISO(addDays(new Date(), 6), { representation: 'date' }),
    []
  );

  const [newPlanName, setNewPlanName] = useState('');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [plans, setPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!householdId) {
      setPlans([]);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/food/households/${householdId}/meal-plans`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Unable to load meal plans');
        return res.json();
      })
      .then((data: MealPlan[]) => {
        setPlans(data);
        setError('');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Failed to load plans');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [householdId]);

  const handleCreate = async () => {
    if (!householdId) {
      setError('Select a household first');
      return;
    }

    if (!startDate || !endDate) {
      setError('Start date and end date are required');
      return;
    }

    if (startDate > endDate) {
      setError('Start date must be before or equal to end date');
      return;
    }

    setCreating(true);
    setError('');
    try {
      const plan = await createPlan({
        householdId,
        name: newPlanName.trim() || 'New Meal Plan',
        startDate,
        endDate,
        goalFocus: null
      });
      router.push(`/meal-plans/${plan.id}`);
    } catch {
      setError('Failed to create plan');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Meal Plans</h1>
          <p className="text-gray-600">Plan meals for your household.</p>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-semibold">Create new plan</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            className="border rounded-lg px-3 py-2"
            placeholder="Plan name"
          />
          <input value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border rounded-lg px-3 py-2" type="date" />
          <input value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border rounded-lg px-3 py-2" type="date" />
          <button className="btn-primary" disabled={!householdId || creating} onClick={handleCreate}>
            {creating ? 'Creating...' : 'New Meal Plan'}
          </button>
        </div>
      </div>

      <TodaySummary householdId={householdId} />

      {loading && <p>Loading plans...</p>}
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {plans?.map((plan) => (
          <MealPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
      {plans && plans.length === 0 && !loading && <p className="text-gray-600">No meal plans yet.</p>}
    </div>
  );
}
