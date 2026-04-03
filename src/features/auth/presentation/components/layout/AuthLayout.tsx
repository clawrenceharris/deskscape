"use client"
import React from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  authType: "login" | "sign-up";
}
export function AuthLayout({ children, authType }: AuthLayoutProps) {
  return (
    <div className="w-full m-auto max-w-3xl overflow-hidden items-center justify-center md:min-w-160 flex-col md:flex-row flex  p-3 h-full  max-h-160">
      <Card className="w-full shadow-md overflow-y-auto h-full rounded-2xl">
        <CardHeader className="border-b p-6 bg-card">
          <CardTitle className="text-2xl flex items-center font-semibold">
            Welcome to E-Desk
          </CardTitle>
        </CardHeader>
        <CardContent className="flex h-full   items-center">
          {children}
        </CardContent>
        <CardFooter className="text-sm justify-center">
          {authType === "sign-up"
            ? "Already have an account?"
            : "Don't have an account?"}
          <Link
            href={authType === "login" ? "/auth/sign-up" : "/auth/login"}
            className="font-medium ml-1 underline btn-link text-primary"
          >
            {authType === "login" ? "Sign up" : "Log in"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
