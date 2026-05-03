import { act, renderHook } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { AppErrorCode, AuthenticationError } from "@/types";
import { createMultiQueryOptimisticUpdate, useMutationError } from "../mutations";

describe("createMultiQueryOptimisticUpdate", () => {
  it("updates all configured cached queries and rolls them back on error", async () => {
    const queryClient = new QueryClient();
    const detailKey = ["notebooks", "detail", "notebook-1"];
    const listKey = ["notebooks", "desk", "desk-1"];

    queryClient.setQueryData(detailKey, { id: "notebook-1", downloads: 1 });
    queryClient.setQueryData(listKey, [{ id: "notebook-1", downloads: 1 }]);

    const { onMutate, onError } = createMultiQueryOptimisticUpdate(queryClient, {
      cancelKey: ["notebooks"],
      queries: [
        {
          getKey: () => detailKey,
          updater: (old) => ({ ...old, downloads: old.downloads + 1 }),
        },
        {
          getKey: () => listKey,
          updater: (old) =>
            old.map((item: { id: string; downloads: number }) => ({
              ...item,
              downloads: item.downloads + 1,
            })),
        },
      ],
    });

    const context = await onMutate({ notebookId: "notebook-1" });

    expect(queryClient.getQueryData(detailKey)).toMatchObject({ downloads: 2 });
    expect(queryClient.getQueryData(listKey)).toEqual([
      { id: "notebook-1", downloads: 2 },
    ]);

    onError(new Error("failed"), { notebookId: "notebook-1" }, context);

    expect(queryClient.getQueryData(detailKey)).toMatchObject({ downloads: 1 });
    expect(queryClient.getQueryData(listKey)).toEqual([
      { id: "notebook-1", downloads: 1 },
    ]);
  });

  it("does not create missing cache entries during optimistic updates", async () => {
    const queryClient = new QueryClient();

    const { onMutate } = createMultiQueryOptimisticUpdate(queryClient, {
      cancelKey: ["missing"],
      queries: [
        {
          getKey: () => ["missing", "detail"],
          updater: vi.fn(),
        },
      ],
    });

    await onMutate({});

    expect(queryClient.getQueryData(["missing", "detail"])).toBeUndefined();
  });
});

describe("useMutationError", () => {
  it("normalizes unknown errors and exposes modal props", () => {
    const { result } = renderHook(() => useMutationError());

    act(() => {
      result.current.handleError({ message: "Invalid login credentials" }, "Login");
    });

    expect(result.current.showModal).toBe(true);
    expect(result.current.error).toMatchObject({
      name: "AuthenticationError",
      code: AppErrorCode.AUTH_INVALID_CREDENTIALS,
    });
    expect(result.current.errorModalProps).toMatchObject({
      open: true,
      context: "Login",
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.showModal).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.errorModalProps).toBeNull();
  });

  it("can show an already-normalized modal error", () => {
    const { result } = renderHook(() => useMutationError());
    const error = new AuthenticationError(
      AppErrorCode.AUTH_EMAIL_NOT_CONFIRMED,
      "Confirm your email.",
    );

    act(() => {
      result.current.showErrorModal(error, "Signup");
    });

    expect(result.current.error).toBe(error);
    expect(result.current.errorModalProps).toMatchObject({
      error,
      context: "Signup",
      open: true,
    });
  });
});
