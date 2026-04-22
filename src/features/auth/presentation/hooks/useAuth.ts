"use client"
import { useCallback, useEffect, useMemo, useState } from "react";
import { signOutAction as signOutAction } from "@/actions/auth";
import { toast } from "react-toastify";
import { useAsyncAction } from "@/hooks/useAsyncAction";
import { ActionResult } from "@/actions";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";


export function useAuth() {

    const {isLoading, execute} = useAsyncAction<ActionResult>();
    const [user, setUser] = useState<User | null>(null)
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
    
    const signOut = useCallback(async () => {
        const result = await execute(() => signOutAction());
        if(!result.success) {
            toast.error(result.error);
        }
        setUser(null);
    }, [execute]);
    return {
        signOut,
        user,
        isLoading,
    }
  }