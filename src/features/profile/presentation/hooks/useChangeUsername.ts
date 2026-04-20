/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { checkUsernameAvailability } from "@/actions/profile";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { useEffect } from "react";
import {  UseFormReturn, useWatch    } from "react-hook-form";

type UseChangeUsernameProps= {
    userId: string | null;
    form: UseFormReturn<any>;
}
export const useChangeUsername = ({userId, form}: UseChangeUsernameProps) => {
  const { control, clearErrors, setError } = form;
  const username = useWatch({ control, name: "username" });
  
  useEffect(() => {
    if(!username) {
        return;
    }
    const checkUsername = async () => {
        if(!userId) return;

        form.clearErrors("username");
        const result = await checkUsernameAvailability(username, userId);
        if(result.success){
            if(!result.data.isAvailable){
                form.setError("username", {message: "Username already exists"});
            }
        }
        else{
            form.setError("username", {message: getUserErrorMessage(result.error)});
        }
    }
    checkUsername();
}, [username, userId, clearErrors, setError, form]);

   
}