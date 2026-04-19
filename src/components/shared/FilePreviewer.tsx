"use client";
import { Button, Dialog, DialogContent } from "@/components/ui";
import { cn } from "@/lib/utils";
import {
  Copy,
  Download,
  ExternalLink,
  FileWarning,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

interface FilePreviewerProps {
  visible: boolean;
  filename: string;
  url?: string | null;
  onDownloadClick?: () => void;
  className?: string;
  mediaClassName?: string;
  enableExpand?: boolean;
}

export function FilePreviewer({
  visible,
  url,
  filename,
  onDownloadClick,
  className,
  mediaClassName,
  enableExpand = true,
}: FilePreviewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const fileExtension = useMemo(
    () => filename.split(".").pop()?.toLowerCase() ?? "",
    [filename]
  );

  const fileType = useMemo(() => {
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(fileExtension)) {
      return "image";
    }
    if (["mp4", "webm", "ogg", "mov"].includes(fileExtension)) {
      return "video";
    }
    if (fileExtension === "pdf") {
      return "pdf";
    }
    if (["doc", "docx", "ppt", "pptx", "xls", "xlsx"].includes(fileExtension)) {
      return "office";
    }
    return "unsupported";
  }, [fileExtension]);

  const officeViewerUrl = useMemo(() => {
    if (!url) return "";
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }, [url]);

  const handleCopyLink = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("File link copied");
    } catch {
      toast.error("Failed to copy file link");
    }
  };

  const handleDownload = () => {
    if (!url) return;
    onDownloadClick?.();
    if (onDownloadClick) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.click();
  };

  const renderUnavailable = () => (
    <div className="relative flex size-full min-h-[160px] flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted px-5 text-center">
      <FileWarning className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        The file doesn&apos;t exist. It may have been removed.
      </p>
    </div>
  );

  const renderUnsupported = () => (
    <div className="relative flex size-full min-h-[160px] flex-col items-center justify-center gap-3 border border-dashed border-border bg-muted px-5 text-center">
      <FileWarning className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {fileExtension || "This"} file type is not supported for inline preview.
      </p>
      {url && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download />
            Download
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Open in new tab
            </a>
          </Button>
        </div>
      )}
    </div>
  );

  const renderMedia = (expanded: boolean) => {
    if (!url) return renderUnavailable();
    if (fileType === "unsupported") return renderUnsupported();
    return (
      <MediaRenderer
        key={`${expanded ? "expanded" : "compact"}-${url}-${filename}`}
        expanded={expanded}
        fileType={fileType}
        fileExtension={fileExtension}
        filename={filename}
        url={url}
        officeViewerUrl={officeViewerUrl}
        mediaClassName={mediaClassName}
      />
    );
  };

  if (!visible) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "group/file-previewer relative size-full overflow-hidden bg-black",
          className
        )}
      >
        {renderMedia(false)}
        {enableExpand && url && (
          <Button
            size="icon-sm"
            variant="secondary"
            className="absolute top-2 right-2 z-20 opacity-0 shadow-md transition-opacity group-hover/file-previewer:opacity-100"
            aria-label="Expand preview"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsExpanded(true);
            }}
          >
            <Maximize2 />
          </Button>
        )}
      </div>

      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent
          title={filename}
          description="Expanded file preview"
          showsDescription={false}
          
          className="overflow-hidden text-white bg-transparent flex h-[calc(100vh-2rem)] min-w-[calc(100vw-10rem)] flex-col justify-between gap-0 p-0"
          showCloseButton={false}
        >
          <Button onClick={() => setIsExpanded(false)}  variant="ghost" size="icon" className="absolute top-4 right-4 text-white">
            <X strokeWidth={3}/>
          </Button>
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="tertiary" onClick={handleCopyLink}>
                <Copy strokeWidth={3} size={18}/>
                Copy link
              </Button>
              <Button size="sm" variant="primary" onClick={handleDownload}>
                <Download strokeWidth={3} size={18}/>
                Download
              </Button>
             
            </div>
             {url && (
                <Button className="border-white/50 bg-white/10 text-white" variant="outline" asChild size="sm">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    Open in new tab
                  </a>
                </Button>
              )}
          </div>
          <div className="relative h-[75vh] shadow-lg w-full p-4">
            <div className="relative size-full overflow-hidden bg-black/80">
              {renderMedia(true)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

type MediaRendererProps = {
  expanded: boolean;
  fileType: "image" | "video" | "pdf" | "office";
  fileExtension: string;
  filename: string;
  url: string;
  officeViewerUrl: string;
  mediaClassName?: string;
};

function MediaRenderer({
  expanded,
  fileType,
  fileExtension,
  filename,
  url,
  officeViewerUrl,
  mediaClassName,
}: MediaRendererProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const baseClass = cn("size-full", mediaClassName);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 z-10 grid place-items-center bg-black/20">
          <Loader2 className="animate-spin text-white/80" />
          <span className="sr-only">Loading media</span>
        </div>
      )}
      {fileType === "pdf" && (
        <iframe
          onLoad={() => setIsLoaded(true)}
          className={cn(baseClass, "border-0")}
          loading="lazy"
          src={url}
          title={filename}
        />
      )}
      {fileType === "office" && (
        <iframe
          onLoad={() => setIsLoaded(true)}
          className={cn(baseClass, "border-0")}
          loading="lazy"
          src={officeViewerUrl}
          title={filename}
        />
      )}
      {fileType === "image" && (
        <Image
          onLoad={() => setIsLoaded(true)}
          className={cn(baseClass, "object-contain")}
          src={url}
          alt={filename}
          fill
          sizes={expanded ? "95vw" : "500px"}
          priority={!expanded}
        />
      )}
      {fileType === "video" && (
        <video
          controls
          className={cn(baseClass, "bg-black object-contain")}
          onLoadedData={() => setIsLoaded(true)}
        >
          <source src={url} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
}