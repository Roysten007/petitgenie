import type { ReactNode } from "react";

/**
 * PhoneFrame is now a simple pass-through wrapper.
 * The real layout structure lives in __root.tsx (sidebar + main).
 * On mobile it still acts as a full-screen shell.
 */
export function PhoneFrame({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className={`w-full min-h-screen flex flex-col relative ${
        dark ? "bg-[#131f24] text-white" : "bg-white text-[#3c3c3c]"
      }`}
    >
      {children}
    </div>
  );
}
