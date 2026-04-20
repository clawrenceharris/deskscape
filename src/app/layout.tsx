import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import { ModalProvider, QueryProvider ,ThemeProvider} from "./providers";
import RootLayoutWrapper from "./_components/RootLayoutWrapper";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

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
              <RootLayoutWrapper>           
                {children}   
              </RootLayoutWrapper>
              
            </ModalProvider>
            <Toaster />

          </ThemeProvider>
        </QueryProvider>

      </body>
    </html>
  );
}
