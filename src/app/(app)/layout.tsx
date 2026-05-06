import { LayoutProvider, DeskProvider, SchoolProvider, HomeNavigationProvider } from "../providers";
import { HomePageClient } from "./HomePageClient";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <LayoutProvider>
            <SchoolProvider>
                <DeskProvider>
                    <HomeNavigationProvider>
                        
                        <HomePageClient />
                        <div hidden>{children}</div>
                    </HomeNavigationProvider>
                </DeskProvider>
            </SchoolProvider>
        </LayoutProvider>   
    );
}