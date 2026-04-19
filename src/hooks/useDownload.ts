import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

export const useDownload = () => {
    const [downloading, setDownloading] = useState(false);
   
    const download = async (url: string[]) => {
       
        try {
            setDownloading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (Array.isArray(url) && url.length > 1) {
                // If multiple URLs, download all and zip
                // Dynamically import JSZip to avoid including it in the initial bundle unnecessarily
                const JSZip = (await import("jszip")).default;
                const zip = new JSZip();

                // Download all files concurrently
                const fileResponses = await Promise.all(
                    url.map(async (singleUrl) => {
                        const fileRes = await fetch(singleUrl, {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${session?.access_token}`,
                            },
                        });
                        if (!fileRes.ok) {
                            throw new Error(`Download failed for ${singleUrl}: An HTTP error occurred.`);
                        }
                        const fileBlob = await fileRes.blob();
                        // Try to get file name from url
                        const fileName = singleUrl.split("/").pop() || "file";
                        zip.file(fileName, fileBlob);
                    })
                );

                const zipBlob = await zip.generateAsync({ type: "blob" });
                const zipUrl = window.URL.createObjectURL(zipBlob);
                const link = document.createElement("a");
                link.href = zipUrl;
                link.download = "files.zip";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(zipUrl);
                toast.success(`Downloaded ${fileResponses.length} file(s)`);
            } else {
                // If one URL, normal download
                const singleUrl = Array.isArray(url) ? url[0] : url;
                if (!singleUrl) throw new Error("No file URL provided");
                const response = await fetch(singleUrl, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error(`Download failed: An HTTP error occured.`);
                }
                const blob = await response.blob();
                const link = document.createElement("a");
                const blobUrl = window.URL.createObjectURL(blob);
                link.href = blobUrl;
                link.download = singleUrl.split("/").pop() ?? "download";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
                toast.success("File downloaded successfully");
            }
        } catch (error) {
        throw error;
        } finally {
        setDownloading(false);
        }
    };
    return { download, downloading };
};

