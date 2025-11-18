
import React, { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
}

// A simple syntax highlighter for JSON
const highlightJson = (jsonString: string) => {
    return jsonString.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-green-400'; // string
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-sky-400'; // key
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-amber-400'; // boolean
        } else if (/null/.test(match)) {
            cls = 'text-rose-400'; // null
        } else {
            cls = 'text-indigo-400'; // number
        }
        return `<span class="${cls}">${match}</span>`;
    });
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'json' }) => {
    const [copySuccess, setCopySuccess] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const highlightedCode = language === 'json' ? highlightJson(code) : code;

    return (
        <div className="bg-slate-900/70 border border-slate-700 rounded-lg relative">
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 px-3 py-1 bg-slate-700 text-slate-300 text-xs font-semibold rounded-md hover:bg-slate-600 transition-colors"
            >
                {copySuccess ? 'Copied!' : 'Copy'}
            </button>
            <pre className="p-4 text-sm text-slate-300 overflow-auto max-h-96">
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    );
};
