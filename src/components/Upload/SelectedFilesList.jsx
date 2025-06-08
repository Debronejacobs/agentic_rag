import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui path
import { CloudUpload, X } from 'lucide-react';
import { formatBytes, getFileIcon } from '@/lib/fileUtils'; // Adjust path

function SelectedFilesList({ files, onRemoveFile, onUpload, disabled }) {
    if (!files || files.length === 0) return null;

    return (
        <div className="mt-6 space-y-4">
            <h3 className="font-medium text-foreground">Ready to Upload ({files.length})</h3>
            <ul className="grid gap-3">
                {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                        {getFileIcon(file.name)}
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate text-foreground" title={file.name}>{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {formatBytes(file.size)}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveFile(index)}
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 size-8"
                            title="Remove file"
                            disabled={disabled}
                        >
                            <X className="size-4" />
                        </Button>
                    </li>
                ))}
            </ul>
            <Button
                onClick={onUpload}
                className="w-full"
                disabled={files.length === 0 || disabled}
            >
                 <CloudUpload className="mr-2 size-4" />
                 Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
            </Button>
        </div>
    );
}

export default SelectedFilesList;