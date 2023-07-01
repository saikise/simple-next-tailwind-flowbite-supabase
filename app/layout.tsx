import Script from "next/script";
import "./globals.css";
import Shell from "@/components/server-components/Shell";

export const metadata = {
  title: "Next.js Supabase Template by sai kise",
  description: "Made with Next.js 13 App Router, Supabase Auth, Database CRUD, Realtime, Storage, and Vercel Serverless Functions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Shell>
          <main className="p-4 md:ml-64 min-h-screen pt-20 max-w-screen-2xl">
            {children}
          </main>
        </Shell>
        <Script
          strategy="beforeInteractive"
          src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.6.5/flowbite.min.js"
        />
      </body>
    </html>
  );
}
