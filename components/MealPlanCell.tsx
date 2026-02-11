'use client';

import { MealSlot, MealType } from '../types/mealPlan';

interface Props {
  date: string;
  mealType: MealType;
  slot?: MealSlot;
  onSelect: () => void;
}

export function MealPlanCell({ date, mealType, slot, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className="w-full text-left border border-gray-100 rounded-lg p-3 hover:border-primary focus:outline-none focus:ring"
    >
      <p className="text-xs uppercase text-gray-500">{mealType}</p>
      {slot ? (
        <div>
          <p className="font-medium text-gray-800">{slot.external_note || slot.recipe_id || 'Meal'}</p>
          {slot.locked && <p className="text-xs text-orange-600">Locked</p>}
        </div>
      ) : (
        <p className="text-sm text-gray-400">+ Add meal</p>
      )}
    </button>
  );
}
