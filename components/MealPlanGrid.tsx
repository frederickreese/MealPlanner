'use client';

import { format, parseISO } from 'date-fns';
import { GridDay, buildMealGrid } from '../lib/mealGrid';
import { MealPlanWithSlots, MealSlot, MealType } from '../types/mealPlan';
import { MealPlanCell } from './MealPlanCell';
import { Fragment } from 'react';

interface Props {
  plan: MealPlanWithSlots;
  onSelectSlot: (slotInfo: { date: string; mealType: MealType; slot?: MealSlot }) => void;
}

const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export function MealPlanGrid({ plan, onSelectSlot }: Props) {
  const days: GridDay[] = buildMealGrid(plan.slots, plan.start_date, plan.end_date);

  return (
    <div className="overflow-x-auto">
      <div className="grid" style={{ gridTemplateColumns: `150px repeat(${days.length}, minmax(180px, 1fr))` }}>
        <div></div>
        {days.map((day) => (
          <div key={day.date} className="p-2 text-sm font-semibold text-gray-700 text-center">
            {format(parseISO(day.date), 'EEE, MMM d')}
          </div>
        ))}
        {mealTypes.map((mealType) => (
          <Fragment key={mealType}>
            <div className="p-2 text-sm font-semibold capitalize text-gray-600 border-r">{mealType}</div>
            {days.map((day) => (
              <div key={`${day.date}-${mealType}`} className="p-2">
                <MealPlanCell
                  date={day.date}
                  mealType={mealType}
                  slot={day.slots[mealType]}
                  onSelect={() => onSelectSlot({ date: day.date, mealType, slot: day.slots[mealType] })}
                />
              </div>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
