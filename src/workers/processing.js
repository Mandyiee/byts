

// Convert to 1-bit grayscale for OLED
function grayscale(data, name, width, height, threshold) {
  let grayData = `const uint8_t ${name}[] PROGMEM = {\n  `;
  const bytesPerRow = Math.ceil(width / 8);
  const bufferLength = bytesPerRow * height;

  let byteIndex = 0;
  let bytesOnCurrentLine = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 8) {
      let byteValue = 0;

      for (let bit = 0; bit < 8; bit++) {
        if (x + bit < width) {
          const i = (y * width + x + bit) * 4;
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);

          if (gray < 69) {
            byteValue |= (1 << (7 - bit));
          }
        }
      }

      grayData += `0x${byteValue.toString(16).padStart(2, '0')}`;
      byteIndex++;
      bytesOnCurrentLine++;

      if (bytesOnCurrentLine >= 16 && byteIndex < bufferLength) {
        grayData += ',\n  ';
        bytesOnCurrentLine = 0;
      } else if (byteIndex < bufferLength) {
        grayData += ', ';
      }
    }
  }

  grayData += '\n};';

  return {
    formattedCode: grayData,
  };
}


function rgb565(data, name, width, height) {
  let rgbData = `const uint16_t ${name}[] = {\n  `;
  const bufferLength = width * height;

  let byteIndex = 0;
  let bytesOnCurrentLine = 0;

  for (let i = 0; i < data.length; i += 4) {
    let red = data[i] >> 3;
    let green = data[i + 1] >> 2;
    let blue = data[i + 2] >> 3;

    let rgb565Value = ((red << 11) | (green << 5) | blue) >>> 0;

    rgbData += `0x${(rgb565Value & 0xFFFF).toString(16).padStart(4, '0')}`;
    byteIndex++;
    bytesOnCurrentLine++;

    if (bytesOnCurrentLine >= 12 && byteIndex < bufferLength) {
      rgbData += ',\n  ';
      bytesOnCurrentLine = 0;
    } else if (byteIndex < bufferLength) {
      rgbData += ', ';
    }
  }

  rgbData += '\n};';

  return {
    formattedCode: rgbData,
  };
}


// Convert to RGB888 format
function rgb888(data, name, width, height) {
  let rgbData = `const uint32_t ${name}[] = {\n  `;
  const bufferLength = width * height;

  let byteIndex = 0;
  let bytesOnCurrentLine = 0;

  for (let i = 0; i < data.length; i += 4) {
    let red = data[i];
    let green = data[i + 1];
    let blue = data[i + 2];

    const rgb = ((red << 16) | (green << 8) | blue) >>> 0;


    rgbData += `0x${rgb.toString(16).padStart(6, '0').padStart(8, '0')}`;
    byteIndex++;
    bytesOnCurrentLine++;

    if (bytesOnCurrentLine >= 10 && byteIndex < bufferLength) {
      rgbData += ',\n  ';
      bytesOnCurrentLine = 0;
    } else if (byteIndex < bufferLength) {
      rgbData += ', ';
    }
  }

  rgbData += '\n};';

  return {
    formattedCode: rgbData,
  };
}

// Convert to RGBA8888 format (32-bit color with alpha)
function rgba8888(data, name, width, height) {
  let rgbaData = `const uint32_t ${name}[] = {\n  `;
  const bufferLength = width * height;

  let byteIndex = 0;
  let bytesOnCurrentLine = 0;

  for (let i = 0; i < data.length; i += 4) {
    let red = data[i];
    let green = data[i + 1];
    let blue = data[i + 2];
    let alpha = data[i + 3];

    const rgba = ((red << 24) | (green << 16) | (blue << 8) | alpha) >>> 0;

    rgbaData += `0x${rgba.toString(16).padStart(8, '0')}`;
    byteIndex++;
    bytesOnCurrentLine++;

    if (bytesOnCurrentLine >= 12 && byteIndex < bufferLength) {
      rgbaData += ',\n  ';
      bytesOnCurrentLine = 0;
    } else if (byteIndex < bufferLength) {
      rgbaData += ', ';
    }
  }

  rgbaData += '\n};';

  return {
    formattedCode: rgbaData,
  };
}


const encoding = {
  grayscale,
  rgb565,
  rgb888,
  rgba8888
};

self.onmessage = function (e) {
  try {
    console.log('Worker received task:', e.data);
    const { task } = e.data;

    if (!task?.image) {
      throw new Error('No image provided to worker');
    }

    const image = task.image;

    const originalWidth = image.width;
    const originalHeight = image.height;

    // Fetch and process the image
    fetch(image.url)
      .then(response => response.blob())
      .then(blob =>

        createImageBitmap(blob, 0, 0, image.width, image.height)
      )
      .then(bitmap => {
        // Calculate final dimensions
        let width = originalWidth;
        let height = originalHeight;

        if (image.config?.canvasWidth > 0 && image.config?.canvasHeight > 0) {
          width = image.config.canvasWidth;
          height = image.config.canvasHeight;
        } else if (image.config?.canvasWidth > 0) {
          const aspectRatio = originalHeight / originalWidth;
          width = image.config.canvasWidth;
          height = Math.round(width * aspectRatio);
        } else if (image.config?.canvasHeight > 0) {
          const aspectRatio = originalWidth / originalHeight;
          height = image.config.canvasHeight;
          width = Math.round(height * aspectRatio);
        }

        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        ctx.fillStyle = image.config?.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);


        if (image.config.flipHorizontal || image.config.flipVertical || image.config.rotation) {
          ctx.save();

          ctx.translate(width / 2, height / 2);

          if (image.config.rotation) {
            ctx.rotate(image.config.rotation * Math.PI / 180);
          }

          const scaleX = image.config.flipHorizontal ? -1 : 1;
          const scaleY = image.config.flipVertical ? -1 : 1;
          ctx.scale(scaleX, scaleY);

          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(bitmap, -width / 2, -height / 2, width, height);

          ctx.restore();
        } else {
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(bitmap, 0, 0, width, height);
        }

        const imageData = ctx.getImageData(0, 0, width, height);
        let data = imageData.data;

        if (image.config.invertColors) {
          data = invertImage(data);
        }

        const pixelFormat = image.config.pixelEncoding || 'rgb565';
        const processedData = encoding[pixelFormat](data, image.name, width, height, image.config.threshold);

        bitmap.close();

        self.postMessage({
          type: 'complete',
          name: image.name,
          encoding: pixelFormat,
          width: width,
          height: height,
          data: processedData.formattedCode,
        });
      })
      .catch(err => {
        self.postMessage({
          type: 'error',
          name: image.name,
          error: `Failed to process image: ${err.message}`
        });
      });
  } catch (error) {
    console.error('Worker error:', error);
    self.postMessage({
      type: 'error',
      name: e.data.task?.image?.name || 'unknown',
      error: error.message
    });
  }
};

function invertImage(data) {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];

  }
  return data;
}

console.log('Image processing worker initialized');
