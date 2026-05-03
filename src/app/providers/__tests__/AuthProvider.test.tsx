import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMockUser } from "@/test/utils";
import { AuthProvider, useAuth } from "../AuthProvider";

const mocks = vi.hoisted(() => ({
  loginAction: vi.fn(),
  signupAction: vi.fn(),
  signOutAction: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  toastError: vi.fn(),
  onAuthStateChange: vi.fn(),
  unsubscribe: vi.fn(),
}));

vi.mock("@/actions/auth", () => ({
  loginAction: mocks.loginAction,
  signupAction: mocks.signupAction,
  signOutAction: mocks.signOutAction,
}));

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: mocks.onAuthStateChange,
    },
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mocks.replace,
    refresh: mocks.refresh,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: mocks.toastError,
  },
}));

function AuthConsumer() {
  const { user, login, signup, signOut, isLoading } = useAuth();

  return (
    <div>
      <p>{user?.email ?? "Guest"}</p>
      <p>{isLoading ? "Loading" : "Idle"}</p>
      <button
        onClick={() => login({ email: "user@example.com", password: "password" })}
        type="button"
      >
        Login
      </button>
      <button
        onClick={() => signup({ email: "new@example.com", password: "password" })}
        type="button"
      >
        Signup
      </button>
      <button onClick={() => signOut()} type="button">
        Sign out
      </button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.onAuthStateChange.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: mocks.unsubscribe,
        },
      },
    });
  });

  it("syncs user state from Supabase auth changes and unsubscribes", async () => {
    const user = createMockUser({ email: "session@example.com" });
    let authCallback: (_event: string, session: { user: typeof user } | null) => void = () => {};
    mocks.onAuthStateChange.mockImplementation((callback) => {
      authCallback = callback;
      return {
        data: {
          subscription: {
            unsubscribe: mocks.unsubscribe,
          },
        },
      };
    });

    const { unmount } = render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    expect(screen.getByText("Guest")).toBeInTheDocument();

    authCallback("SIGNED_IN", { user });

    await waitFor(() => expect(screen.getByText("session@example.com")).toBeInTheDocument());

    unmount();
    expect(mocks.unsubscribe).toHaveBeenCalled();
  });

  it("logs in, signs up, and navigates home on success", async () => {
    const user = userEvent.setup();
    const authUser = createMockUser();
    mocks.loginAction.mockResolvedValue({ success: true, data: authUser });
    mocks.signupAction.mockResolvedValue({ success: true, data: authUser });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(mocks.loginAction).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "password",
      });
      expect(mocks.replace).toHaveBeenCalledWith("/");
      expect(mocks.refresh).toHaveBeenCalled();
    });

    await user.click(screen.getByRole("button", { name: "Signup" }));

    await waitFor(() => {
      expect(mocks.signupAction).toHaveBeenCalledWith({
        email: "new@example.com",
        password: "password",
      });
    });
  });

  it("shows sign-out errors and still returns to login", async () => {
    const user = userEvent.setup();
    mocks.signOutAction.mockResolvedValue({ success: false, error: "Could not sign out" });

    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => {
      expect(mocks.toastError).toHaveBeenCalledWith("Could not sign out");
      expect(mocks.replace).toHaveBeenCalledWith("/auth/login");
      expect(mocks.refresh).toHaveBeenCalled();
    });
  });

  it("throws when useAuth is used outside AuthProvider", () => {
    expect(() => render(<AuthConsumer />)).toThrow("useAuth must be used within a AuthProvider");
  });
});
