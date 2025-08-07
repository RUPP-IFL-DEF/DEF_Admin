export default function getCroppedImg(imageSrc, pixelCrop, outputWidth = 400, outputHeight = 300) {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute('crossOrigin', 'anonymous'); // for CORS if needed
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
      });
  
    return new Promise(async (resolve, reject) => {
      try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement('canvas');
  
        // Set canvas to desired output size (resize here)
        canvas.width = outputWidth;
        canvas.height = outputHeight;
  
        const ctx = canvas.getContext('2d');
  
        // Draw the cropped area, resized to output size
        ctx.drawImage(
          image,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          outputWidth,
          outputHeight
        );
  
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            resolve(blob);
          },
          'image/jpeg',
          0.95 // quality parameter (optional)
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  