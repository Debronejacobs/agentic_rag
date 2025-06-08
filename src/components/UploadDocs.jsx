"use client";
import React, { useState, useRef, useEffect, useMemo } from 'react';

// Import PocketBase instance
import { pb } from '../../lib/pocketbase'; // Ensure this path is correct
import MessageArea from '@/components/MessageArea';
import AuthRequiredMessage from '@/components/AuthRequiredMessage';
import UploadZone from '@/components/Upload/UploadZone';
import SelectedFilesList from '@/components/Upload/SelectedFilesList';
import UploadingStatusList from '@/components/Upload/UploadingStatusList';
import DocumentControls from '@/components/Documents/DocumentControls';
import DocumentList from '@/components/Documents/DocumentList';
import { CloudUpload, HardDrive, Loader2, AlertCircle, FileText } from 'lucide-react';
import { getFileExtension } from '@/lib/fileUtils';

function UploadDocs() {
    // State variables
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(false);

    // State to track individual file uploads
    // Map: { tempId: { file, progress, status, error, pbRecordId? } }
    // Status: 'pending' | 'uploading' | 'complete' | 'failed' | 'cancelled'
    const [uploadingFiles, setUploadingFiles] = useState({});

    // Documents fetched from PocketBase and updated by subscription
    const [documents, setDocuments] = useState([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    // Error state specifically for the *initial fetch* or subscription issues
    const [fetchErrorDocs, setFetchErrorDocs] = useState(null);

    const [uploading, setUploading] = useState(false); // Overall upload batch in progress flag
    const [deletingDocId, setDeletingDocId] = useState(null); // State to track doc ID being deleted

    // State for temporary inline messages (success/error/warning feedback for actions)
    const [actionMessage, setActionMessage] = useState({ type: null, text: null }); // { type: 'success' | 'error' | 'warning', text: '...' }

    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('-created'); // Default to newest first
    const [filterBy, setFilterBy] = useState('all'); // Filter by file extension

    // Ref for the hidden file input
    const fileInputRef = useRef(null);

    // Ref to hold the AbortController for fetching documents
    const fetchControllerRef = useRef(null);
    // Ref to hold the timer ID for debouncing the fetch request
    const fetchTimerRef = useRef(null);
    // Ref to hold the timer ID for temporary messages
    const messageTimerRef = useRef(null);

     const isAuthenticated = pb.authStore.isValid;
     const userId = isAuthenticated ? pb.authStore.record?.id : null;


    // Function to display a temporary message
    const showActionMessage = (type, text) => {
        setActionMessage({ type, text });
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => {
            setActionMessage({ type: null, text: null });
        }, 6000); // Clear after 6 seconds
    };

    // Effect for initial fetch and refetch on sort change/auth change
    useEffect(() => {
        console.log("Fetch effect triggered.");

        // Always clear previous timer and abort previous fetch on effect run
        if (fetchTimerRef.current) {
            console.log("Clearing previous fetch timer.");
            clearTimeout(fetchTimerRef.current);
            fetchTimerRef.current = null;
        }
        if (fetchControllerRef.current) {
            console.log("Aborting previous fetch controller.");
            fetchControllerRef.current.abort();
            fetchControllerRef.current = null;
        }


        if (!userId) {
            console.log("Not authenticated, skipping fetch setup.");
            setFetchErrorDocs("You must be logged in to view and manage documents.");
            setLoadingDocs(false);
            setDocuments([]); // Clear any stale documents if user logs out
             // Ensure subscription is also stopped on logout
            pb.collection('user_files').unsubscribe('*');
            return;
        }

        // Create a NEW AbortController for this potential fetch
        const newController = new AbortController();
        fetchControllerRef.current = newController; // Store the NEW controller

        const startFetch = async () => {
            console.log("Starting debounced fetch...");
             // Use the controller that was current when the timeout fired
            const controllerToUse = fetchControllerRef.current;

            if (!controllerToUse || controllerToUse.signal.aborted) {
                 console.log("Fetch aborted before starting.");
                 setLoadingDocs(false);
                 return;
            }

            setLoadingDocs(true);
            setFetchErrorDocs(null);

            try {
                console.log(`Fetching documents for user ${userId} sorted by ${sortBy}...`);
                const resultList = await pb.collection('user_files').getList(1, 100, {
                    filter: `user = "${userId}"`,
                    sort: sortBy,
                    signal: controllerToUse.signal,
                });

                setDocuments(resultList.items);
                console.log("Successfully fetched documents:", resultList.items.length);

            } catch (error) {
                console.error("Error during document fetch:", error);
                const isAutoCancelled = error.name === 'AbortError' || error.message?.includes('The request was autocancelled');
                if (!isAutoCancelled) {
                    setFetchErrorDocs(`Failed to load documents: ${error.message || error.toString()}`);
                    setDocuments([]);
                } else {
                    console.log('Fetch request was aborted (expected).');
                    setFetchErrorDocs(null);
                }
            } finally {
                setLoadingDocs(false);
                console.log("Fetch process finished.");
            }
        };

        fetchTimerRef.current = setTimeout(startFetch, 200); // Debounce by 200ms

        // Cleanup function
        return () => {
            console.log("Running fetch effect cleanup.");
            if (fetchTimerRef.current) {
                clearTimeout(fetchTimerRef.current);
                fetchTimerRef.current = null;
            }
            if (fetchControllerRef.current) {
                 fetchControllerRef.current.abort();
                 fetchControllerRef.current = null;
            }
             if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };

    }, [sortBy, isAuthenticated, userId]); // Depend on userId derived from isAuthenticated

    // Effect for setting up real-time subscription
    useEffect(() => {
         if (!userId) {
            console.log("Not authenticated, skipping PocketBase subscription setup.");
            pb.collection('user_files').unsubscribe('*'); // Ensure unsubscribe on logout
            return;
         }

         let unsubscribe;

         const setupSubscription = async () => {
             console.log(`Setting up PocketBase subscription for user ${userId}...`);
             try {
                 await pb.collection('user_files').unsubscribe('*');

                 unsubscribe = await pb.collection('user_files').subscribe('*', function (e) {
                     console.log('Subscription event received:', e.action, e.record);

                     if (e.record.user !== userId) {
                         console.log("Ignoring subscription event for another user.");
                         return;
                     }

                     setDocuments(prevDocs => {
                         switch (e.action) {
                             case 'create':
                                 if (!prevDocs.some(doc => doc.id === e.record.id)) {
                                     console.log("Adding new document from subscription:", e.record.id);
                                     setUploadingFiles(currentUploading => {
                                        const updatedUploading = { ...currentUploading };
                                        let foundTempId = null;
                                        for (const tempId in updatedUploading) {
                                            if (updatedUploading[tempId].status === 'complete' && updatedUploading[tempId].pbRecordId === e.record.id) {
                                                 foundTempId = tempId;
                                                 break;
                                            }
                                        }
                                        if (foundTempId) {
                                            console.log("Removing file from uploadingFiles state after subscription create:", foundTempId);
                                            delete updatedUploading[foundTempId];
                                        }
                                        return updatedUploading;
                                     });
                                     return [e.record, ...prevDocs]; // Add to start for common sort
                                 }
                                 return prevDocs;
                             case 'update':
                                 console.log("Updating document from subscription:", e.record.id);
                                 return prevDocs.map(doc => doc.id === e.record.id ? e.record : doc);
                             case 'delete':
                                  console.log("Deleting document from subscription:", e.record.id);
                                 return prevDocs.filter(doc => doc.id !== e.record.id);
                             default:
                                 console.log("Unknown subscription action:", e.action);
                                 return prevDocs;
                         }
                     });
                 }, {
                     filter: `user = "${userId}"`,
                 });

                 console.log('PocketBase subscription established.');

             } catch (error) {
                 console.error('Error setting up PocketBase subscription:', error);
             }
         };

         setupSubscription();

         return () => {
             console.log("Running subscription effect cleanup.");
             pb.collection('user_files').unsubscribe('*');
             console.log('Unsubscribed from PocketBase collection.');
             if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
         };

    }, [isAuthenticated, userId]); // Depend on userId derived from isAuthenticated


    // Handle file selection via input click or drag/drop
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
        setActionMessage({ type: null, text: null });
        setUploadingFiles({});
    };

    // Drag/drop handlers remain the same - Pass these down to UploadZone
    const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); };
    const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files || []);
        setSelectedFiles(files);
         setActionMessage({ type: null, text: null });
         setUploadingFiles({});
    };


    // Handle the actual file upload to PocketBase - SEQUENTIALLY
    const handleUpload = async () => {
        if (!isAuthenticated || !userId) {
            showActionMessage('error', "You must be logged in to upload files.");
            return;
        }

        if (selectedFiles.length === 0) {
            showActionMessage('error', "Please select files to upload.");
            return;
        }

        setUploading(true);
        setActionMessage({ type: null, text: null });

        const initialUploadingFilesState = selectedFiles.reduce((acc, file) => {
             const tempId = `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`;
             acc[tempId] = { file: file, progress: 0, status: 'pending', error: null, tempId: tempId };
             return acc;
        }, {});

        setUploadingFiles({...initialUploadingFilesState});
        setSelectedFiles([]);

        const filesToUploadSequentially = Object.values(initialUploadingFilesState);
        const results = [];

        for (const fileState of filesToUploadSequentially) {
            const { file, tempId } = fileState;

            const formData = new FormData();
            formData.append('user', userId);
            formData.append('title', file.name);
            formData.append('field', file);

            try {
                console.log(`Starting sequential upload for ${file.name} (tempId: ${tempId})`);
                 setUploadingFiles(prev => ({
                    ...prev,
                    [tempId]: { ...prev[tempId], status: 'uploading' }
                 }));

                const record = await pb.collection('user_files').create(formData, {
                    onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        setUploadingFiles(prev => ({
                           ...prev,
                           [tempId]: { ...prev[tempId], progress: percent }
                        }));
                    },
                });

                console.log(`Sequential upload successful for ${file.name} (tempId: ${tempId}, Record ID: ${record.id})`);
                 // Note: The subscription listener will handle setting status to 'complete'
                 // and removing it from the uploadingFiles list when it appears in documents.
                 // We COULD set it to 'complete' here immediately, but waiting for subscription
                 // ensures consistency between the uploading list and the document list state.
                 // Let's update the state to 'complete' here directly for responsiveness,
                 // and rely on the subscription to eventually remove it from the list.
                  setUploadingFiles(prev => ({
                     ...prev,
                     [tempId]: { ...prev[tempId], status: 'complete', progress: 100, pbRecordId: record.id }
                  }));

                 results.push({ success: true, tempId: tempId, recordId: record.id });

            } catch (error) {
                console.error(`Sequential upload failed for ${file.name} (tempId: ${tempId}):`, error);
                 const errorMessage = error.message || error.toString();
                 setUploadingFiles(prev => ({
                    ...prev,
                    [tempId]: { ...prev[tempId], status: 'failed', error: errorMessage, progress: 0 }
                 }));
                 results.push({ success: false, tempId: tempId, error: errorMessage });
            }
        }

        const successfulUploads = results.filter(res => res.success).length;
        const failedUploads = results.filter(res => !res.success).length;
        const totalUploads = results.length;

        if (totalUploads > 0) {
             if (successfulUploads === totalUploads) {
                 showActionMessage('success', `${successfulUploads} file(s) uploaded successfully!`);
             } else if (successfulUploads > 0) {
                 const warningMessage = `${successfulUploads}/${totalUploads} file(s) uploaded. ${failedUploads} failed.`;
                 showActionMessage('warning', warningMessage);
             } else {
                  showActionMessage('error', `All ${totalUploads} file(s) failed to upload.`);
             }
        }

        if (fileInputRef.current) {
             fileInputRef.current.value = '';
        }
        setUploading(false);
    };


    // Function to clear the list of finished (complete/failed) uploads from the UI
    const clearFinishedUploads = () => {
        setUploadingFiles(prev => {
             const activeUploads = Object.entries(prev).reduce((acc, [tempId, fileState]) => {
                 if (fileState.status === 'pending' || fileState.status === 'uploading') {
                     acc[tempId] = fileState;
                 }
                 return acc;
             }, {});
             return activeUploads;
        });
         if (actionMessage.text?.includes('uploaded') || actionMessage.text?.includes('failed to upload')) {
              setActionMessage({type: null, text: null});
         }
    };

    // Function to retry a single failed upload
    const retryUpload = async (tempIdToRetry) => {
         const fileStateToRetry = uploadingFiles[tempIdToRetry];
         if (!fileStateToRetry || fileStateToRetry.status !== 'failed') {
             console.warn("Attempted to retry a file not in failed state.", fileStateToRetry);
             return;
         }
         if (!isAuthenticated || !userId) {
              showActionMessage('error', "You must be logged in to retry files.");
              return;
         }

         console.log("Retrying upload for tempId:", tempIdToRetry);

         setUploadingFiles(prev => ({
            ...prev,
            [tempIdToRetry]: { ...prev[tempIdToRetry], status: 'pending', progress: 0, error: null }
         }));

         const file = fileStateToRetry.file;
         const formData = new FormData();
         formData.append('user', userId);
         formData.append('title', file.name);
         formData.append('field', file);

          try {
                setUploadingFiles(prev => ({
                   ...prev,
                   [tempIdToRetry]: { ...prev[tempIdToRetry], status: 'uploading' }
                }));

               const record = await pb.collection('user_files').create(formData, {
                   onUploadProgress: (e) => {
                       const percent = Math.round((e.loaded / e.total) * 100);
                       setUploadingFiles(prev => ({
                          ...prev,
                          [tempIdToRetry]: { ...prev[tempIdToRetry], progress: percent }
                       }));
                   },
               });

               console.log(`Retry successful for ${file.name} (Record ID: ${record.id})`);
                // Update state to complete, subscription will eventually remove from uploading list
               setUploadingFiles(prev => ({
                   ...prev,
                   [tempIdToRetry]: { ...prev[tempIdToRetry], status: 'complete', progress: 100, pbRecordId: record.id }
               }));
               showActionMessage('success', `Successfully retried upload for ${file.name}.`);

           } catch (error) {
               console.error(`Retry failed for ${file.name}:`, error);
                const errorMessage = error.message || error.toString();
               setUploadingFiles(prev => ({
                   ...prev,
                   [tempIdToRetry]: { ...prev[tempIdToRetry], status: 'failed', error: errorMessage, progress: 0 }
               }));
               showActionMessage('error', `Retry failed for ${file.name}: ${errorMessage}`);
           }
    };


    // Remove a file from the selected files list BEFORE upload starts
    const removeSelectedFile = (indexToRemove) => {
        setSelectedFiles(files => {
             const newFiles = files.filter((_, index) => index !== indexToRemove);
             return newFiles;
        });
         // Clear action message only if this was the last selected file and no uploads are ongoing
         if (selectedFiles.length === 1 && Object.keys(uploadingFiles).length === 0) {
              setActionMessage({ type: null, text: null });
         }
    };

    // Delete Document Function
    const deleteDocument = async (docId) => {
        if (!isAuthenticated) {
             showActionMessage('error', "You must be logged in to delete files.");
             return;
         }
    
         // Find the document before removing it optimistically, in case we need to revert
         const docToDelete = documents.find(doc => doc.id === docId);
         if (!docToDelete) {
             console.warn("Attempted to delete document not found in state:", docId);
             showActionMessage('error', "Document not found.");
             return;
         }
    
         setDeletingDocId(docId); // Set state to show loading spinner for this item
         showActionMessage(null, null); // Clear any previous general messages
    
         // --- Optimistic Update: Remove from UI immediately ---
         setDocuments(prevDocs => prevDocs.filter(doc => doc.id !== docId));
         console.log(`Optimistically removed document ID ${docId} from UI.`);
    
    
         try {
             console.log(`Attempting to delete document ID: ${docId} on backend.`);
             await pb.collection('user_files').delete(docId);
             console.log(`Backend deletion successful for ${docId}.`);
             // If successful, the optimistic update was correct.
             // The subscription listener would also eventually confirm this, but the UI is already updated.
             showActionMessage('success', 'Document deleted successfully.');
    
         } catch (error) {
             console.error(`Failed to delete document ${docId} on backend:`, error);
              const errorMessage = error.message || error.toString();
    
             // --- Revert Change: Add document back to UI if backend delete failed ---
             setDocuments(prevDocs => {
                 // Add the document back. A simple way is to add to the start or end.
                 // If maintaining strict sort order before the next fetch/sort is critical,
                 // more complex insertion logic might be needed based on the original list.
                 // For simplicity, adding it back to the end here.
                 const newDocs = [...prevDocs, docToDelete];
                  // Optional: Re-sort if you need it to appear in its previous sorted position
                  // This can be complex, relying on the next fetch or subscription might be simpler
                  // if immediate precise re-sorting isn't critical.
                 console.log(`Reverting UI change: Added document ID ${docId} back due to failure.`);
                 return newDocs;
             });
    
             showActionMessage('error', `Failed to delete document: ${errorMessage}`);
         } finally {
             setDeletingDocId(null); // Clear deleting state regardless of success or failure
         }
    };

    // Client-side Filtering and Sorting (applied to the array fetched from PB, which is already sorted by sortBy)
    const filteredAndSortedDocuments = useMemo(() => {
        let result = documents;

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(doc =>
                doc.title?.toLowerCase().includes(lowerCaseQuery) ||
                (doc.field && Array.isArray(doc.field) && doc.field.some(filename => filename.toLowerCase().includes(lowerCaseQuery)))
            );
        }

        if (filterBy !== 'all') {
            result = result.filter(doc =>
                 doc.field && Array.isArray(doc.field) && doc.field.length > 0 && getFileExtension(doc.field[0]) === filterBy
            );
        }

        // Note: Sorting is handled by the initial fetch based on `sortBy` state
        return result;
    }, [documents, searchQuery, filterBy]);

    // Get unique file types for filter dropdown
    const fileTypes = useMemo(() => {
        const types = [...new Set(documents.flatMap(doc =>
            (doc.field || []).map(getFileExtension)
        ))].filter(Boolean);
        return types.sort();
    }, [documents]);


    // Calculate overall batch upload progress
    const overallUploadProgress = useMemo(() => {
        const files = Object.values(uploadingFiles);
        if (files.length === 0) return 0;

        const totalFiles = files.length;
        const totalProgressSum = files.reduce((sum, f) => {
             if (f.status === 'complete' || f.status === 'failed') {
                 return sum + 100;
             } else {
                 return sum + (f.progress || 0);
             }
        }, 0);

        return totalFiles > 0 ? Math.round(totalProgressSum / totalFiles) : 0;

    }, [uploadingFiles]);

    // Determine overall batch status
    const overallUploadStatus = useMemo(() => {
        const files = Object.values(uploadingFiles);
         if (files.length === 0) return 'idle';

        const pending = files.some(f => f.status === 'pending');
        const uploading = files.some(f => f.status === 'uploading');
        const failed = files.some(f => f.status === 'failed');
        const complete = files.every(f => f.status === 'complete');
        const allFinished = files.every(f => f.status === 'complete' || f.status === 'failed');

        if (uploading || pending) return 'uploading';
        if (complete) return 'complete';
        if (failed && allFinished) return 'failed';
        if (allFinished) return 'partial_success';

        return 'idle';
    }, [uploadingFiles]);


    // Helper to know if any uploads have finished
    const hasFinishedUploads = useMemo(() => {
        return Object.values(uploadingFiles).some(f => f.status === 'complete' || f.status === 'failed');
    }, [uploadingFiles]);


    return (
        <div className="min-h-screen p-6 text-foreground">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-blue-800 mb-2">
                        Document Management
                    </h1>
                    <p className="text-muted-foreground">Upload, organize, and manage your documents with ease</p>
                </div>

                 {/* Temporary Action Messages */}
                <MessageArea message={actionMessage} />

                 {/* Authentication Required Message */}
                {!isAuthenticated && <AuthRequiredMessage />}

                {/* Upload Section (only visible if authenticated) */}
                {isAuthenticated && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-foreground">
                            <CloudUpload className="mr-2 size-6 text-blue-600" />
                            Upload Documents
                        </h2>

                        {/* Drag & Drop File Zone */}
                        <UploadZone
                            fileInputRef={fileInputRef}
                            handleFileChange={handleFileChange}
                            isDragOver={isDragOver}
                            handleDragOver={handleDragOver}
                            handleDragLeave={handleDragLeave}
                            handleDrop={handleDrop}
                            disabled={uploading} // Disable zone while batch uploading
                        />

                        {/* Selected Files (Before Upload) */}
                        {/* Only show if files are selected AND no uploads are currently being tracked */}
                        {selectedFiles.length > 0 && Object.keys(uploadingFiles).length === 0 && !uploading && (
                            <SelectedFilesList
                                files={selectedFiles}
                                onRemoveFile={removeSelectedFile}
                                onUpload={handleUpload}
                                disabled={uploading} // Should already be false by the parent condition, but good practice
                            />
                        )}


                        {/* Uploading/Finished Files Status (During/After Upload) */}
                        {Object.keys(uploadingFiles).length > 0 && (
                            <UploadingStatusList
                                uploadingFiles={uploadingFiles}
                                overallProgress={overallUploadProgress}
                                overallStatus={overallUploadStatus}
                                hasFinishedUploads={hasFinishedUploads}
                                onClearFinished={clearFinishedUploads}
                                onRetryUpload={retryUpload}
                                isBatchUploading={uploading} // Pass overall batch state
                            />
                         )}
                    </div>
                )}

                {/* Documents Section */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground">
                            <HardDrive className="mr-2 size-6 text-blue-600" />
                             Your Documents ({documents.length})
                             {loadingDocs && documents.length === 0 && !fetchErrorDocs && <Loader2 className="ml-2 size-5 animate-spin text-blue-500" />}
                        </h2>

                        {/* Controls: Search, Filter, Sort */}
                        <DocumentControls
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filterBy={filterBy}
                            setFilterBy={setFilterBy}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                            fileTypes={fileTypes}
                             disabled={loadingDocs && documents.length === 0 && !fetchErrorDocs} // Disable while loading or on error with no docs
                        />
                    </div> {/* End Section Header */}


                    {/* Loading State Message (Initial fetch) */}
                    {loadingDocs && documents.length === 0 && !fetchErrorDocs && (
                         <div className="text-center py-12">
                            <Loader2 className="mx-auto size-12 animate-spin text-blue-500 mb-4" />
                            <p className="text-foreground">Loading documents...</p>
                        </div>
                    )}

                    {/* Error State Message */}
                    {fetchErrorDocs && !loadingDocs && (
                        <div className="text-center py-12">
                            <AlertCircle className="mx-auto size-12 text-destructive mb-4" />
                            <h3 className="font-medium text-foreground mb-2">Error Loading Documents</h3>
                            <p className="text-muted-foreground">{fetchErrorDocs}</p>
                             {!isAuthenticated && (
                                 <p className="text-sm mt-4">Please ensure you are logged in.</p>
                            )}
                        </div>
                    )}

                     {/* Empty State Message (after load, no error, no documents) */}
                    {!loadingDocs && !fetchErrorDocs && documents.length === 0 && (
                         <div className="col-span-full text-center py-12">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                <FileText className="size-8 text-muted-foreground" />
                            </div>
                            <h3 className="font-medium text-foreground mb-2">
                                 {searchQuery || filterBy !== 'all' ? 'No documents match your criteria' : 'No documents uploaded yet'}
                            </h3>
                            <p className="text-muted-foreground">
                                 {searchQuery || filterBy !== 'all' ? 'Try adjusting your search or filters.' : 'Upload your first document using the section above.'}
                            </p>
                         </div>
                    )}

                    {/* Documents Grid (only visible if loaded, no error, and documents exist after filtering/sorting) */}
                    {!loadingDocs && !fetchErrorDocs && filteredAndSortedDocuments.length > 0 && (
                        <DocumentList
                             documents={filteredAndSortedDocuments}
                             onDeleteDocument={deleteDocument}
                             deletingDocId={deletingDocId}
                             isAuthenticated={isAuthenticated}
                        />
                    )}

                </div> {/* End Documents Section */}
            </div>
        </div>
    );
}
export default UploadDocs;