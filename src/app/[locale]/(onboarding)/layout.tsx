export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
             <h1 className="text-xl font-bold text-zinc-800 tracking-tight flex items-center justify-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-black">W</div>
                WINLY
              </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
