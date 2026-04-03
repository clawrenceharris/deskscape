"use client";
import { getUserProfile } from "@/actions/profile";
import { useQuery } from "@tanstack/react-query";
const profileKeys = {
    all: ["profiles"],
    byId: (id?: string) => id ? [...profileKeys.all, id] : profileKeys.all,
}
export const useProfile = (userId?: string) => {
    const { data, isLoading, error } = useQuery({
        queryKey: profileKeys.byId(userId),
        queryFn: async () =>{
            if (!userId) return null;
            const {data: profile} = await getUserProfile(userId);
            return profile;
        },
        enabled: !!userId,
    });
    return { data, isLoading, error };
}