import { useQuery } from "@tanstack/react-query";
import { notebookKeys } from "@/lib/queries";
import { ApplicationError } from "@/lib/utils/errors";
import { getNotebookById } from "@/actions/notebook/getNotebookById";

const DESK_ITEM_QUERY_TIMEOUT_MS = 20_000;

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, timeoutMessage: string): Promise<T> {
    return await new Promise<T>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            reject(new ApplicationError(timeoutMessage));
        }, timeoutMs);
        promise
            .then((value) => {
                clearTimeout(timeoutId);
                resolve(value);
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                reject(error);
            });
    });
}

export function useNotebook(notebookId: string | null) {
    return useQuery({
        queryKey: notebookKeys.detail(notebookId ?? ""),
        queryFn: async () => {
            if(!notebookId){
                throw new Error("notebookId is required to fetch a notebook.");
            }
            const result = await withTimeout(
                getNotebookById(notebookId),
                DESK_ITEM_QUERY_TIMEOUT_MS,
                "Loading this notebook is taking longer than expected. Please try again."
            );
            if(!result.success){
                throw new ApplicationError(result.error);
            }
            return result.data;
        },
        enabled: !!notebookId,
        retry: 1,
    });
}