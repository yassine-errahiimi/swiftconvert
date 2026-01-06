
import { jsPDF } from 'jspdf';
import * as mammoth from 'mammoth';
// Note: pdfjs-dist requires a worker. We'll load it from a CDN to ensure it works in this environment.
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js Worker
const PDFJS_WORKER_URL = 'https://esm.sh/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';
pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;

/**
 * Helper to convert a File to a Data URL
 */
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Helper to convert a File to ArrayBuffer
 */
const fileToArrayBuffer = (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Real Image to PDF Conversion
 */
export const convertToPdf = async (files: File[]): Promise<{ url: string, name: string }> => {
  const doc = new jsPDF();
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const dataUrl = await fileToDataUrl(file);
    
    if (i > 0) {
      doc.addPage();
    }

    // Attempt to fit image to A4 dimensions (210x297mm)
    doc.addImage(dataUrl, 'JPEG', 10, 10, 190, 0); 
  }

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  return { url, name: 'converted_document.pdf' };
};

/**
 * PDF to Image Conversion (Real implementation using PDF.js)
 */
export const convertPdfToImages = async (file: File): Promise<{ url: string, name: string }> => {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  // Render the first page
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for quality
  
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) throw new Error("Could not create canvas context");

  canvas.height = viewport.height;
  canvas.width = viewport.width;

  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise;

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Canvas to Blob failed");
      const url = URL.createObjectURL(blob);
      resolve({ url, name: file.name.replace(/\.[^/.]+$/, "") + '_page1.png' });
    }, 'image/png');
  });
};

/**
 * Word to PDF Conversion (Real implementation using Mammoth.js + jsPDF)
 */
export const convertWordToPdf = async (file: File): Promise<{ url: string, name: string }> => {
  const arrayBuffer = await fileToArrayBuffer(file);
  
  // Extract text from Word
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  const doc = new jsPDF();
  // Split text into lines that fit the page width
  const splitText = doc.splitTextToSize(text, 180);
  doc.text(splitText, 15, 20);

  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  return { url, name: file.name.replace(/\.[^/.]+$/, "") + '.pdf' };
};

/**
 * PDF to Word Conversion (Text extraction approach)
 */
export const convertPdfToWord = async (file: File): Promise<{ url: string, name: string }> => {
  const arrayBuffer = await fileToArrayBuffer(file);
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item: any) => item.str);
    fullText += strings.join(" ") + "\n\n";
  }

  // Create a blob as a simple text-based DOC file
  // Note: True PDF to formatted DOCX is extremely complex client-side; 
  // this provides the content in a Word-readable format.
  const blob = new Blob([fullText], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  return { url, name: file.name.replace(/\.[^/.]+$/, "") + '.doc' };
};
