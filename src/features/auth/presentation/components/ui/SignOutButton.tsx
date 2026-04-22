"use client"
import { useAuth } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";

export function SignOutButton() {
    const { signOut, isLoading } = useAuth();
    return (
        <Button variant="outline" onClick={signOut} disabled={isLoading}>
            {isLoading ? <Loader2 className="animate-spin" /> : <LogOut /> } Sign Out
        </Button>
    );
}