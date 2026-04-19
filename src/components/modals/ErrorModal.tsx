"use client";

import { useState } from "react";
import {Button, Dialog, DialogContent, DialogDescription, DialogFooter } from "@/components/ui";

import { ApplicationError } from "@/lib/utils/errors";
import { Copy, Check } from "lucide-react";

interface ErrorDetailModalProps {
  error: ApplicationError | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ErrorDetailModal({
  error,
  open,
  onOpenChange,
}: ErrorDetailModalProps) {
  const [copied, setCopied] = useState(false);

  if (!error) return null;

  const copyErrorDetails = () => {
    const errorText = `
Message: ${error.message}
`.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          title="Error Details"
          className="max-w-2xl"
        >
          <DialogDescription>
          Something went wrong. See details below.
          </DialogDescription>
          <div className="space-y-4">
            {/* User-friendly message */}
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
              <p className="font-medium text-destructive mb-2">
                What happened?
              </p>
              <p className="text-sm">{error.message}</p>
            </div>

            
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={copyErrorDetails}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  Copy Details
                </>
              )}
            </Button>
           
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

     
    </>
  );
}