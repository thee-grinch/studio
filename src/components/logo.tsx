import { HeartHand } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2" aria-label="Mama's Helper Logo">
      <HeartHand className="h-7 w-7 text-accent-foreground" />
      <span className="text-xl font-bold tracking-tight text-foreground">
        Mama's Helper
      </span>
    </div>
  );
}
