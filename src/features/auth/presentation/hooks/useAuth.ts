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
        async function fetchUser(){
            try{
                const {data, error} = await supabase.auth.getUser();
                if(error){
                   throw error;
                }
                setUser(data.user);
            }
            catch{
                setUser(null)
            }
        }
        fetchUser()
    },[]);
    
    const signOut = useCallback(async () => {
        const result = await execute(() => signOutAction());
        if(!result.success) {
            toast.error(result.error);
        }
    }, [execute]);
    return {
        signOut,
        user,
        isLoading,
    }
  }