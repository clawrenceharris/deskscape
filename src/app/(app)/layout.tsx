"use server";
import { LayoutProvider, DeskProvider,SchoolProvider } from "../providers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {


    return (
        <LayoutProvider>
            <SchoolProvider>
                <DeskProvider>
                
                        {children}
                   
            </DeskProvider>
        </SchoolProvider>
    </LayoutProvider>
   
    );
}