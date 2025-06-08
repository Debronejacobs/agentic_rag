import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui path
import { Progress } from '@/components/ui/progress'; // Assuming shadcn/ui path
import {
    CheckCircle,
    AlertCircle,
    Loader2,
    CircleDotDashed,
    RefreshCw
} from 'lucide-react';
import { formatBytes, getFileIcon } from '@/lib/fileUtils'; // Adjust path

function UploadingStatusList({
    uploadingFiles,
    overallProgress,
    overallStatus,
    hasFinishedUploads,
    onClearFinished,
    onRetryUpload,
    isBatchUploading // Prop to indicate if the *overall* batch is active
}) {
    const files = Object.values(uploadingFiles);
    if (files.length === 0) return null;

    // Determine status text
    const statusText =
        overallStatus === 'uploading' ? `Uploading ${files.length} files...` :
        overallStatus === 'complete' ? `Upload Complete (${files.length} files)` :
        overallStatus === 'failed' ? `Upload Failed (${files.length} files)` :
        overallStatus === 'partial_success' ? `Upload Finished (${files.length} files)` :
        'Upload Status'; // Fallback

    return (
        <div className="mt-6 space-y-4">
            <h3 className="font-medium text-foreground">{statusText}</h3>

            {/* Overall Batch Progress Bar and Summary */}
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <Progress value={overallProgress} className="w-full" />
                    </div>
                    <span className={`text-sm font-medium
                         ${overallStatus === 'complete' ? 'text-green-600' :
                           overallStatus === 'failed' || overallStatus === 'partial_success' ? 'text-destructive' :
                           overallStatus === 'uploading' ? 'text-blue-600' : 'text-muted-foreground' }
                    `}>
                        {overallProgress}%
                    </span>
                    {overallStatus === 'uploading' && <Loader2 className="size-4 animate-spin text-blue-600" />}
                    {overallStatus === 'complete' && <CheckCircle className="size-4 text-green-600" />}
                    {(overallStatus === 'failed' || overallStatus === 'partial_success') && <AlertCircle className="size-4 text-destructive" />}
                </div>
                {hasFinishedUploads && ( // Show clear button once *any* file is finished
                    <Button variant="outline" size="sm" onClick={onClearFinished} className="w-full mt-2">
                        Clear Finished Uploads
                    </Button>
                )}
            </div>

            {/* Individual File Progress List */}
            <ul className="grid gap-3">
                {files.map((fileState) => (
                    <li key={fileState.tempId} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                        {/* Icon based on file type or status */}
                        {fileState.status === 'complete' ? <CheckCircle className="size-5 text-green-600" /> :
                         fileState.status === 'failed' ? <AlertCircle className="size-5 text-destructive" /> :
                         fileState.status === 'uploading' ? <Loader2 className="size-5 animate-spin text-blue-600" /> :
                         fileState.status === 'pending' ? <CircleDotDashed className="size-5 text-muted-foreground" /> :
                         getFileIcon(fileState.file.name) // Fallback to file icon
                        }

                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-foreground" title={fileState.file.name}>{fileState.file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {fileState.status === 'uploading' ? `${fileState.progress}% uploading...` :
                                 fileState.status === 'complete' ? 'Complete' :
                                 fileState.status === 'failed' ? `Failed` :
                                 fileState.status === 'pending' ? 'Pending...' :
                                 formatBytes(fileState.file.size)}
                            </p>
                             {/* Show a specific error message below the filename if failed */}
                             {fileState.status === 'failed' && fileState.error && (
                                  <p className="text-xs text-destructive mt-1 break-words">{fileState.error}</p>
                             )}
                        </div>

                        {/* Actions */}
                        {fileState.status === 'failed' && !isBatchUploading && ( // Allow retry only if failed and not another batch uploading
                            <Button
                                 variant="ghost"
                                 size="icon"
                                 className="text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 size-8"
                                 title="Retry upload"
                                 onClick={() => onRetryUpload(fileState.tempId)}
                                 disabled={isBatchUploading} // Double check disable prop
                            >
                                <RefreshCw className="size-4" />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UploadingStatusList;