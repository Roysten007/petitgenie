import type { ReactNode } from "react";

export function PhoneFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-gradient-to-br from-ocre/20 via-paper to-terracotta/10 md:p-6">
      <div
        className={`w-full md:max-w-[420px] md:rounded-[44px] md:border-8 md:border-white md:ring-1 md:ring-black/5 md:shadow-2xl overflow-hidden relative flex flex-col ${
          dark ? "bg-deep-blue text-deep-blue-foreground" : "bg-paper text-foreground"
        }`}
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </div>
    </div>
  );
}
