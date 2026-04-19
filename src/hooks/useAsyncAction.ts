import { ActionResult, ActionResultWithData } from "@/actions";
import { getUserErrorMessage } from "@/lib/utils/errors";
import { useCallback, useState } from "react";

export function useAsyncAction<TData>() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);
    
    const executeWithData = useCallback(async (fn: () => Promise<ActionResultWithData<TData>>): Promise<ActionResultWithData<TData>> => {
    
        try {
            setIsLoading(true);
            const result = await fn();
            if(!result.success){
                throw result.error;
            }
            return result;
        } catch (error) {
            const errorMessage = getUserErrorMessage(error)
            setError(errorMessage);
            return {success: false, error: errorMessage};
        } finally {
            setIsLoading(false);
        }
      },[]);
    const execute = useCallback(async (fn: () => Promise<ActionResult>): Promise<ActionResult> => {
        try {
            setIsLoading(true);
            const result = await fn();
            return result;
        }
        catch (error) {
            const errorMessage = getUserErrorMessage(error)
            setError(errorMessage);
            return {success: false, error: errorMessage};
        } finally {
            setIsLoading(false);
        }
    },[]);
    return {isLoading, error,executeWithData, execute};
}
