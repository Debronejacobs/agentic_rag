import React from 'react';
import { AlertCircle } from 'lucide-react';

function AuthRequiredMessage() {
    return (
        <div className="mb-8 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md" role="alert">
            <div className="flex items-center gap-2">
                <AlertCircle className="size-5" />
                <span className="font-semibold">Authentication Required</span>
            </div>
            <p className="mt-2 text-sm">Please log in to upload or view your documents.</p>
        </div>
    );
}

export default AuthRequiredMessage;