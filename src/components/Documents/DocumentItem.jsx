import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming shadcn/ui path
import { File, Trash2, Loader2 } from 'lucide-react';
import { getFileIcon } from '@/lib/fileUtils'; // Adjust path

function DocumentItem({ doc, onDelete, isDeleting, isAuthenticated }) {
     // Assuming 'field' is the file field name in PocketBase and stores an array of filenames
     const filename = doc.field && Array.isArray(doc.field) && doc.field.length > 0 ? doc.field[0] : null;

    return (
        <div
            key={doc.id}
            className="group relative p-4 border rounded-xl bg-card text-card-foreground shadow-sm hover:border-blue-600/50 transition-colors flex flex-col justify-between"
        >
            <div className="flex items-start gap-3 mb-3">
                {filename ? (
                    getFileIcon(filename)
                ) : (
                    <File className="size-5 text-gray-400" />
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-foreground truncate group-hover:text-blue-600 transition-colors" title={doc.title || '(No Title)'}>
                        {doc.title || '(No Title)'}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                        {filename || 'No file attached'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Uploaded: {new Date(doc.created).toLocaleDateString()} at {new Date(doc.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                </div>
            </div>

            {/* Actions (Delete) */}
            {isAuthenticated && (
                <div className="flex items-center gap-1 mt-4 pt-3 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                     {/* View/Download actions would go here if implemented */}

                     {/* Delete Button */}
                     <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => onDelete(doc.id)}
                         className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 ml-auto size-8"
                         disabled={isDeleting}
                         title="Delete Document"
                     >
                         {isDeleting ? (
                             <Loader2 className="size-4 animate-spin" />
                          ) : (
                             <Trash2 className="size-4" />
                          )}
                     </Button>
                </div>
            )}

        </div>
    );
}

export default DocumentItem;