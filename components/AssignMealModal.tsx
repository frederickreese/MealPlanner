'use client';

import { useState } from 'react';
import { RecipePicker } from './RecipePicker';
import { MealSlot, MealType } from '../types/mealPlan';

interface Props {
  open: boolean;
  onClose: () => void;
  householdId: string;
  date: string;
  mealType: MealType;
  onSave: (slot: Omit<MealSlot, 'meal_plan_id'>) => void;
}

export function AssignMealModal({ open, onClose, householdId, date, mealType, onSave }: Props) {
  const [noteOnly, setNoteOnly] = useState(false);
  const [note, setNote] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" aria-modal="true">
      <div className="card w-full max-w-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Assign meal</p>
            <p className="text-lg font-semibold">{mealType} on {date}</p>
          </div>
          <button className="text-gray-500" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={noteOnly} onChange={(e) => setNoteOnly(e.target.checked)} />
          Note only (no recipe)
        </label>

        {noteOnly ? (
          <div className="space-y-2">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Add note"
            />
            <button
              className="btn-primary"
              onClick={() => {
                onSave({ date, meal_type: mealType, external_note: note });
                onClose();
              }}
            >
              Save note
            </button>
          </div>
        ) : (
          <RecipePicker
            householdId={householdId}
            onSelect={(recipe) => {
              onSave({ date, meal_type: mealType, recipe_id: recipe.id });
              onClose();
            }}
          />
        )}
      </div>
    </div>
  );
}
