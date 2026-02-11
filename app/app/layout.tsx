import { ReactNode } from 'react';
import { AppShell } from '../../components/AppShell';
import { Providers } from '../../components/Providers';

export default function PlannerLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AppShell>{children}</AppShell>
    </Providers>
  );
}
