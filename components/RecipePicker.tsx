'use client';

import { useEffect, useMemo, useState } from 'react';
import { Recipe } from '../types/recipe';

export function RecipePicker({
  householdId,
  onSelect
}: {
  householdId: string;
  onSelect: (recipe: Recipe) => void;
}) {
  const [search, setSearch] = useState('');
  const [publicOnly, setPublicOnly] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useMemo(() => search.trim(), [search]);

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);

      const params = new URLSearchParams();
      if (householdId) params.append('householdId', householdId);
      if (debouncedSearch) params.append('query', debouncedSearch);
      params.append('public', String(publicOnly));

      fetch(`/api/food/recipes?${params.toString()}`, { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to search recipes');
          return res.json();
        })
        .then((data: Recipe[]) => {
          setRecipes(data);
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') {
            return;
          }
          setRecipes([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [householdId, publicOnly, debouncedSearch]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 rounded-lg border px-3 py-2"
          placeholder="Search recipes"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={publicOnly} onChange={(e) => setPublicOnly(e.target.checked)} /> Public
        </label>
      </div>
      <div className="max-h-64 space-y-2 overflow-y-auto">
        {loading && <p className="text-sm text-gray-500">Loading...</p>}
        {!loading &&
          recipes.map((recipe) => (
            <div key={recipe.id} className="flex items-center justify-between rounded-lg border p-3 hover:border-primary">
              <div>
                <p className="font-medium">{recipe.title}</p>
                <p className="text-xs text-gray-500">
                  {recipe.difficulty || 'Easy'} · {(recipe.prep_time_min ?? 0) + (recipe.cook_time_min ?? 0)} mins ·{' '}
                  {recipe.servings ?? 'N/A'} servings
                </p>
              </div>
              <button className="btn-primary text-sm" onClick={() => onSelect(recipe)}>
                Select
              </button>
            </div>
          ))}
        {!loading && recipes.length === 0 && <p className="text-sm text-gray-500">No recipes found.</p>}
      </div>
    </div>
  );
}
