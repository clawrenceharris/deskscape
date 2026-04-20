"use client";
import { Button, Dialog, DialogContent } from "@/components/ui";
import { NotebookMaterial } from "@/features/notebook/infrastructure/queries";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileWarning,
  Loader2,
  Maximize2,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

interface FilePreviewerProps {
  materials: NotebookMaterial[];
  onDownloadClick?: (url: string) => void;
  className?: string;
  mediaClassName?: string;
  enableExpand?: boolean;
  materialIndex?: number;
  onMaterialIndexChange?: (index: number) => void;
  enableNavigation?: boolean;
}

export function FilePreviewer({
  materials = [],
  onDownloadClick,
  className,
  mediaClassName,
  enableNavigation = true,
  enableExpand = true,
  materialIndex: controlledMaterialIndex,
  onMaterialIndexChange,
}: FilePreviewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uncontrolledMaterialIndex, setUncontrolledMaterialIndex] = useState(0);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(() => new Set());
  const prefetchedUrlsRef = useRef<Set<string>>(new Set());
  const materialIndex = controlledMaterialIndex ?? uncontrolledMaterialIndex;
  const material = materials?.[Math.min(materialIndex, materials.length - 1)] ?? null;
  const fileExtension = useMemo(
    () => material?.title?.split(".").pop()?.toLowerCase() ?? "",
    [material]
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
    if (!material?.url) return "";
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(material.url)}`;
  }, [material]);
  const markUrlLoaded = useCallback((url: string) => {
    setLoadedUrls((previous) => {
      if (!url || previous.has(url)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(url);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!materials.length) return;
    const prefetchMaterial = (nextMaterial: NotebookMaterial | undefined) => {
      const nextUrl = nextMaterial?.url;
      if (!nextUrl || prefetchedUrlsRef.current.has(nextUrl) || loadedUrls.has(nextUrl)) {
        return;
      }
      prefetchedUrlsRef.current.add(nextUrl);
      const nextExtension = nextMaterial?.title?.split(".").pop()?.toLowerCase() ?? "";
      const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(nextExtension);
      if (isImage) {
        const img = new window.Image();
        img.src = nextUrl;
        return;
      }
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = nextUrl;
      document.head.appendChild(link);
    };

    const nextIndex = materialIndex >= materials.length - 1 ? 0 : materialIndex + 1;
    const prevIndex = materialIndex <= 0 ? materials.length - 1 : materialIndex - 1;
    prefetchMaterial(materials[nextIndex]);
    prefetchMaterial(materials[prevIndex]);
  }, [loadedUrls, materialIndex, materials]);
  
  const handleCopyLink = async () => {
    if (!material?.url) return;
    try {
      await navigator.clipboard.writeText(material.url);
      toast.success("File link copied");
    } catch {
      toast.error("Failed to copy file link");
    }
  };

  const handleDownload = () => {
    if (!material?.url) return;
    onDownloadClick?.(material.url);    
  };
  const setMaterialIndex = useCallback((index: number) => {
    if (onMaterialIndexChange) {
      onMaterialIndexChange(index);
      return;
    }
    setUncontrolledMaterialIndex(index);
  }, [onMaterialIndexChange]);

  useEffect(() => {
    if (!materials.length) return;
    if (materialIndex < materials.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMaterialIndex(materials.length - 1);
  }, [materialIndex, materials.length, setMaterialIndex]);

  const goPrevMaterial = () => {
    if (materials.length <= 0) return;
    setMaterialIndex(materialIndex <= 0 ? materials.length - 1 : materialIndex - 1);
  };
  const goNextMaterial = () => {
    if(materials.length <= 0) return;
    setMaterialIndex(materialIndex >= materials.length - 1 ? 0 : materialIndex + 1);
  };

  const renderUnavailable = () => (
    <div className="relative flex size-full min-h-[160px] flex-col items-center justify-center gap-2 border border-dashed border-border bg-muted px-5 text-center">
      <FileWarning className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        The file doesn&apos;t exist. It may have been removed.
      </p>
    </div>
  );
  const renderEmpty = () => (
    <div className="relative flex size-full min-h-[160px] flex-col items-center justify-center gap-2 bg-muted px-5 text-center">
      <FileWarning className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        There are no files in this upload.
      </p>
    </div>
  );
  const renderUnsupported = () => (
    <div className="relative flex size-full min-h-[160px] flex-col items-center justify-center gap-3 bg-muted px-5 text-center">
      <FileWarning className="size-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        {fileExtension || "This"} file type is not supported for inline preview.
      </p>
      {material && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download />
            Download
          </Button>
          <Button asChild size="sm" variant="ghost">
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
              Open in new tab
            </a>
          </Button>
        </div>
      )}
    </div>
  );

  const renderMedia = (expanded: boolean) => {
    if (!materials.length) return renderEmpty();
    if (!material?.url) return renderUnavailable();

    if (fileType === "unsupported") return renderUnsupported();
    return (
      <>
       
      <MediaRenderer
        key={`${expanded ? "expanded" : "compact"}-${material.url}-${material.title}`}
        expanded={expanded}
        fileType={fileType}
        fileExtension={fileExtension}
        filename={material.title ?? ""}
        url={material.url}
        officeViewerUrl={officeViewerUrl}
        isLoaded={!!material.url && loadedUrls.has(material.url)}
        onLoaded={markUrlLoaded}
        mediaClassName={mediaClassName}
      />
      
      </>
    );
  };

  return (
    <>
      <div
        className={cn(
          "group/file-previewer relative size-full overflow-hidden bg-black",
          className
        )}
      >
        {materials?.length > 1 && enableNavigation && 
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between pointer-events-none">
            <Button
              size="icon"
              variant="ghost"
              className="absolute z-20  pointer-events-auto text-white bg-black/50 hover:bg-black/30 rounded-full p-2 left-3"
              aria-label="View previous image"
              onClick={goPrevMaterial}
            >
              <ChevronLeft strokeWidth={3} />
            </Button>

            <Button
              className="absolute z-20  pointer-events-auto active:translate-y-none text-white bg-black/50 hover:bg-black/30 rounded-full p-2 right-3"
              size="icon"
              variant="ghost"
              aria-label="View next image"
              onClick={goNextMaterial}
            >
              <ChevronRight strokeWidth={3} />
            </Button>
          </div>}
      
        {renderMedia(false)}
        {enableExpand && material?.url && (
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
            <Maximize2 strokeWidth={3}/>
          </Button>
        )}
      </div>

      {materials?.length > 0 && <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent
          title={material.title ?? ""}
          description="Expanded file preview"
          showsDescription={false}
          
          className="text-white bg-transparent flex h-[calc(100vh-2rem)] min-w-[calc(100vw-10rem)] flex-col justify-between gap-0 p-0"
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
             {material.url && (
                <Button className="border-white/50 bg-white/10 text-white" variant="outline" asChild size="sm">
                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink />
                    Open in new tab
                  </a>
                </Button>
              )}
          </div>
         
          <div className="relative h-[80vh] flex items-center justify-center shadow-lg w-full p-4">
            
          {materials.length > 1 && (
            <>
            {/* Left Arrow Button */}
            <Button
                size="icon-lg"
                variant="ghost"
                aria-label="Previous file"
                className="absolute -left-10 bg-black/70 hover:bg-black/90 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrevMaterial();
                }}
              >
                <ChevronLeft strokeWidth={3} size={32} />
              </Button>
               {/* Right Arrow Button */}
               <Button
                size="icon-lg"
                variant="ghost"
                aria-label="Next file"
                className="absolute -right-10 bg-black/70 hover:bg-black/90 text-white rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  goNextMaterial();
                }}
              >
                <ChevronRight strokeWidth={3} size={32} />
              </Button>
            </>
            )}
            <div className="relative size-full overflow-hidden bg-black/80 flex items-center justify-center">
              
              {/* Media Content */}
              <div className="flex-1 flex items-center justify-center h-full relative mx-8">
                {renderMedia(true)}
              </div>
             
            </div>
       
          </div>
        </DialogContent>
      </Dialog>}
      
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
  isLoaded: boolean;
  onLoaded: (url: string) => void;
  mediaClassName?: string;
};

function MediaRenderer({
  expanded,
  fileType,
  fileExtension,
  filename,
  url,
  officeViewerUrl,
  isLoaded,
  onLoaded,
  mediaClassName,
}: MediaRendererProps) {
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
          onLoad={() => onLoaded(url)}
          className={cn(baseClass, "border-0")}
          loading="lazy"
          src={url}
          title={filename}
        />
      )}
      {fileType === "office" && (
        <iframe
          onLoad={() => onLoaded(url)}
          className={cn(baseClass, "border-0")}
          loading="lazy"
          src={officeViewerUrl}
          title={filename}
        />
      )}
      {fileType === "image" && (
        <Image
          onLoad={() => onLoaded(url)}
          onError={() => onLoaded(url)}
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
          onLoadedData={() => onLoaded(url)}
          onError={() => onLoaded(url)}
        >
          <source src={url} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
}