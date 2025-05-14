import { useState } from "react";
import { Monitor, Smartphone, Watch, CircuitBoard, RefreshCw, Plus, Minus } from "lucide-react";

export default function DisplaySimulator({ images, imgStyling }) {
  const [displayType, setDisplayType] = useState("oled");
  const [displaySize, setDisplaySize] = useState({ width: 128, height: 64 });
  const [row, setRow] = useState(1);
  const [column, setColumn] = useState(1);

  // Predefined device profiles
  const deviceProfiles = {
    "oled128x64": { type: "oled", width: 128, height: 64, name: "OLED 128×64" },
    "lcd160x128": { type: "lcd", width: 160, height: 128, name: "LCD 160×128" },
    "eink200x200": { type: "eink", width: 200, height: 200, name: "E-Ink 200×200" },
    "tft320x240": { type: "tft", width: 320, height: 240, name: "TFT 320×240" },
    "custom": { type: "custom", width: 0, height: 0, name: "Custom Size" }
  };


  const handleDeviceSelect = (deviceKey) => {
    if (deviceKey === "custom") {
      setDisplayType("custom");
      return;
    }

    const device = deviceProfiles[deviceKey];
    setDisplayType(device.type);
    setDisplaySize({ width: device.width, height: device.height });
  };


  // Simulate pixelation effect
  const renderPixelatedDisplay = () => {
    if (images.length == 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-[var(--color-text)]">
            Upload an icon to preview
          </p>
        </div>
      );
    }

    // This is a simplified representation of how the icon would look
    return (
      <div className="relative w-full h-full overflow-hidden" style={{
        display: "grid",
        placeItems: 'center',
        gridTemplateColumns: `repeat(${column}, 1fr)`,
        gridTemplateRows: `repeat(${row}, 1fr)`,
        gap: 0,    
      }}>
        {images.map((image, index) => {
          return (
            <div key={index} className={`flex items-center justify-center rounded-md`} 
            style={{
              backgroundColor: image.config.backgroundColor,
              height: `${image.config.canvasHeight}px`,
              width: `${image.config.canvasWidth}px`,
            }}>
              <img
                src={image.url}
                alt={image.name}
                className={`max-h-full max-w-full object-contain rounded-lg ${imgStyling[index]} drop-shadow-lg`}
                style={{ transform: `rotate(${image.config.rotation || 0}deg)` }}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className="w-full border border-[var(--color-section-highlight)] rounded-2xl shadow-xl backdrop-blur-sm bg-[var(--color-border-component-background)] my-10 overflow-hidden"
    >
      <div
        className="px-6 py-4 flex justify-between items-center"
      >
        <h3  className="text-2xl font-bold text-[var(--color-text)] text-center">
          Display Simulator
        </h3>
      </div>

      <div className="p-4">
        {/* Device Selection */}
        <div className="mb-4 grid grid-cols-5 gap-2">
          {Object.keys(deviceProfiles).map(key => (
            <button
              key={key}
              onClick={() => handleDeviceSelect(key)}
              className={`p-2 text-center rounded-lg text-sm flex flex-col items-center justify-center transition-all ${displayType === deviceProfiles[key].type && key !== "custom" ? "ring-2" : ""}`}
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-text)",
                ringColor: "var(--color-accent)"
              }}
            >
              {key === "oled128x64" && <Monitor size={16} className="mb-1" />}
              {key === "lcd160x128" && <Smartphone size={16} className="mb-1" />}
              {key === "eink200x200" && <Watch size={16} className="mb-1" />}
              {key === "tft320x240" && <CircuitBoard size={16} className="mb-1" />}
              {key === "custom" && <RefreshCw size={16} className="mb-1" />}
              <p className="whitespace-normal break-words">{deviceProfiles[key].name}</p>
            </button>
          ))}

          
        </div>
        <div className="flex justify-between items-center h-fit w-full px-2  my-2">
            <div className="flex justify-center items-center flex-col">
              <div className="flex justify-center items-center">
                <button
                  className="py-2 px-2 rounded-l-lg hover:bg-[#211720] transition-colors"
                  style={{
                    backgroundColor: "var(--color-component-background)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-section-highlight)"
                  }}
                  onClick={() => setColumn(prev => Math.max(1, prev - 1))}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  className="py-2 px-2 text-center w-16"
                  style={{
                    backgroundColor: "var(--color-border-component-background)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-section-highlight)"
                  }}
                  value={column}
                  readOnly
                />
                <button
                  className="py-2 px-2 rounded-r-lg hover:bg-[#211720] transition-colors"
                  style={{
                    backgroundColor: "var(--color-component-background)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-section-highlight)"
                  }}
                  onClick={() => setColumn(prev => prev + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-white">Columns</p>
            </div>
            <div className="flex justify-center items-center flex-col">
              <div className="flex justify-center items-center">
                <button
                  className="py-2 px-2 rounded-l-lg hover:bg-[#211720] transition-colors"
                  style={{
                    backgroundColor: "var(--color-component-background)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-section-highlight)"
                  }}
                  onClick={() => setRow(prev => Math.max(1, prev - 1))}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  className="py-2 px-2 text-center w-16"
                  style={{
                    backgroundColor: "var(--color-border-component-background)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-section-highlight)"
                  }}
                  value={row}
                  readOnly
                />
                <button
                  className="py-2 px-2 rounded-r-lg hover:bg-[#211720] transition-colors"
                  style={{
                    backgroundColor: "var(--color-component-background)",
                    color: "var(--color-text)",
                    border: "1px solid var(--color-section-highlight)"
                  }}
                  onClick={() => setRow(prev => prev + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-white"> Rows</p>
            </div>
          </div>
        {/* Custom Size Inputs (shown if custom is selected) */}
        {displayType === "custom" && (
          <div className="mb-4 flex gap-4 py-4">
            <div className="flex-1">
              <label style={{ color: "var(--color-text)" }} className="block text-sm mb-1">Width (px)</label>
              <input
                type="number"
                value={displaySize.width}
                onChange={(e) => setDisplaySize({ ...displaySize, width: parseInt(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg"
                style={{ backgroundColor: "var(--color-primary-darkest)", color: "var(--color-text)" }}
                min="1"
                max="1024"
              />
            </div>
            <div className="flex-1">
              <label style={{ color: "var(--color-text)" }} className="block text-sm mb-1">Height (px)</label>
              <input
                type="number"
                value={displaySize.height}
                onChange={(e) => setDisplaySize({ ...displaySize, height: parseInt(e.target.value) || 0 })}
                className="w-full p-2 rounded-lg"
                style={{ backgroundColor: "var(--color-primary-darkest)", color: "var(--color-text)" }}
                min="1"
                max="768"
              />
            </div>
          </div>
        )}


        {/* Display Preview */}
        <div className="mb-4 overflow-auto py-4">
          <div
            className="border bg-[var(--color-border-component-background)]  rounded-lg mx-auto"
            style={{
              width: `${displaySize.width}px`,
              height: `${displaySize.height}px`,
              border: "1px solid var(--color-accent)",
              padding: "10px",
            }}
          >
            {renderPixelatedDisplay()}
          </div>
        </div>
      </div>
    </div>
  );
}

// imageRendering: "pixelated",