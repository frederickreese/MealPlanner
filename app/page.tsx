import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="card p-8 text-center space-y-4 max-w-xl w-full">
        <h1 className="text-3xl font-semibold">Meal Planner</h1>
        <p className="text-gray-600">Organize your household meals with simple weekly plans.</p>
        <Link className="btn-primary inline-block" href="/app">Open Meal Planner</Link>
      </div>
    </main>
  );
}
