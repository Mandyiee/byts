import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function Info() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has selected "never show again"
    const neverShowAgain = localStorage.getItem('info_neverShow');

    if (neverShowAgain !== 'true') {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNeverShowAgain = () => {
    localStorage.setItem('info_neverShow', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
    className="fixed inset-0 flex bg-black items-center justify-center z-50"
    
  >
    <div 
      className="w-full max-w-md mx-4 overflow-hidden rounded-xl shadow-xl"
      style={{ backgroundColor: "var(--color-primary-dark)" }}
    >
      {/* Modal Header */}
      <div 
        className="px-6 py-4 flex justify-between items-center"
        style={{ 
          borderBottom: "1px solid var(--color-border-component-background)",
        }}
      >
        <h3 
          className="text-lg font-medium"
          style={{ color: "var(--color-text)" }}
        >
          Welcome to Byts
        </h3>
        <button
          onClick={handleClose}
          className="focus:outline-none rounded-full p-1 transition-colors"
          style={{ 
            color: "var(--color-text)",
            opacity: 0.7,
            ":hover": { opacity: 1 },
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Modal Body */}
      <div className="px-6 py-4">
        <h1 
          className="text-3xl font-bold text-center py-4 text-white"
        >
          Byts
        </h1>
        <p 
          className="py-2 leading-relaxed"
          style={{ color: "var(--color-text)" }}
        >
           This tool transform images into byte arrays for embedded systems, microcontrollers, and
           custom displays. You can also edit single or multiple images with our comprehensive color format support.
        </p>
        
        <h4 
          className="font-medium mt-3 mb-2 text-white"
        >
          Supported Color Formats:
        </h4>
        <ul 
          className="pl-5 space-y-1 list-disc"
          style={{ color: "var(--color-text)" }}
        >
          <li>Monochrome (1-bit)</li>
          <li>RGB565 (16-bit)</li>
          <li>RGB888 (24-bit)</li>
          <li>RGBA8888 (32-bit)</li>
        </ul>
      </div>

      {/* Modal Footer */}
      <div 
        className="px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end"
        style={{ backgroundColor: "var(--color-primary-darkest)" }}
      >
        <button
          onClick={handleNeverShowAgain}
          className="w-full sm:w-auto px-4 py-2 rounded-lg focus:outline-none transition-colors"
          style={{ 
            backgroundColor: "var(--color-primary)",
            color: "var(--color-text)",
          }}
        >
          Never Show Again
        </button>
        <button
          onClick={handleClose}
          className="w-full sm:w-auto px-4 py-2 rounded-lg focus:outline-none transition-colors"
          style={{ 
            backgroundColor: "var(--color-primary-accent)",
            color: "var(--color-text)", 
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  </div>
  );
}

