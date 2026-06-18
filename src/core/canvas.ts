/**
 * Canvas Editor - Fabric.js wrapper for image editing
 */
import { fabric } from 'fabric';

export interface Layer {
  id: string;
  name: string;
  fabricObject: fabric.Object;
  visible: boolean;
  locked: boolean;
  opacity: number;
}

export interface HistoryState {
  layers: string; // JSON serialized
  timestamp: number;
}

export class CanvasEditor {
  private canvas: fabric.Canvas | null = null;
  private layers: Map<string, Layer> = new Map();
  private history: HistoryState[] = [];
  private historyIndex: number = -1;
  private maxHistory: number = 20;
  
  init(elementId: string, width: number, height: number): void {
    this.canvas = new fabric.Canvas(elementId, {
      width,
      height,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
      selection: true
    });
    
    this.setupEvents();
    this.saveState();
  }
  
  private setupEvents(): void {
    if (!this.canvas) return;
    
    this.canvas.on('object:modified', () => {
      this.saveState();
    });
    
    this.canvas.on('object:added', () => {
      this.saveState();
    });
  }
  
  private saveState(): void {
    if (!this.canvas) return;
    
    // Remove future states if we're in middle of history
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    const state: HistoryState = {
      layers: JSON.stringify(this.canvas.toJSON()),
      timestamp: Date.now()
    };
    
    this.history.push(state);
    
    // Keep only maxHistory states
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }
  
  undo(): void {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.restoreState();
    }
  }
  
  redo(): void {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.restoreState();
    }
  }
  
  private restoreState(): void {
    if (!this.canvas || this.historyIndex < 0) return;
    
    const state = this.history[this.historyIndex];
    this.canvas.loadFromJSON(state.layers, () => {
      this.canvas?.renderAll();
    });
  }
  
  addImage(url: string, options?: fabric.IImageOptions): Promise<fabric.Image> {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        reject(new Error('Canvas not initialized'));
        return;
      }
      
      fabric.Image.fromURL(url, (img) => {
        img.set({
          left: 0,
          top: 0,
          ...options
        });
        
        this.canvas!.add(img);
        this.canvas!.renderAll();
        
        resolve(img);
      }, { crossOrigin: 'anonymous' });
    });
  }
  
  addText(text: string, options?: fabric.ITextOptions): fabric.Text {
    if (!this.canvas) throw new Error('Canvas not initialized');
    
    const textObj = new fabric.Text(text, {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: '#000000',
      ...options
    });
    
    this.canvas.add(textObj);
    this.canvas.renderAll();
    
    return textObj;
  }
  
  setSelection(mode: 'single' | 'multiple' | 'none'): void {
    if (!this.canvas) return;
    this.canvas.selection = mode !== 'none';
    this.canvas.selectionMode = mode === 'multiple' ? 'multiple' : 'single';
  }
  
  deleteSelection(): void {
    if (!this.canvas) return;
    
    const activeObjects = this.canvas.getActiveObjects();
    activeObjects.forEach(obj => {
      this.canvas!.remove(obj);
    });
    
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
    this.saveState();
  }
  
  exportToPNG(): string {
    if (!this.canvas) throw new Error('Canvas not initialized');
    return this.canvas.toDataURL({
      format: 'png',
      quality: 1
    });
  }
  
  exportToJPEG(): string {
    if (!this.canvas) throw new Error('Canvas not initialized');
    return this.canvas.toDataURL({
      format: 'jpeg',
      quality: 0.9
    });
  }
  
  dispose(): void {
    this.canvas?.dispose();
    this.canvas = null;
    this.layers.clear();
    this.history = [];
    this.historyIndex = -1;
  }
  
  getCanvas(): fabric.Canvas | null {
    return this.canvas;
  }
  
  canUndo(): boolean {
    return this.historyIndex > 0;
  }
  
  canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }
}

export const canvasEditor = new CanvasEditor();
