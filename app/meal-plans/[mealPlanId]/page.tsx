'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { AssignMealModal } from '../../../components/AssignMealModal';
import { MealPlanGrid } from '../../../components/MealPlanGrid';
import { MealPlanWithSlots, MealSlot, MealType } from '../../../types/mealPlan';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

async function saveSlots(mealPlanId: string, slots: Omit<MealSlot, 'meal_plan_id'>[]) {
  const res = await fetch(`/api/food/meal-plans/${mealPlanId}/slots/bulk`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slots })
  });
  if (!res.ok) throw new Error('Failed to save slots');
  return res.json() as Promise<MealSlot[]>;
}

function mergeSlots(
  existing: MealSlot[],
  incoming: MealSlot[]
): MealSlot[] {
  const byKey = new Map<string, MealSlot>();

  for (const slot of existing) {
    byKey.set(`${slot.date}-${slot.meal_type}`, slot);
  }

  for (const slot of incoming) {
    byKey.set(`${slot.date}-${slot.meal_type}`, slot);
  }

  return Array.from(byKey.values());
}

export default function MealPlanDetailPage() {
  const params = useParams();
  const mealPlanId = params?.mealPlanId as string;
  const [selected, setSelected] = useState<{ date: string; mealType: MealType } | null>(null);
  const [plan, setPlan] = useState<MealPlanWithSlots | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!mealPlanId) return;

    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/food/meal-plans/${mealPlanId}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load plan');
        return res.json();
      })
      .then((data: MealPlanWithSlots) => {
        setPlan(data);
        setError('');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        setError('Unable to load plan');
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [mealPlanId]);

  const handleSaveSlot = async (slots: Omit<MealSlot, 'meal_plan_id'>[]) => {
    if (!mealPlanId) return;

    setSaving(true);
    try {
      const savedSlots = await saveSlots(mealPlanId, slots);
      setPlan((current) => {
        if (!current) return current;
        return {
          ...current,
          slots: mergeSlots(current.slots, savedSlots)
        };
      });
      setError('');
    } catch {
      setError('Failed to save slots');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-4">Loading plan...</p>;
  if (error || !plan) return <p className="p-4 text-red-600">{error || 'Unable to load plan'}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            {format(parseISO(plan.start_date), 'PPP')} - {format(parseISO(plan.end_date), 'PPP')}
          </p>
          <h1 className="text-2xl font-semibold">{plan.name}</h1>
          {plan.goal_focus && (
            <span className="mt-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium uppercase text-primary">
              {plan.goal_focus}
            </span>
          )}
        </div>
        <Link href="/app" className="btn-ghost">
          Back to plans
        </Link>
      </div>

      <MealPlanGrid
        plan={plan}
        onSelectSlot={(slotInfo) => setSelected({ date: slotInfo.date, mealType: slotInfo.mealType })}
      />

      {selected && (
        <AssignMealModal
          open={!!selected}
          onClose={() => setSelected(null)}
          householdId={plan.household_id}
          date={selected.date}
          mealType={selected.mealType}
          onSave={(slot) => handleSaveSlot([{ ...slot, locked: false }])}
        />
      )}
      {saving && <p className="text-sm text-gray-500">Saving changes...</p>}
    </div>
  );
}
