# Bitez - Embedded Image Conversion Toolkit

Bitez is a high-performance image processing toolkit specifically designed for embedded systems developers. It converts images into optimized formats (RGB565, RGB888, RGBA8888, 1-bit grayscale, etc.) for microcontrollers, displays, and IoT devices. Built with Web Workers for blazing-fast processing, Bitez allows you to resize, transform, and optimize images before exporting them as production-ready C/C++ arrays.

## Key Features

### Performance-Optimized
- **Multi-threaded Processing** – Offloads heavy image conversion tasks to background threads for a responsive UI experience
- **Hardware-accelerated Rendering** – Utilizes OffscreenCanvas for maximum performance
- **Memory-efficient Operations** – Implements proper cleanup to prevent memory leaks

### Image Transformation
- **Precise Resizing** – Maintain aspect ratio or specify exact dimensions 
- **Advanced Styling Options**
  - Flip (horizontal/vertical)
  - Rotate (custom angles with anti-aliasing)
  - Invert Colors (ideal for monochrome displays)
  - Custom Background Color
  - Brightness/Contrast Adjustments
  - Dithering for reduced color palettes

### Multiple Output Formats
- **RGB565** (16-bit color for most TFT displays)
- **RGB888** (24-bit true color)
- **RGBA8888** (32-bit color with alpha transparency)
- **1-bit Monochrome** (for OLED/E-Paper displays)
- **4/8-bit Grayscale** (for e-readers and low-color displays)
- **Custom Palettes** (for color-constrained environments)

### Developer-Friendly Export
- **Optimized C/C++ Arrays** – Ready to use in Arduino, ESP32, STM32, and other platforms
- **Variable Naming Options** – Customize array names and formatting
- **Preview Mode** – See exactly how your image will appear on target hardware
- **Compression Options** – RLE and other algorithms to minimize storage requirements

## How It Works

1. **Upload an Image** – Drag & drop or select PNG, JPG, BMP, WebP, or SVG
2. **Configure Output** – Set dimensions, color format, and transformations
3. **Optimize Settings** – Fine-tune for your specific hardware constraints
4. **Process & Export** – Get formatted C/C++ code or binary data instantly

## Real-World Applications

- **Embedded User Interfaces** – Create professional GUIs for touchscreen devices
- **IoT Dashboards** – Optimize icons and graphics for connected displays
- **Wearable Tech** – Produce efficient assets for smartwatches and fitness trackers
- **Retro Computing** – Convert modern graphics for vintage systems and emulators
- **Digital Signage** – Prepare content for commercial displays
- **Microcontroller Graphics** – Build rich visual experiences on resource-constrained devices

## Installation & Usage

### Web Version
Simply visit [bitez.](https) and start converting images instantly!

### Local Development
```bash
git clone <link>
npm install
npm run dev
```

## Advanced Features

- **Batch Processing** – Convert multiple images at once
- **Command Line Interface** – Integrate with build systems and automation
- **API Access** – Incorporate Bitez into your development workflow
- **Custom Format Plugins** – Extend functionality for specialized hardware

## License

MIT License - Free for personal and commercial use.

## Built With Modern Web Technologies

- Web Workers
- OffscreenCanvas
- ES6+ JavaScript