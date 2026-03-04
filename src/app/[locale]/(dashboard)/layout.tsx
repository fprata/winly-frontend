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
        <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
          <Suspense fallback={
             <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse"></div>
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
                  <div className="w-px h-6 bg-gray-200 mx-1"></div>
                  <div className="flex gap-2 items-center">
                      <div className="hidden sm:block text-right">
                          <div className="h-3 w-20 bg-gray-100 rounded mb-1 animate-pulse"></div>
                          <div className="h-2 w-14 bg-gray-100 rounded ml-auto animate-pulse"></div>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse"></div>
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
