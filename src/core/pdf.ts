/**
 * PDF Engine - handles PDF rendering and text extraction
 */
import * as pdfjs from 'pdfjs-dist';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface PDFPage {
  number: number;
  canvas: HTMLCanvasElement;
  textContent: TextItem[];
  viewport: pdfjs.PageViewport;
}

export interface TextItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  hasEOL: boolean;
}

export class PDFEngine {
  private pdf: pdfjs.PDFDocumentProxy | null = null;
  
  async load(file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    this.pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  }
  
  getPageCount(): number {
    return this.pdf?.numPages || 0;
  }
  
  async renderPage(pageNumber: number, scale: number = 1.5): Promise<PDFPage> {
    if (!this.pdf) throw new Error('PDF not loaded');
    
    const page = await this.pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport
    }).promise;
    
    const textContent = await page.getTextContent();
    const textItems: TextItem[] = textContent.items.map((item: any) => ({
      text: item.str,
      x: item.transform[4],
      y: item.transform[5],
      width: item.width,
      height: item.height,
      fontName: item.fontName,
      hasEOL: item.hasEOL
    }));
    
    return {
      number: pageNumber,
      canvas,
      textContent: textItems,
      viewport
    };
  }
  
  destroy(): void {
    this.pdf?.destroy();
    this.pdf = null;
  }
}

export const pdfEngine = new PDFEngine();
