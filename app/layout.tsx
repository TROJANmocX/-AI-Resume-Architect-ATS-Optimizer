import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareerForge Pro | ATS-Proof Resume Generator",
  description: "Optimize your resume for ATS with AI-driven keyword matching and professional formatting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
