import { Suspense } from "react";
import { signOut } from "../auth/actions";
import { DashboardLayoutClient } from "@/components/DashboardLayoutClient";
import { DashboardFooter } from "@/components/DashboardFooter";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getServerUser, getDataClient } from "@/utils/dev-auth";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { user } = await getServerUser(supabase);

  if (!user) {
    redirect('/login');
  }

  const db = await getDataClient(supabase);

  const { data: profile } = await db
    .from('clients')
    .select('name, email')
    .eq('email', user.email)
    .single();

  const userInitials = profile?.name
    ? profile.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    : user.email?.substring(0, 2).toUpperCase() || 'WA';

  const userName = profile?.name || user.email?.split('@')[0] || 'User';
  const userEmail = profile?.email || user.email || '';

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <DashboardLayoutClient
        signOutAction={signOut}
        userInitials={userInitials}
        userName={userName}
        userEmail={userEmail}
      >
        {/* Main Content */}
        <main className="flex-1 md:ml-60 min-h-screen flex flex-col">
          <Suspense fallback={
            <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-end px-6 sticky top-0 z-30">
              <div className="flex gap-1">
                <div className="h-6 w-8 bg-zinc-100 rounded animate-pulse" />
                <div className="h-6 w-8 bg-zinc-100 rounded animate-pulse" />
              </div>
            </header>
          }>
            <DashboardHeader user={user} signOutAction={signOut} />
          </Suspense>

          {/* Page Content */}
          <div className="p-6 md:p-8 max-w-[1100px] mx-auto w-full flex-1">
            {children}
          </div>

          {/* Footer */}
          <DashboardFooter />
        </main>
      </DashboardLayoutClient>
    </div>
  );
}
