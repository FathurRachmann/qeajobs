import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Job Finder AI",
  description: "Temukan pekerjaan impian Anda dengan bantuan AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full bg-gray-50 antialiased">
      <body className={`${inter.className} flex min-h-full flex-col`}>
        <main className="flex-auto">
            {children}
        </main>
      
      </body>
    </html>
  );
}
