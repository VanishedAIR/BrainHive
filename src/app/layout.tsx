import type { Metadata } from "next";
import { poppins } from "@/assets/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/themeprovider";
import { Toaster } from "@/components/ui/toaster";
import { SmallScreenWarning } from "@/components/SmallScreenWarning";
import Footer from "./_components/Footer";

export const metadata: Metadata = {
  title: "BrainHive",
  description: "Thrive and Hive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider>
            <div className="flex flex-col min-h-screen">
              <SmallScreenWarning>
                <main className="flex-1 flex flex-col">
                  {children}
                  <Toaster />
                </main>
                <Footer />
              </SmallScreenWarning>
            </div>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
