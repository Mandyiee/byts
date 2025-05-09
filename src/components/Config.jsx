import { useState, useEffect, useRef } from 'react';

const colorModes = [
  { id: 'grayscale', label: '8-bit Grayscale', value: 'grayscale' },
  { id: 'rgb565', label: '16-bit RGB565', value: 'rgb565' },
  { id: 'rgb888', label: '24-bit RGB888', value: 'rgb888' },
  { id: 'rgba8888', label: '32-bit RGBA8888', value: 'rgba8888' }
];

const colorModesCSS = {
  grayscale: 'grayscale contrast-110 brightness-90 filter',
  rgb565: 'contrast-125 saturate-75 brightness-105 filter',
  rgb888: 'contrast-105 saturate-110 filter',
  rgba8888: ''
}

export default function Config({ images, handleImagesInput, setImages, processing }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [allImagesSelected, setAllImagesSelected] = useState(true);
  const [imgStyling, setImgStyling] = useState([]);
  const imageText = useRef();

  const [allImageSetting, setAllImageSetting] = useState({
    canvasWidth: 0,
    canvasHeight: 0,
    backgroundColor: '',
    invertColors: false,
    pixelEncoding: 'grayscale',
    threshold: 128,
    rotation: 0,
    flipHorizontal: false,
    flipVertical: false,
  });

  const [currentSetting, setCurrentSetting] = useState(allImageSetting);

  useEffect(() => {
    if (imageText.current) {
      imageText.current.textContent = "All Images";
    }

    generateCSSStyling(images);
  }, [images]);

  const handleSelectAllImages = () => {
    setAllImagesSelected(true);
    setCurrentImageIndex(null);
    if (imageText.current) {
      imageText.current.textContent = "All Images";
    }
    setCurrentSetting(allImageSetting);
  };

  const handleSelectImage = (index) => {
    setCurrentImageIndex(index);
    setAllImagesSelected(false);
    if (imageText.current) {
      imageText.current.textContent = images[index].name;
    }
    // Fixed: Load the selected image's configuration
    setCurrentSetting(images[index].config);
  };

  const updateSettings = (settingName, value) => {
    if (allImagesSelected) {
      // Update all images
      const updatedImages = images.map((image) => ({
        ...image,
        config: { ...image.config, [settingName]: value },
      }));

      setImages(updatedImages);

      const updatedAllImageSetting = { ...allImageSetting, [settingName]: value };
      setAllImageSetting(updatedAllImageSetting);
      setCurrentSetting(updatedAllImageSetting);

      generateCSSStyling(updatedImages);
      console.log(images);
    } else {
      // Update single image setting
      updateSingleImageSetting(settingName, value);
    }
  };

  const updateSingleImageSetting = (settingName, value) => {
    if (currentImageIndex === null) return;

    const updatedImages = images.map((image, idx) => {
      if (idx === currentImageIndex) {
        return {
          ...image,
          config: { ...image.config, [settingName]: value },
        };
      }
      return image;
    });

    setImages(updatedImages);

    // Update current setting
    const updatedSetting = { ...currentSetting, [settingName]: value };
    setCurrentSetting(updatedSetting);

    generateCSSStyling(updatedImages);
    console.log(images);
  };

  const [selectedColor, setSelectedColor] = useState('');



  const handlePixelChange = (e) => updateSettings('pixelEncoding', e.target.value);
  const handleWidthChange = (e) => updateSettings('canvasWidth', Number(e.target.value));
  const handleHeightChange = (e) => updateSettings('canvasHeight', Number(e.target.value));
  const handleBackgroundChange = (e) => { updateSettings('backgroundColor', e.target.value); setSelectedColor(e.target.value) };
  const handleInvertChange = (e) => updateSettings('invertColors', e.target.checked);
  const handleThresholdChange = (e) => updateSettings('threshold', parseInt(e.target.value));
  const handleRotationChange = (e) => updateSettings('rotation', parseInt(e.target.value));

  const handleFlipHorizontalChange = (e) => {
    const newFlipState = e.target.dataset.flip === "true" ? false : true;
    e.target.dataset.flip = newFlipState;
    updateSettings('flipHorizontal', newFlipState);
  };

  const handleFlipVerticalChange = (e) => {
    const newFlipState = e.target.dataset.flip === "true" ? false : true;
    e.target.dataset.flip = newFlipState;
    updateSettings('flipVertical', newFlipState);
  };

  const generateCSSStyling = (imagesToStyle) => {
    if (!imagesToStyle || !imagesToStyle.length) return;

    let tempStyling = new Array(imagesToStyle.length).fill("");

    imagesToStyle.forEach((image, index) => {
      let styleClasses = "";

      if (image.config.invertColors) {
        styleClasses += "invert ";
      }

      // Check flipHorizontal
      if (image.config.flipHorizontal) {
        styleClasses += "scale-x-[-1] ";
      }

      // Check flipVertical
      if (image.config.flipVertical) {
        styleClasses += "scale-y-[-1] ";
      }

      if (image.config.pixelEncoding) {
        if (image.config.pixelEncoding === 'grayscale') {
          setSelectedColor("");
        }
        styleClasses += colorModesCSS[image.config.pixelEncoding] + " ";
      }
      tempStyling[index] = styleClasses.trim();
    });

    setImgStyling(tempStyling);
  };

  // Apply changes to all images function
  const applyToAllImages = () => {
    if (currentImageIndex === null) return;

    const currentConfig = images[currentImageIndex].config;

    const updatedImages = images.map((image) => ({
      ...image,
      config: { ...currentConfig },
    }));

    setImages(updatedImages);
    setAllImageSetting(currentConfig);
    generateCSSStyling(updatedImages);
  };

  return (
    <div className="p-6 mx-auto w-full bg-[var(--color-border-component-background)] rounded-2xl shadow-xl backdrop-blur-sm my-10 border border-[var(--color-section-highlight)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-[var(--color-text)]">Image Configuration</h2>

        <div className="flex items-center gap-4">
          <label htmlFor="allImage" className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="imageSelection"
              id="allImage"
              checked={allImagesSelected}
              onChange={handleSelectAllImages}
              className="h-4 w-4 text-[var(--color-accent)] appearance-none"
            />
            
            <span className={`text-[var(--color-text)] py-2 px-4 rounded-lg ${!allImagesSelected ?  "bg-[var(--color-accent)]" : "border-[var(--color-accent)] border-[1px]"}`}>{allImagesSelected ? "All Images" : "Select All Images" }</span>
          </label>

          {!allImagesSelected && (
            <button
              onClick={applyToAllImages}
              className="px-4 py-2 bg-[var(--color-accent)] text-[var(--color-text)] rounded-lg hover:bg-transparent hover:border-[1px] hover:border-[var(--color-accent)] "
            >
              Apply to All
            </button>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mb-8">
          <div className="flex gap-4 pb-4 overflow-x-auto custom-scrollbar">
            {images.map((image, index) => {
              const isSelected = !allImagesSelected && currentImageIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-lg cursor-pointer p-2 transition-all  ${isSelected
                      ? 'border-2 border-[var(--color-accent)] bg-[var(--color-section-highlight)]'
                      : 'border border-[var(--color-accent)] hover:border-[var(--color-text)] hover:border-4'
                    }`}
                  onClick={() => handleSelectImage(index)}
                >
                  <div className='flex flex-col items-center'>
                    <div className='h-[120px] w-[120px] flex items-center justify-center rounded-md bg-[var(--color-component-background)]'>
                      <img
                        src={image.url}
                        alt={image.name}
                        className={`max-h-full max-w-full object-contain rounded-lg ${imgStyling[index]} drop-shadow-lg`}
                        style={{ transform: `rotate(${image.config.rotation || 0}deg)` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-[var(--color-text)] opacity-80 truncate w-[120px] text-center">
                      {image.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Settings Sections */}
      <div className="space-y-8">
        {/* Canvas Settings */}
        <div className="bg-[var(--color-component-background)] p-6 rounded-lg border border-[var(--color-accent)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">Canvas Settings</h3>
            <p className="text-sm text-[var(--color-text)] opacity-70">
              Configure dimensions and background for {allImagesSelected ? 'all images' : 'selected image'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="canvas-width" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Width
                </label>
                <input
                  id="canvas-width"
                  type="number"
                  min={0}
                  value={currentSetting.canvasWidth || 0}
                  onChange={handleWidthChange}
                  className="w-full px-3 py-2 bg-[var(--color-border-component-background)] border border-[var(--color-accent)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>

              <div>
                <label htmlFor="canvas-height" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Height
                </label>
                <input
                  id="canvas-height"
                  type="number"
                  min={0}
                  value={currentSetting.canvasHeight || 0}
                  onChange={handleHeightChange}
                  className="w-full px-3 py-2 bg-[var(--color-border-component-background)] border border-[var(--color-accent)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>

            {currentSetting.pixelEncoding !== 'grayscale' && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Background Color
                </label>
                <div className="flex items-center justify-center gap-3">
                  <input
                    type="color"
                    value={selectedColor}
                    onChange={handleBackgroundChange}
                    className="h-10 w-10 cursor-pointer rounded border border-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text)] opacity-80">
                    {selectedColor.toUpperCase()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Transformations */}
        <div className="bg-[var(--color-component-background)] p-6 rounded-lg border border-[var(--color-accent)]">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-1">Image Transformations</h3>
            <p className="text-sm text-[var(--color-text)] opacity-70">
              Rotate, flip, or invert your image
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="rotation" className="block text-sm font-medium text-[var(--color-text)] mb-1">
                  Rotation
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="rotation"
                    type="number"
                    value={currentSetting.rotation || 0}
                    onChange={handleRotationChange}
                    className="w-20 px-3 py-2 bg-[var(--color-border-component-background)] border border-[var(--color-accent)] rounded-md text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                  />
                  <span className="text-sm text-[var(--color-text)] opacity-70">degrees</span>
                </div>
              </div>

              
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
                Flip Image
              </label>
              <div className="flex gap-3">
                <button
                  onClick={handleFlipHorizontalChange}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentSetting.flipHorizontal
                      ? 'bg-[var(--color-accent)] text-[var(--color-text)]'
                      : 'bg-[var(--color-border-component-background)] text-[var(--color-text)] hover:bg-[var(--color-accent)]'
                    }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth="2">
                    <path d="M12 3v18M4 7h16M4 17h16"></path>
                  </svg>
                  Horizontal
                </button>
                <button
                  onClick={handleFlipVerticalChange}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${currentSetting.flipVertical
                      ? 'bg-[var(--color-accent)] text-[var(--color-text)]'
                      : 'bg-[var(--color-border-component-background)] text-[var(--color-text)] hover:bg-[var(--color-accent)]'
                    }`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4" strokeWidth="2">
                    <path d="M3 12h18M7 4v16M17 4v16"></path>
                  </svg>
                  Vertical
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between py-4">
                <label htmlFor="invert" className="text-sm font-medium text-[var(--color-text)]">
                  Invert Colors
                </label>
                <div className="relative inline-block w-10 mr-2 align-select-none">
                  <input
                    id="invert"
                    type="checkbox"
                    checked={currentSetting.invertColors || false}
                    onChange={handleInvertChange}
                    className="sr-only peer" // Added peer class for targeting with peer selectors
                  />
                  <label
                    htmlFor="invert"
                    className="block w-10 h-6 rounded-full cursor-pointer bg-[var(--color-accent)]"
                  ></label>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full "></div>
                </div>
              </div>
        </div>

        {/* Threshold Settings (conditional) */}
        {currentSetting.pixelEncoding === 'grayscale' && (
          <div className="bg-[var(--color-component-background)] p-6 rounded-lg border border-[var(--color-accent)]">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="threshold" className="text-sm font-medium text-[var(--color-text)]">
                    Brightness Threshold
                  </label>
                  <span className="text-sm text-[var(--color-text)] opacity-80">
                    {currentSetting.threshold || 128}
                  </span>
                </div>
                <input
                  id="threshold"
                  type="range"
                  min="0"
                  max="255"
                  step="1"
                  value={currentSetting.threshold || 128}
                  onChange={handleThresholdChange}
                  className="w-full h-2 bg-[var(--color-primary-darkest)] rounded-lg overflow-hidden appearance-none cursor-pointer"
                />
                <p className="text-xs text-[var(--color-text)] opacity-70 mt-2">
                  Pixels brighter than this value will become white, others will become black
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Color Mode Selection */}
        <div className="bg-[var(--color-component-background)] p-6 rounded-lg border border-[var(--color-accent)]">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-1">Color Mode</h3>
            <p className="text-sm text-[var(--color-text)] opacity-70">
              Select how colors should be processed
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {colorModes.map((mode) => (
              <label
                key={mode.id}
                className={`
              px-4 py-2 rounded-md border text-sm font-medium cursor-pointer transition-all
              ${currentSetting.pixelEncoding === mode.value
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text)]'
                    : 'border-[var(--color-accent)] text-[var(--color-text)] hover:bg-[var(--color-accent)]'
                  }
            `}
              >
                <input
                  type="radio"
                  name="colorMode"
                  value={mode.value}
                  checked={currentSetting.pixelEncoding === mode.value}
                  onChange={handlePixelChange}
                  className="hidden"
                />
                {mode.label}
              </label>
            ))}
          </div>

          <button
            onClick={() => handleImagesInput(images)}
            className="w-full py-3 bg-[var(--color-accent)] text-[var(--color-text)] font-bold rounded-lg hover:bg-[var(--color-accent)] transition-colors"
          >
           {processing ? "Generating Images..." : "Generate Images"} 
          </button>
        </div>
      </div>
    </div>
  );
}

{/* <label className="block text-sm font-medium text-gray-700">Background Color</label>
<div className="flex space-x-4">
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id="white"
      name="backgroundColor"
      value="white"
      checked={currentSetting.backgroundColor === 'white'}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor="white" className="text-sm text-gray-700">White</label>
  </div>
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id="black"
      name="backgroundColor"
      value="black"
      checked={currentSetting.backgroundColor === 'black'}
      onChange={() => handleBackgroundChange('black')}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor="black" className="text-sm text-gray-700">Black</label>
  </div>
  <div className="flex items-center space-x-2">
    <input
      type="radio"
      id="transparent"
      name="backgroundColor"
      value="transparent"
      checked={currentSetting.backgroundColor === 'transparent'}
      onChange={() => handleBackgroundChange('transparent')}
      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
    />
    <label htmlFor="transparent" className="text-sm text-gray-700">Transparent</label>
  </div>
</div> */}
