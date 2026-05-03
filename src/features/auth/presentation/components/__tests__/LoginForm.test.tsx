import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../forms";

const mockLogin = vi.hoisted(() => vi.fn());

vi.mock("@/app/providers", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it("should call login with the user's credentials after valid input", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /log in/i });
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, "john@gmail.com");
    await user.type(passwordInput, "12345678");
    await user.click(button);

    expect(emailInput).toHaveValue("john@gmail.com");
    expect(passwordInput).toHaveValue("12345678");

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "john@gmail.com",
        password: "12345678",
      });
    });
  });

  it("shows validation messages and does not submit invalid credentials", async () => {
    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "bad-email");
    await user.type(screen.getByLabelText(/password/i), "short");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Password should be at least 8 characters")).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });
});