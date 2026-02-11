import { eachDayOfInterval, formatISO, parseISO } from 'date-fns';
import { MealSlot, MealType } from '../types/mealPlan';

export interface GridDay {
  date: string;
  slots: Record<MealType, MealSlot | undefined>;
}

export function buildMealGrid(slots: MealSlot[], start: string, end: string): GridDay[] {
  const days = eachDayOfInterval({ start: parseISO(start), end: parseISO(end) });
  const byKey = new Map<string, MealSlot>();
  slots.forEach((slot) => {
    byKey.set(`${slot.date}-${slot.meal_type}`, slot);
  });
  return days.map((day) => ({
    date: formatISO(day, { representation: 'date' }),
    slots: {
      breakfast: byKey.get(`${formatISO(day, { representation: 'date' })}-breakfast`),
      lunch: byKey.get(`${formatISO(day, { representation: 'date' })}-lunch`),
      dinner: byKey.get(`${formatISO(day, { representation: 'date' })}-dinner`),
      snack: byKey.get(`${formatISO(day, { representation: 'date' })}-snack`)
    }
  }));
}
