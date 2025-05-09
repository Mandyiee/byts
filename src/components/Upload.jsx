import React, { useState, useRef } from 'react';

let config = {
  canvasWidth: 0,
  canvasHeight: 0,
  backgroundColor: '',
  invertColors: false,
  pixelEncoding: 'grayscale',
  threshold: 128,
  rotation: 0,
  flipHorizontal: false,
  flipVertical: false,
};

const Upload = ({ setImages, images }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) { 
      processFiles(e.target.files);
    }
  };

  const removeImage = (index) => {
    setImages(prev => {
      // Release the object URL to avoid memory leaks
      URL.revokeObjectURL(prev[index].url);
      
      // Create a new array without the removed image
      const updatedImages = [...prev];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const processFiles = (fileList) => {
    const files = Array.from(fileList);

    files.forEach(file => {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (PNG, JPEG, GIF, BMP)');
        return;
      }

      // Create an object URL directly for display
      const url = URL.createObjectURL(file);
      
      let name = file.name.split(".")

      //Allocating canvas height and width

      
      // Create an image element to get dimensions
      const img = new Image();
      img.onload = () => {
        let newConfig = {...config, canvasWidth: img.width, canvasHeight: img.height}
        const newImage = {
          name: name[0],
          height: img.height,
          width: img.width,
          url: url,
          type: file.type,
          config: newConfig
        };
        
        setImages(prev => [...prev, newImage]);
      };
      
      // Set the source to the object URL
      img.src = url;
      
    });

    
    
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="w-full h-fit shadow-xl bg-[var(--color-border-component-background)] mb-10 p-10 rounded-2xl backdrop-blur-sm">
    <div className="">
      <div 
        className={`border-2 border-dashed  border-[var(--color-section-highlight)] rounded-lg p-6 w-full flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging 
            ? 'border-[var(--color-accent-accent)] bg-[var(--color-section-highlight)]' 
            : 'border-[var(--color-accent)]'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="bg-[var(--color-component-background)] p-3 rounded-full mb-4">
          <svg 
            className="w-6 h-6 text-[var(--color-text)]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1" 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
        </div>
        
        <p className="mb-1 text-sm font-medium text-center text-[var(--color-text)]">
          Drag and drop image here or click to browse
        </p>
        <p className="text-xs text-[var(--color-text)] opacity-70">
          Supports PNG, JPEG, JPG, BMP
        </p>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/jpg, image/bmp"
          multiple={true}
        />
      </div>
  
      <div className='overflow-x-auto mt-4 w-full'>
        {images.length > 0 && (
          <div className="flex justify-center items-center h-[100px] space-x-5 whitespace-nowrap">
            {images.map((image, index) => (
              <div key={index} className="relative inline-block group w-[45px] h-[45px]">
                <img 
                  src={image.url} 
                  alt={image.name} 
                  className="w-full h-full object-cover rounded-lg drop-shadow-lg border border-[var(--color-section-highlight)]"
                />
                <button 
                  className="absolute flex items-center justify-center text-[var(--color-text)] bg-[var(--color-accent)] text-center rounded-full h-[20px] w-[20px] md:opacity-0 md:roup-hover:opacity-100 md:transition-opacity -top-2 -right-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                >
                  ×
                </button>
                <p className="mt-1 text-xs text-[var(--color-text)] opacity-80 truncate w-[45px]">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Upload;