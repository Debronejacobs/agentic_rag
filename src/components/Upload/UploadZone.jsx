"use client"

import React from 'react';
import { Button } from '../ui/button';
import { Plus , CloudUpload } from 'lucide-react';


function UploadZone({ fileInputRef, handleFileChange, isDragOver, handleDragOver, handleDragLeave, handleDrop, disabled }) {
    return (
        <div
            className={`relative border-2 border-dashed rounded-xl p-8 transition-colors duration-300 ${
              isDragOver
                ? 'border-blue-600 bg-blue-100/30'
                : 'border-gray-300 hover:border-blue-600 hover:bg-blue-100/10'
            } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
        >
            <div className="text-center pointer-events-none">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <CloudUpload className="size-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                    {isDragOver ? 'Drop files here' : 'Drop files here or click to browse'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    Support for various document, image, audio, and video formats
                </p>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={disabled}
                    aria-hidden="true"
                />
                <Button variant="outline" className="pointer-events-none">
                    <Plus className="mr-2 size-4" />
                    Select Files
                </Button>
            </div>
        </div>
    );
}

export default UploadZone;