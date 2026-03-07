import { Suspense } from "react";
import { signOut } from "../auth/actions";
import { DashboardLayoutClient } from "@/components/DashboardLayoutClient";
import { DashboardFooter } from "@/components/DashboardFooter";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-[#fafbfc]">
      <DashboardLayoutClient signOutAction={signOut}>
        {/* Main Content */}
        <main className="flex-1 md:ml-60 min-h-screen flex flex-col">
          <Suspense fallback={
             <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="h-3 w-28 bg-zinc-100 rounded animate-pulse"></div>
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-zinc-100 rounded-lg animate-pulse"></div>
                  <div className="w-px h-6 bg-zinc-200 mx-1"></div>
                  <div className="flex gap-2 items-center">
                      <div className="hidden sm:block text-right">
                          <div className="h-3 w-20 bg-zinc-100 rounded mb-1 animate-pulse"></div>
                          <div className="h-2 w-14 bg-zinc-100 rounded ml-auto animate-pulse"></div>
                      </div>
                      <div className="w-8 h-8 bg-zinc-100 rounded-lg animate-pulse"></div>
                  </div>
                </div>
             </header>
          }>
            <DashboardHeader user={user} signOutAction={signOut} />
          </Suspense>

          {/* Page Content */}
          <div className="p-5 md:p-8 max-w-7xl mx-auto w-full flex-1">
            {children}
          </div>

          {/* Footer */}
          <DashboardFooter />
        </main>
      </DashboardLayoutClient>
    </div>
  );
}
