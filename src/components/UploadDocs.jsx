import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator'; // Assuming a separator might be useful for UI division
import { FileText, Upload, Search } from 'lucide-react'; // Icons for better UI

function UploadDocs() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Meeting Notes Q1 2024.pdf', type: 'pdf', size: '1.2 MB', uploadedAt: '2024-05-28' },
    { id: 2, name: 'Project Proposal V2.docx', type: 'docx', size: '800 KB', uploadedAt: '2024-05-27' },
    { id: 3, name: 'Marketing Strategy.pptx', type: 'pptx', size: '3.5 MB', uploadedAt: '2024-05-26' },
    { id: 4, name: 'Research Paper.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '2024-05-25' },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      console.log('Uploading files:', selectedFiles);
      // In a real application, you would send these files to a backend
      // For now, let's simulate adding them to the documents list
      const newDocs = selectedFiles.map((file, index) => ({
        id: documents.length + index + 1,
        name: file.name,
        type: file.name.split('.').pop(),
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        uploadedAt: new Date().toISOString().slice(0, 10),
      }));
      setDocuments((prevDocs) => [...prevDocs, ...newDocs]);
      setSelectedFiles([]);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full p-6 bg-background">
      <h1 className="text-3xl font-bold mb-6">Data management</h1>

      {/* Upload Section */}
      <div className="mb-8 p-4 border rounded-lg shadow-sm bg-card">
        <h2 className="text-xl font-semibold mb-4">Upload New Documents</h2>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            multiple
            onChange={handleFileChange}
            className="flex-grow"
          />
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
            <Upload className="mr-2 size-4" /> Upload
          </Button>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-3 text-sm text-muted-foreground">
            Selected: {selectedFiles.map(file => file.name).join(', ')}
          </div>
        )}
      </div>

      <Separator className="my-6" />

      {/* Existing Documents Section */}
      <div className="flex flex-col flex-grow">
        <h2 className="text-xl font-semibold mb-4">Your Existing Documents</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 border rounded-lg shadow-sm bg-card hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <FileText className="size-6 text-primary" />
                <div className="flex-grow">
                  <p className="font-medium truncate">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.size} &bull; Uploaded: {doc.uploadedAt}
                  </p>
                </div>
                {/* Add actions like view/download/delete here */}
                <Button variant="ghost" size="sm">...</Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-full text-center py-8">
              No documents found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadDocs;