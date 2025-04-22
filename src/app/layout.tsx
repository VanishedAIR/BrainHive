import type { Metadata } from "next";
import { poppins } from "@/assets/fonts";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/themeprovider";
import { Toaster } from "@/components/ui/toaster";
import { SmallScreenWarning } from "@/components/SmallScreenWarning";

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
            <SmallScreenWarning>
              {children}
              <Toaster />
            </SmallScreenWarning>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
