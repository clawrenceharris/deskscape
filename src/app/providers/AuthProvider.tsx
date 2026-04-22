"use client";
import { loginAction, signOutAction, signupAction } from "@/actions/auth";
import { supabase } from "@/lib/supabase/client";
import { ApplicationError } from "@/shared/kernel";
import { LoginFormValues, SignUpFormValues } from "@/types";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type AuthContextType = {
    user: User | null;
    signup: (data: SignUpFormValues) => Promise<void>;
    login: (data: LoginFormValues) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
   

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const subscription = supabase.auth.onAuthStateChange((_, session) => {
        if(session?.user){
            setUser(session.user);
        }
        else{
            setUser(null);
        }
    });
    return () => subscription.data.subscription.unsubscribe();
            
    },[]);


    /**
     * Sign up the user
     * @param data - The sign up data
     * @throws ApplicationError if the sign up fails
     */
    const signup = useCallback(async (data: SignUpFormValues) => {
        setIsLoading(true);
        const result = await signupAction(data);
        if(!result.success) {
            throw new ApplicationError(result.error);
        }
        setUser(result.data);
        router.replace("/home");
        router.refresh();
        setIsLoading(false);
    }, [router]);
    /**
     * Login the user
     * @param data - The login data
     * @throws ApplicationError if the login fails
     */
    const login = useCallback(async (data: LoginFormValues) => {
        setIsLoading(true);
        const result = await loginAction(data);
        if(!result.success) {
            throw new ApplicationError(result.error);
        }
        setUser(result.data);
        router.replace("/home");
        router.refresh();
        setIsLoading(false);
    }, [router]);

    /**
     * Sign out the user
     */
    const signOut = useCallback(async () => {
        setIsLoading(true);
        const result = await signOutAction();
        if(!result.success) {
            toast.error(result.error);
        }

        setUser(null);
        router.replace("/auth/login");
        router.refresh();
        setIsLoading(false);
    }, [router]);

    const value = {
        user,
        signup,
        login,
        signOut,
        isLoading,
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}