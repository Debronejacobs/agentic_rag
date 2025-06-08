// Helper function to format file size
export const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

// Helper function to get file extension
export const getFileExtension = (filename) => {
    // Use optional chaining and ensure filename is a string
    return String(filename).split('.').pop()?.toLowerCase() || '';
};

// Helper function to get appropriate icon based on file extension
import {
    FileText,
    FileSpreadsheet,
    Image,
    FileVideo,
    FileAudio,
    FileCode,
    File // Default
} from 'lucide-react';

export const getFileIcon = (filename) => {
    const type = getFileExtension(filename);
    const iconMap = {
        pdf: <FileText className="size-5 text-red-500" />,
        docx: <FileText className="size-5 text-blue-500" />,
        doc: <FileText className="size-5 text-blue-500" />,
        pptx: <FileText className="size-5 text-orange-500" />,
        ppt: <FileText className="size-5 text-orange-500" />,
        xlsx: <FileSpreadsheet className="size-5 text-green-500" />,
        xls: <FileSpreadsheet className="size-5 text-green-500" />,
        jpg: <Image className="size-5 text-purple-500" />,
        jpeg: <Image className="size-5 text-purple-500" />,
        png: <Image className="size-5 text-purple-500" />,
        gif: <Image className="size-5 text-purple-500" />,
        svg: <Image className="size-5 text-purple-500" />,
        mp4: <FileVideo className="size-5 text-pink-500" />,
        avi: <FileVideo className="size-5 text-pink-500" />,
        mov: <FileVideo className="size-5 text-pink-500" />,
        mp3: <FileAudio className="size-5 text-yellow-500" />,
        wav: <FileAudio className="size-5 text-yellow-500" />,
        ogg: <FileAudio className="size-5 text-yellow-500" />,
        js: <FileCode className="size-5 text-yellow-400" />,
        ts: <FileCode className="size-5 text-blue-400" />,
        json: <FileCode className="size-5 text-green-400" />,
        html: <FileCode className="size-5 text-orange-400" />,
        css: <FileCode className="size-5 text-blue-400" />,
        zip: <File className="size-5 text-gray-500" />,
        rar: <File className="size-5 text-gray-500" />,
        '7z': <File className="size-5 text-gray-500" />,
    };
    return iconMap[type] || <File className="size-5 text-gray-400" />;
};

// Helper function to get a file URL from PocketBase (if needed in children)
// Note: The original code commented this out, but included it for completeness.
// You would likely pass the pb instance or a getUrl function from the parent if needed.
// For now, leaving it here but unused in the provided child components.
/*
import { pb } from './pocketbase'; // Adjust path as needed
export const getPbFileUrl = (record, filename, options) => {
    if (!record || !filename) return '';
    // Ensure base URL is correctly configured in your PocketBase instance
    return pb.files.getURL(record, filename, options);
};
*/