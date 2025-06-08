import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

function MessageArea({ message }) {
    if (!message || !message.text) return null;

    const { type, text } = message;

    return (
        <div
            className={`mb-4 p-3 rounded-md flex items-center gap-2 text-sm ${
                type === 'success'
                    ? 'bg-green-100 border border-green-400 text-green-700'
                    : type === 'warning'
                        ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
                        : 'bg-red-100 border border-red-400 text-red-700'
            }`}
            role={type === 'success' ? 'status' : 'alert'}
        >
            {type === 'success' && <CheckCircle className="size-5" />}
            {type === 'warning' && <AlertCircle className="size-5" />}
            {type === 'error' && <AlertCircle className="size-5" />}
            <span>{text}</span>
        </div>
    );
}

export default MessageArea;