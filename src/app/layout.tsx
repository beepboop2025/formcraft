import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Formary — Beautiful Forms That Convert",
  description:
    "Create stunning forms, surveys, and quizzes in minutes. No response limits. No hidden fees. Just beautiful forms that get results.",
  keywords: ["form builder", "survey maker", "online forms", "typeform alternative", "form creator"],
  openGraph: {
    title: "Formary — Beautiful Forms That Convert",
    description:
      "Create stunning forms, surveys, and quizzes in minutes. No response limits. No hidden fees.",
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
