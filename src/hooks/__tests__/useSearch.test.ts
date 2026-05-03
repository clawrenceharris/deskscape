import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useSearch } from "../useSearch";

const items = [
  { id: 1, name: "Algebra" },
  { id: 2, name: "Biology" },
  { id: 3, name: "Calculus" },
];

describe("useSearch", () => {
  it("debounces and filters synchronous data", async () => {
    const { result } = renderHook(() =>
      useSearch({
        data: items,
        filter: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
        debounceMs: 1,
      }),
    );

    act(() => {
      result.current.search("bio");
    });

    expect(result.current.results).toEqual([]);

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: 2, name: "Biology" }]);
    });
    expect(result.current.hasSearched).toBe(true);
  });

  it("does not search below the minimum query length", async () => {
    const { result } = renderHook(() =>
      useSearch({
        data: items,
        filter: () => true,
        minQueryLength: 3,
        debounceMs: 1,
      }),
    );

    act(() => {
      result.current.search("bi");
    });

    await waitFor(() => expect(result.current.hasSearched).toBe(false));
    expect(result.current.results).toEqual([]);
  });

  it("captures async data failures and retries the latest query", async () => {
    const data = vi
      .fn<() => Promise<typeof items>>()
      .mockRejectedValueOnce(new Error("Search failed"))
      .mockResolvedValueOnce(items);

    const { result } = renderHook(() =>
      useSearch({
        data,
        filter: (item, query) => item.name.toLowerCase().includes(query.toLowerCase()),
        debounceMs: 1,
      }),
    );

    await act(async () => {
      result.current.search("alg");
    });

    await waitFor(() => {
      expect(result.current.error).toBe("Search failed");
    });

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.error).toBeNull();
      expect(result.current.results).toEqual([{ id: 1, name: "Algebra" }]);
    });
  });

  it("clears query state and results", async () => {
    const { result } = renderHook(() =>
      useSearch({
        data: items,
        filter: (item) => item.id === 1,
        debounceMs: 1,
      }),
    );

    await act(async () => {
      result.current.search("alg");
    });

    await waitFor(() => expect(result.current.hasSearched).toBe(true));

    act(() => {
      result.current.clearResults();
    });

    expect(result.current.query).toBe("");
    expect(result.current.results).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.hasSearched).toBe(false);
  });
});
