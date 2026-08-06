import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Formary | Form builder and response analytics",
  description:
    "Build forms, surveys, and quizzes with conditional logic, payments, response analytics, file uploads, and custom branding.",
  keywords: ["form builder", "survey maker", "online forms", "typeform alternative", "form creator"],
  openGraph: {
    title: "Formary | Form builder and response analytics",
    description:
      "Forms, surveys, and quizzes with conditional logic, payments, response analytics, file uploads, and custom branding.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
