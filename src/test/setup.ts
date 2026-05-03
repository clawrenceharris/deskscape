import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";

vi.mock("@hugeicons/react", () => ({
  HugeiconsIcon: () => createElement("svg", { "aria-hidden": true }),
}));

vi.mock("@hugeicons/core-free-icons", () => ({
  ArrowDown01Icon: "ArrowDown01Icon",
  Cancel01Icon: "Cancel01Icon",
  SearchIcon: "SearchIcon",
  Tick02Icon: "Tick02Icon",
}));

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

vi.stubGlobal(
  "Image",
  class {
    src = "";
  },
);

vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
  return window.setTimeout(() => callback(performance.now()), 0);
});

vi.stubGlobal("cancelAnimationFrame", (id: number) => {
  window.clearTimeout(id);
});

Element.prototype.scrollIntoView = vi.fn();
