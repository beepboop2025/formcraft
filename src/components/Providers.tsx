"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1a1a2e",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#40c057", secondary: "#fff" } },
          error: { iconTheme: { primary: "#fa5252", secondary: "#fff" } },
        }}
      />
    </SessionProvider>
  );
}
