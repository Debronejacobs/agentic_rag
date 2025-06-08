import React from 'react';
import DocumentItem from './DocumentItem'; // Adjust path if needed

function DocumentList({ documents, onDeleteDocument, deletingDocId, isAuthenticated }) {
     if (!documents || documents.length === 0) return null; // Handled by parent empty state

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {documents.map((doc) => (
                <DocumentItem
                    key={doc.id}
                    doc={doc}
                    onDelete={onDeleteDocument}
                    isDeleting={deletingDocId === doc.id}
                    isAuthenticated={isAuthenticated}
                />
            ))}
        </div>
    );
}

export default DocumentList;