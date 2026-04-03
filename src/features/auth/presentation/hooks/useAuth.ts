"use client"
import { useCallback } from "react";
import { signOut as signOutAction } from "@/actions/auth";
import { toast } from "react-toastify";


export function useAuth() {
    const signOut = useCallback(async () => {
        const {success, error} = await signOutAction();
        if(!success) {
            toast.error(error.message);
        }
    }, []);
    return {
        signOut
    }
  }