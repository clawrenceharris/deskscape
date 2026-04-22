import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { Header } from "@/components/shared";
import { ModalProvider, QueryProvider, ThemeProvider, UserProvider } from "./providers";

export const metadata: Metadata = {
  title: "DeskShare",
  description: "Your own virtual desk for sharing your school notes and materials",
};
const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`antialiased ${geistSans.variable} ${geistMono.variable} font-sans ${figtree.variable}`}
    >
      <body>
        
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange={false}
          >
            <ModalProvider>
              <UserProvider>              
                <div className="page">
                  <Header/>
                  <main>
                    {children}
                  </main> 
                </div>
              </UserProvider>
              
            </ModalProvider>
            <Toaster />

          </ThemeProvider>
        </QueryProvider>

      </body>
    </html>
  );
}
