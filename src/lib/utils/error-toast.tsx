import { AppError } from "@/types/errors";
import type { Mutation, MutationState } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CustomToast } from "@/components/ui";

/**
 * Checks if mutation has skipToast flag set in metadata
 */
export function shouldShowToast(
  mutation:
    | Mutation<unknown, unknown, unknown, unknown>
    | MutationState<unknown, unknown, unknown, unknown>
): boolean {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mutationObj = mutation as any;
  const meta = mutationObj.meta || mutationObj.options?.meta;
  console.log(meta?.skipToast)
  return meta?.skipToast !== true;
}

/**
 * Shows an error toast notification with "See More Details" action
 * @param error - The error to display
 * @param options - Optional configuration
 */
export function showErrorToast(
  error: AppError,
  options?: {
    onShowDetails?: () => void;
    duration?: number;
  }
) {
  const { onShowDetails, duration } = options || {};

  toast.error(
    ({ data }) => (
      <CustomToast
        data={data}
        buttonProps={{ variant: "destructive" }}
        type="error"
        action={
          onShowDetails
            ? {
                label: "See More",
                onClick: onShowDetails,
              }
            : undefined
        }
      />
    ),
    {
      data: {
        title: error.userMessage,
        delay: duration,
      },
    }
  );
}