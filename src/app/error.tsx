"use client";
import { ErrorState } from "@/components/states";

export default function ErrorPage() {
  return (
    <div className="centered bg-linear-to-br to-primary from-accent">
      <ErrorState variant="card" buttonVariant="tertiary" onAction={() => window.location.reload()} actionLabel="Refresh" />
    </div>
  );
}