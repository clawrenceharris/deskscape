import { describe, expect, it } from "vitest";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
} from "../auth";
import { createDeskSchema } from "../desk";
import { createNotebookSchema, updateNotebookSchema } from "../notebook";
import { createProfileSchema, updateProfileSchema, usernameSchema } from "../profile";

function makeFile(name: string, type: string, size = 1024) {
  return new File(["x".repeat(size)], name, { type });
}

describe("auth validation", () => {
  it("accepts valid auth payloads", () => {
    expect(loginSchema.safeParse({ email: "user@example.com", password: "password" }).success).toBe(
      true,
    );
    expect(signUpSchema.safeParse({ email: "user@example.com", password: "password" }).success).toBe(
      true,
    );
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
    expect(resetPasswordSchema.safeParse({ newPassword: "password" }).success).toBe(true);
  });

  it("rejects invalid email and short passwords with user-facing messages", () => {
    expect(loginSchema.safeParse({ email: "bad", password: "short" }).error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Please enter a valid email address" }),
        expect.objectContaining({ message: "Password must be at least 8 characters long" }),
      ]),
    );
  });
});

describe("desk validation", () => {
  it("accepts valid desk data with an optional image", () => {
    const result = createDeskSchema.safeParse({
      name: "Biology",
      schoolId: "0f6a30a1-3193-4948-aeb4-95a803b9ee7a",
      imageFile: makeFile("desk.png", "image/png"),
      isPublic: true,
    });

    expect(result.success).toBe(true);
  });

  it("rejects missing names, invalid school ids, oversized images, and non-images", () => {
    expect(createDeskSchema.safeParse({ name: "", schoolId: "bad" }).error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Name is required" }),
        expect.objectContaining({ message: "Please select a school" }),
      ]),
    );

    expect(
      createDeskSchema.safeParse({
        name: "Biology",
        schoolId: "0f6a30a1-3193-4948-aeb4-95a803b9ee7a",
        imageFile: makeFile("notes.pdf", "application/pdf"),
      }).error?.issues,
    ).toEqual(expect.arrayContaining([expect.objectContaining({ message: "Please choose an image file" })]));
  });
});

describe("notebook validation", () => {
  it("requires a title and file-backed materials when creating notebooks", () => {
    expect(
      createNotebookSchema.safeParse({
        title: "Cell structure",
        materials: [{ type: "NOTES", file: makeFile("notes.pdf", "application/pdf") }],
      }).success,
    ).toBe(true);

    expect(createNotebookSchema.safeParse({ title: "", materials: [] }).error?.issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ message: "Title is required" })]),
    );
  });

  it("allows partial update payloads", () => {
    expect(updateNotebookSchema.safeParse({ description: "Updated" }).success).toBe(true);
  });
});

describe("profile validation", () => {
  it("validates usernames and profile image files", () => {
    expect(usernameSchema.safeParse("valid_user.1").success).toBe(true);
    expect(usernameSchema.safeParse("no spaces").error?.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          message: "Username can only contain letters, numbers, underscores, and periods",
        }),
      ]),
    );

    expect(
      createProfileSchema.safeParse({
        displayName: "Caleb",
        schoolId: "school-1",
        username: "caleb",
        avatarFile: makeFile("avatar.png", "image/png"),
      }).success,
    ).toBe(true);

    expect(
      createProfileSchema.safeParse({
        displayName: "C",
        schoolId: "",
        username: "ab",
      }).error?.issues,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ message: "Name must be at least 2 characters" }),
        expect.objectContaining({ message: "Please select a school" }),
        expect.objectContaining({ message: "Username must be at least 3 characters" }),
      ]),
    );
  });

  it("allows partial profile updates", () => {
    expect(updateProfileSchema.safeParse({ displayName: "Updated" }).success).toBe(true);
  });
});
