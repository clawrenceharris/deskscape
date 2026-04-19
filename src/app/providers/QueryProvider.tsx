/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode, useState, useEffect } from "react";
import { ErrorDetailModal } from "@/components/modals/ErrorModal";
import { AppError } from "@/types/errors";
import { useMutationError } from "@/lib/queries/mutations";
import { normalizeError } from "@/lib/utils/errors";
import { showErrorToast } from "@/lib/utils/error-toast";
import { ApplicationError } from "@/lib/utils/errors";

export function QueryProvider({ children }: { children: ReactNode }) {
  const { errorModalProps, showErrorModal, clearError } = useMutationError();

  const [queryClient] = useState(() => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000, // 5 minutes
          gcTime: 10 * 60 * 1000, // 10 minutes
          retry: (failureCount, error) => {
            // Don't retry on client errors (4xx)
            if (error && typeof error === "object" && "status" in error) {
              const status = (error as any).status;
              if (status >= 400 && status < 500) {
                return false;
              }
            }
            // Retry up to 3 times for other errors
            return failureCount < 3;
          },
          retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 30000),
          refetchOnWindowFocus: true,
          refetchOnReconnect: true,
        },

        mutations: {
          onError: (error) => {
            // Normalize the error
            const normalizedError = normalizeError(error);

            // Show toast with "See More" action
            // The actual modal opening will be handled via mutation observer
            // Show toast with "See More" action
            showErrorToast(normalizedError, {
              onShowDetails: () => {
                // Access error modal handler via window
                if (typeof window !== "undefined") {
                  const errorHandler = (
                    window as {
                      __showErrorModal?: (
                        error: ApplicationError,
                        context?: string
                      ) => void;
                    }
                  ).__showErrorModal;
                  if (errorHandler) {
                    errorHandler(normalizedError);
                  }
                }
              },
            });
          },

          retry: (failureCount, error) => {
            // Don't retry mutations on client errors
            if (error && typeof error === "object" && "status" in error) {
              const status = (error as any).status;
              if (status >= 400 && status < 500) {
                return false;
              }
            }
            // Retry up to 2 times for server errors
            return failureCount < 2;
          },
        },
      },
    });

    return client;
  });

  // Setup error modal handler after component mounts
  useEffect(() => {
    // Store handler on window for error handler access
    if (typeof window !== "undefined") {
      (
        window as {
          __showErrorModal?: (error: AppError, context?: string) => void;
        }
      ).__showErrorModal = showErrorModal;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (
          window as {
            __showErrorModal?: (error: AppError, context?: string) => void;
          }
        ).__showErrorModal;
      }
    };
  }, [showErrorModal]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {errorModalProps && (
        <ErrorDetailModal
          {...errorModalProps}
          onOpenChange={(open) => {
            errorModalProps.onOpenChange(open);
            if (!open) clearError();
          }}
        />
      )}
      <ReactQueryDevtools />

    </QueryClientProvider>
  );
}