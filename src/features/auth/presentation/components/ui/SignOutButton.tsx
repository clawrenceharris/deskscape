"use client"
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function SignOutButton() {
    const { signOut } = useAuth();
    return (
        <Button variant="outline" onClick={signOut}>
            <LogOut />
            Sign Out
        </Button>
    );
}