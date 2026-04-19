"use client";

import { ErrorState } from "@/components/states";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div className="centered bg-linear-to-br to-primary from-accent">
      <ErrorState variant="card" buttonVariant="tertiary" onAction={() => router.refresh()} actionLabel="Refresh" />
    </div>
  );
}