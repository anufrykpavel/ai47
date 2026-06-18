/**
 * OCR Engine - Tesseract.js wrapper for text recognition
 */
import { createWorker, Worker } from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

export interface OCROptions {
  language?: string;
  mode?: 'single' | 'batch';
}

export class OCREngine {
  private worker: Worker | null = null;
  private initialized: boolean = false;
  
  async init(language: string = 'eng'): Promise<void> {
    if (this.initialized) return;
    
    this.worker = await createWorker(language);
    this.initialized = true;
  }
  
  async recognize(imageData: ImageData | string): Promise<OCRResult[]> {
    if (!this.worker) {
      throw new Error('OCR not initialized. Call init() first.');
    }
    
    const result = await this.worker.recognize(imageData);
    
    // Extract words with bounding boxes
    const words: OCRResult[] = [];
    
    if (result.data.words) {
      for (const word of result.data.words) {
        words.push({
          text: word.text,
          confidence: word.confidence,
          bbox: {
            x0: word.bbox.x0,
            y0: word.bbox.y0,
            x1: word.bbox.x1,
            y1: word.bbox.y1
          }
        });
      }
    }
    
    return words;
  }
  
  async recognizeTextOnly(imageData: ImageData | string): Promise<string> {
    if (!this.worker) {
      throw new Error('OCR not initialized. Call init() first.');
    }
    
    const result = await this.worker.recognize(imageData);
    return result.data.text;
  }
  
  async changeLanguage(language: string): Promise<void> {
    if (!this.worker) {
      throw new Error('OCR not initialized');
    }
    
    await this.worker.loadLanguage(language);
    await this.worker.initialize(language);
  }
  
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.initialized = false;
    }
  }
  
  isInitialized(): boolean {
    return this.initialized;
  }
}

export const ocrEngine = new OCREngine();
