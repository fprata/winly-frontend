import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { User } from "@supabase/supabase-js";

interface DashboardHeaderProps {
  user: User;
  signOutAction: () => Promise<void>;
}

export async function DashboardHeader({ user, signOutAction }: DashboardHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-end px-6 sticky top-0 z-30">
      <LanguageSwitcher />
    </header>
  );
}
