import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { MealPlan } from '../types/mealPlan';

interface Props {
  plan: MealPlan;
}

export function MealPlanCard({ plan }: Props) {
  return (
    <Link href={`/meal-plans/${plan.id}`} className="card p-5 block hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">{plan.name}</p>
          <p className="text-sm text-gray-500">
            {format(parseISO(plan.start_date), 'MMM d')} - {format(parseISO(plan.end_date), 'MMM d, yyyy')}
          </p>
        </div>
        {plan.goal_focus && (
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-primary uppercase">
            {plan.goal_focus}
          </span>
        )}
      </div>
    </Link>
  );
}
