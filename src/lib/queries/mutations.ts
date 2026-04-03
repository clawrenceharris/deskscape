/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  
    QueryClient,
    QueryKey,
   
  } from "@tanstack/react-query";
  import { useCallback, useState } from "react";
  import { AppError } from "@/types";
  import { normalizeError } from "@/lib/utils/errors";
  
  /**
   * Configuration for a single query update in a multi-query optimistic update
   */
  export interface QueryUpdateConfig<TVariables> {
    /** Function that returns the query key for this query (can use variables) */
    getKey: (variables: TVariables) => QueryKey;
    /** Function that updates the query data (receives old data and variables) */
    updater: (oldData: any, variables: TVariables) => any;
  }
  
  /**
   * Configuration for multi-query optimistic updates
   */
  export interface MultiQueryOptimisticUpdateConfig<TVariables, TContext> {
    /** Query key to cancel before updating (usually a base key like ['playbooks']) */
    cancelKey: QueryKey;
    /** Array of query configurations to update */
    queries: QueryUpdateConfig<TVariables>[];
    /** Optional function to create custom context from snapshots */
    createContext?: (
      snapshots: Record<string, any>,
      variables: TVariables
    ) => TContext;
  }
  
  /**
   * Creates optimistic update handlers (onMutate and onError) for mutations that need
   * to update multiple queries. Handles cancellation, snapshotting, updating, and rollback.
   *
   * @example
   * ```typescript
   * const { onMutate, onError } = createMultiQueryOptimisticUpdate({
   *   cancelKey: playbookKeys.all,
   *   queries: [
   *     {
   *       getKey: (vars) => playbookKeys.detail(vars.id),
   *       updater: (old, vars) => ({ ...old, favorite: vars.favorite }),
   *     },
   *     {
   *       getKey: (vars) => playbookKeys.byUser(userId),
   *       updater: (old, vars) => old?.map(p => p.id === vars.id ? { ...p, favorite: vars.favorite } : p),
   *     },
   *   ],
   * });
   * ```
   */
  export function createMultiQueryOptimisticUpdate<
    TVariables,
    TContext = Record<string, unknown>
  >(
    queryClient: QueryClient,
    config: MultiQueryOptimisticUpdateConfig<TVariables, TContext>
  ) {
    const { cancelKey, queries, createContext } = config;
  
    const onMutate = async (variables: TVariables): Promise<TContext> => {
      // Cancel all queries matching the cancel key
      await queryClient.cancelQueries({ queryKey: cancelKey });
  
      // Snapshot previous values for all queries
      const snapshots: Record<string, any> = {};
      for (const query of queries) {
        const key = query.getKey(variables);
        const keyStr = JSON.stringify(key);
        snapshots[keyStr] = queryClient.getQueryData(key);
      }
  
      // Optimistically update all queries
      for (const query of queries) {
        const key = query.getKey(variables);
        const oldData = snapshots[JSON.stringify(key)];
  
        // Only update if data exists
        if (oldData !== undefined) {
          const newData = query.updater(oldData, variables);
          queryClient.setQueryData(key, newData);
        }
      }
  
      // Return context (either custom or snapshots)
      if (createContext) {
        return createContext(snapshots, variables);
      }
      return snapshots as TContext;
    };
  
    const onError = (
      err: unknown,
      variables: TVariables,
      context: unknown
    ): void => {
      // Rollback all queries to their previous values
      if (context) {
        const ctx = context as TContext;
        const snapshots =
          ctx instanceof Object && "snapshots" in ctx
            ? (ctx as Record<string, unknown>).snapshots
            : ctx;
  
        if (typeof snapshots === "object" && snapshots !== null) {
          for (const query of queries) {
            const key = query.getKey(variables);
            const keyStr = JSON.stringify(key);
            const previousData = (snapshots as Record<string, unknown>)[keyStr];
  
            if (previousData !== undefined) {
              queryClient.setQueryData(key, previousData);
            }
          }
        }
      }
    };
  
    return { onMutate, onError };
  }
  
  /**
   * Hook to handle mutation errors with modal support
   * Useful for components that need custom error handling
   */
  export function useMutationError() {
    const [error, setError] = useState<AppError | null>(null);
    const [errorContext, setErrorContext] = useState<string | undefined>();
    const [showModal, setShowModal] = useState(false);
  
    const handleError = useCallback((error: unknown, context?: string) => {
      const normalizedError = normalizeError(error);
      setError(normalizedError);
      setErrorContext(context);
      setShowModal(true);
    }, []);
  
    const showErrorModal = useCallback((error: AppError, context?: string) => {
      setError(error);
      setErrorContext(context);
      setShowModal(true);
    }, []);
  
    const clearError = useCallback(() => {
      setError(null);
      setErrorContext(undefined);
      setShowModal(false);
    }, []);
  
    return {
      error,
      errorContext,
      showModal,
      handleError,
      showErrorModal,
      clearError,
      // ErrorDetailModal props for rendering in component
      errorModalProps: error
        ? {
            error,
            open: showModal,
            onOpenChange: setShowModal,
            context: errorContext,
          }
        : null,
    };
  }
  