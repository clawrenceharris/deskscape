"use server";
import { LayoutProvider, DeskProvider,SchoolProvider } from "../providers";
import { Header } from "@/components/shared";

export default async function AppLayout({ children }: { children: React.ReactNode }) {


    return (
        <LayoutProvider>
            <SchoolProvider>
                <DeskProvider>
                <div className="page">
                    <Header/>
                    <main>
                        {children}
                    </main> 
                </div>
            </DeskProvider>
        </SchoolProvider>
    </LayoutProvider>
   
    );
}