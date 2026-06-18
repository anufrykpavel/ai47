/**
 * Core modules tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { pdfEngine } from '../src/core/pdf';
import { canvasEditor } from '../src/core/canvas';
import { ocrEngine } from '../src/core/ocr';
import { aiEngine } from '../src/core/ai';

describe('PDF Engine', () => {
  afterEach(() => {
    pdfEngine.destroy();
  });

  it('should initialize without errors', () => {
    expect(pdfEngine.getPageCount()).toBe(0);
  });

  it('should handle non-PDF files gracefully', async () => {
    const fakeFile = new File(['not a pdf'], 'test.txt', { type: 'text/plain' });
    await expect(pdfEngine.load(fakeFile)).rejects.toThrow();
  });
});

describe('Canvas Editor', () => {
  beforeEach(() => {
    // Mock canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'test-canvas';
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    canvasEditor.dispose();
    const canvas = document.getElementById('test-canvas');
    canvas?.remove();
  });

  it('should initialize canvas', () => {
    canvasEditor.init('test-canvas', 800, 600);
    expect(canvasEditor.getCanvas()).not.toBeNull();
  });

  it('should track undo/redo state', () => {
    canvasEditor.init('test-canvas', 800, 600);
    expect(canvasEditor.canUndo()).toBe(false);
    expect(canvasEditor.canRedo()).toBe(false);
  });
});

describe('OCR Engine', () => {
  afterEach(async () => {
    await ocrEngine.terminate();
  });

  it('should initialize Tesseract', async () => {
    await ocrEngine.init('eng');
    expect(ocrEngine.isInitialized()).toBe(true);
  });

  it('should require initialization before use', async () => {
    await expect(ocrEngine.recognizeTextOnly('test')).rejects.toThrow('not initialized');
  });
});

describe('AI Engine', () => {
  it('should check Ollama availability', async () => {
    const available = await aiEngine.isOllamaAvailable();
    // Should return boolean, not throw
    expect(typeof available).toBe('boolean');
  });

  it('should handle text edit without provider', async () => {
    const result = await aiEngine.editText('test', 'make it formal');
    // Should fail gracefully without provider
    expect(result.success).toBe(false);
  });
});
