import { Baby } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Mamatoto Logo">
      <div className="bg-primary p-1.5 rounded-md">
        <Baby className="h-6 w-6 text-primary-foreground" />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Mamatoto
      </span>
    </div>
  );
}
