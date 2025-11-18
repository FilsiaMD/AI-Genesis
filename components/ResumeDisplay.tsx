
import React, { useState, useRef } from 'react';

interface ResumeDisplayProps {
  resume: {
    text: string;
    html: string;
  };
  onReset: () => void;
}

export const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resume, onReset }) => {
    const [activeTab, setActiveTab] = useState<'preview' | 'text'>('preview');
    const [copySuccess, setCopySuccess] = useState('');
    const resumeFrame = useRef<HTMLDivElement>(null);

    const handleCopy = (content: string, type: string) => {
        navigator.clipboard.writeText(content).then(() => {
            setCopySuccess(type);
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            alert('Failed to copy');
        });
    };
    
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && resumeFrame.current) {
            printWindow.document.write('<html><head><title>Resume</title>');
            // A simple style reset for printing
            printWindow.document.write('<style>body { margin: 20px; font-family: sans-serif; } @page { size: auto; margin: 0; }</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write(resume.html);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <div className="animate-fade-in">
            <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                     <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-teal-400">Your Resume is Ready</h2>
                    <p className="text-slate-400 mt-1">Preview, copy, or print your generated resume below.</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                     <button onClick={onReset} className="px-4 py-2 bg-slate-700 text-slate-300 font-semibold rounded-md hover:bg-slate-600 transition-colors">
                        &#8592; Edit Details
                    </button>
                    <button onClick={handlePrint} className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 transition-colors">
                        Print
                    </button>
                </div>
            </header>
            
            <div className="bg-slate-800/50 p-4 rounded-t-lg border border-b-0 border-slate-700 flex justify-between items-center">
                 <div className="flex gap-2">
                    <button onClick={() => setActiveTab('preview')} className={`px-4 py-1.5 text-sm rounded-md ${activeTab === 'preview' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:bg-slate-700'}`}>Preview</button>
                    <button onClick={() => setActiveTab('text')} className={`px-4 py-1.5 text-sm rounded-md ${activeTab === 'text' ? 'bg-sky-500/20 text-sky-300' : 'text-slate-400 hover:bg-slate-700'}`}>Plain Text</button>
                 </div>
                 {activeTab === 'text' && (
                      <button onClick={() => handleCopy(resume.text, 'Text')} className="px-3 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded-md">
                          {copySuccess === 'Text' ? 'Copied!' : 'Copy Text'}
                      </button>
                 )}
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-b-lg p-2 sm:p-4 md:p-6">
                {activeTab === 'preview' ? (
                    <div ref={resumeFrame} className="bg-white text-gray-800 p-4 sm:p-8 shadow-2xl rounded-sm w-full max-w-4xl mx-auto min-h-[80vh] sm:min-h-0 sm:aspect-[8.5/11]">
                        <div className="overflow-auto h-full" dangerouslySetInnerHTML={{ __html: resume.html }} />
                    </div>
                ) : (
                    <pre className="whitespace-pre-wrap text-sm text-slate-300 bg-slate-800 p-4 rounded-md font-mono max-h-[70vh] overflow-auto">
                        {resume.text}
                    </pre>
                )}
            </div>
        </div>
    );
};
