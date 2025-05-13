import { useState } from 'react';
import { Copy, Download, Code, Image, ChevronDown, ChevronUp, Check } from 'lucide-react';

const Output = ({ code, results }) => {
  const [activeTab, setActiveTab] = useState('code');
  const [expandedResult, setExpandedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image_data.c';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleResult = (index) => {
    setExpandedResult(expandedResult === index ? null : index);
  };



  const getEncodingInfo = (encoding) => {
    switch(encoding) {
      case 'grayscale': return '1-bit (B/W)';
      case 'rgb565': return '16-bit';
      case 'rgb888': return '24-bit';
      case 'rgb8888': return '32-bit';
      default: return encoding;
    }
  };

  return (
    <div className="w-full border border-[var(--color-section-highlight)] rounded-2xl shadow-xl backdrop-blur-sm bg-[var(--color-border-component-background)] my-10 overflow-hidden">
    {/* Tab Navigation */}
    <div className="flex justify-center items-center border-b border-[var(--color-section-highlight)]">
      <button 
        className={`px-6 py-3 font-medium text-sm flex items-center transition-colors text-[var(--color-text)] ${
          activeTab === 'code' 
            ? ' border-b-4 border-[var(--color-accent)]' 
            : ' opacity-70 hover:opacity-100'
        }`}
        onClick={() => setActiveTab('code')}
      >
        <Code size={16} className="mr-2" />
        Generated Code
      </button>
      <button 
        className={`px-6 py-3 font-medium text-sm flex items-center transition-colors text-[var(--color-text)] ${
          activeTab === 'summary' 
            ? ' border-b-4 border-[var(--color-accent)]' 
            : ' opacity-70 hover:opacity-100'
        }`}
        onClick={() => setActiveTab('summary')}
      >
        <Image size={16} className="mr-2" />
        Images ({results.length})
      </button>
    </div>
  
    {/* Code Tab Content */}
    {activeTab === 'code' && (
      <div className="relative">
        <div className="absolute right-3 top-3 flex gap-2 z-10">
          <button 
            onClick={copyToClipboard}
            className="p-2 rounded-md bg-[var(--color-component-background)] text-[var(--color-text)] hover:bg-[var(--color-accent)] transition-colors"
            title="Copy code"
          >
            {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
          </button>
          <button 
            onClick={downloadCode}
            className="p-2 rounded-md bg-[var(--color-component-background)] text-[var(--color-text)] hover:bg-[var(--color-accent)] transition-colors"
            title="Download code"
          >
            <Download size={16} />
          </button>
        </div>
        <pre className="p-5 overflow-x-auto h-64 text-sm font-mono bg-[var(--color-component-background)] text-[var(--color-text)]">
          {code || <span className="opacity-70">No code generated yet</span>}
        </pre>
      </div>
    )}
  
    {/* Summary Tab Content */}
    {activeTab === 'summary' && (
      <div className="overflow-y-auto h-64">
        {results.length > 0 ? (
          <div className="divide-y divide-[var(--color-section-highlight)]">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`p-4 transition-colors ${
                  expandedResult === index 
                    ? 'bg-[var(--color-section-highlight)]' 
                    : 'hover:bg-[var(--color-section-highlight)]'
                }`}
              >
                <div 
                  className="flex justify-between items-center cursor-pointer" 
                  onClick={() => toggleResult(index)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[var(--color-component-background)] rounded-lg flex items-center justify-center text-[var(--color-text)]">
                      <Image size={18} />
                    </div>
                    <div className="ml-3">
                      <div className="font-medium text-[var(--color-text)]">{result.name}</div>
                      <div className="text-xs text-[var(--color-text)] opacity-70">
                        {result.width}×{result.height} 
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[var(--color-accent-accent)] text-[var(--color-text)] text-xs px-2.5 py-1 rounded-full">
                      {getEncodingInfo(result.encoding)}
                    </span>
                    {expandedResult === index ? 
                      <ChevronUp size={16} className="text-[var(--color-text)] opacity-70" /> : 
                      <ChevronDown size={16} className="text-[var(--color-text)] opacity-70" />
                    }
                  </div>
                </div>
                
                {expandedResult === index && (
                  <div className="mt-3 pl-13">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-[var(--color-text)] opacity-70 mb-1">Dimensions</div>
                        <div className="text-[var(--color-text)] font-mono">{result.width}×{result.height} px</div>
                      </div>
                      <div>
                        <div className="text-[var(--color-text)] opacity-70 mb-1">Format</div>
                        <div className="text-[var(--color-text)]">{getEncodingInfo(result.encoding)}</div>
                      </div>
                     
                      <div>
                        <div className="text-[var(--color-text)] opacity-70 mb-1">Variable</div>
                        <div className="text-[var(--color-text)] font-mono">{result.name}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-[var(--color-text)] opacity-70 p-6">
            <Image size={32} className="mb-3 opacity-50" />
            <p>No images processed yet</p>
          </div>
        )}
      </div>
    )}
  </div>
  );
};

export default Output;