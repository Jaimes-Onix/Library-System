
import * as pdfjsLib from 'pdfjs-dist';

// Reliable CDN version for the worker - Synced with index.tsx
const PDFJS_VERSION = '4.10.38';

if (typeof window !== 'undefined') {
  // Use the standard minified worker for maximum compatibility
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;
}

export const getDocument = async (file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
      cMapPacked: true,
      disableFontFace: false
    });

    return await loadingTask.promise;
  } catch (error) {
    console.error("PDF Library Error:", error);
    throw new Error("PDF failed to load. Check for corruption.");
  }
};
