/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useEventResources,
  useUploadEventResource,
} from "@/hooks/events/useEventResources";
import { useDeleteDrive } from "@/hooks/events/useDeleteDrive";
import { useState, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getFileUrl } from "@/lib/utils";
import {
  UploadCloud,
  Download,
  File as FileIcon,
  FileText,
  Video,
  Music,
  FileSpreadsheet,
  Loader2,
  Search,
  Info,
  Trash2,
} from "lucide-react";
import Image from "next/image";

type ResourcesDriveProps = {
  eventId: number;
};

const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];
const SPREADSHEET_EXTENSIONS = ["xls", "xlsx", "csv", "ods"];

export default function DriveResources({ eventId }: ResourcesDriveProps) {
  const { data: resources, isLoading, refetch } = useEventResources(eventId);
  const uploadMutation = useUploadEventResource(eventId);
  const deleteMutation = useDeleteDrive();

  const [isDragOver, setIsDragOver] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (fileToUpload?: File) => {
    const uploadFile = fileToUpload || fileInputRef.current?.files?.[0];
    if (!uploadFile) return toast.error("Select a file first");

    uploadMutation.mutate(uploadFile, {
      onSuccess: () => {
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.success("File uploaded successfully");
        refetch();
      },
      onError: () => toast.error("Upload failed"),
    });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) handleUpload(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleUpload(droppedFile);
  };

  const handleDownload = async (path: string, name: string) => {
    try {
      const url = getFileUrl(path);
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Failed to download file");
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (!extension) return <FileIcon className="w-10 h-10 text-gray-500" />;

    if (SPREADSHEET_EXTENSIONS.includes(extension))
      return <FileSpreadsheet className="w-10 h-10 text-emerald-500" />;

    switch (extension) {
      case "pdf":
      case "doc":
      case "docx":
      case "txt":
        return <FileText className="w-10 h-10 text-red-500" />;
      case "mp4":
      case "avi":
      case "mov":
      case "wmv":
        return <Video className="w-10 h-10 text-purple-500" />;
      case "mp3":
      case "wav":
      case "ogg":
        return <Music className="w-10 h-10 text-green-500" />;
      default:
        return <FileIcon className="w-10 h-10 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    return resources.filter((res: any) => {
      const matchSearch = res.name.toLowerCase().includes(search.toLowerCase());
      const extension = res.name.split(".").pop()?.toLowerCase() || "";

      if (filterType === "all") return matchSearch;
      if (filterType === "image")
        return matchSearch && IMAGE_EXTENSIONS.includes(extension);
      if (filterType === "document")
        return matchSearch && ["pdf", "doc", "docx", "txt"].includes(extension);
      if (filterType === "spreadsheet")
        return matchSearch && SPREADSHEET_EXTENSIONS.includes(extension);
      if (filterType === "video")
        return matchSearch && ["mp4", "avi", "mov", "wmv"].includes(extension);
      if (filterType === "audio")
        return matchSearch && ["mp3", "wav", "ogg"].includes(extension);

      return matchSearch;
    });
  }, [resources, search, filterType]);

  return (
    <Card className="p-6 space-y-6">
      {/* Upload Section */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
      >
        <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold">Upload files</p>
        <p className="text-sm text-gray-500">
          Drag and drop files here or click to browse
        </p>

        <div className="mt-4 flex items-center justify-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            Browse Files
          </Button>

          {fileInputRef.current?.files?.[0] && (
            <Button
              onClick={() => handleUpload()}
              disabled={uploadMutation.isPending}
              className="flex items-center gap-2"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Now"
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Files</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
            <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="audio">Audio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading resources...</span>
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <TooltipProvider delayDuration={100}>
            {filteredResources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-2">
                {filteredResources.map((res: any) => {
                  const isImage = IMAGE_EXTENSIONS.includes(
                    res.name.split(".").pop()?.toLowerCase() || ""
                  );
                  const extension = res.name.split(".").pop()?.toLowerCase();

                  return (
                    <Tooltip key={res.id}>
                      <TooltipTrigger asChild>
                        <Card className="flex flex-col p-4 hover:shadow-lg transition-shadow cursor-pointer group border-2 border-transparent hover:border-primary/20">
                          <div className="flex flex-col items-center text-center flex-1 relative">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              {/* ✅ Custom Delete Dialog */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-gray-400 hover:text-red-500 relative bottom-1.5"
                                    onClick={() => setDeleteTarget(res)}
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete Resource
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete{" "}
                                      <strong>{deleteTarget?.name}</strong>?
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                      onClick={() => {
                                        if (deleteTarget) {
                                          deleteMutation.mutate(
                                            deleteTarget.id,
                                            {
                                              onSuccess: () => refetch(),
                                            }
                                          );
                                        }
                                      }}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <Info className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="mb-3 w-full h-24 flex items-center justify-center">
                              {isImage ? (
                                <Image
                                  fill
                                  src={getFileUrl(res.path)}
                                  alt={res.name}
                                  className="max-h-24 object-contain rounded"
                                />
                              ) : (
                                getFileIcon(res.name)
                              )}
                            </div>

                            <p className="text-sm font-medium truncate w-full mb-1">
                              {res.name}
                            </p>
                            {res.size && (
                              <p className="text-xs text-gray-500 mb-2">
                                {formatFileSize(res.size)}
                              </p>
                            )}
                          </div>

                          <Button
                            size="sm"
                            variant="outline"
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 w-full"
                            onClick={() => handleDownload(res.path, res.name)}
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </Card>
                      </TooltipTrigger>

                      <TooltipContent className="text-sm space-y-1 p-3">
                        <p>
                          <strong>Name:</strong> {res.name}
                        </p>
                        <p>
                          <strong>Type:</strong>{" "}
                          {extension?.toUpperCase() || "Unknown"}
                        </p>
                        {res.size && (
                          <p>
                            <strong>Size:</strong> {formatFileSize(res.size)}
                          </p>
                        )}
                        {res.createdAt && (
                          <p>
                            <strong>Uploaded:</strong>{" "}
                            {new Date(res.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-500">No files found</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
          </TooltipProvider>
        </ScrollArea>
      )}
    </Card>
  );
}
