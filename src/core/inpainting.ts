/**
 * Inpainting Engine - AI-powered image restoration
 */

export interface InpaintOptions {
  prompt: string;
  mask: ImageData;
  original: ImageData;
  strength?: number; // 0-1, how much to change
  steps?: number; // diffusion steps
}

export interface InpaintResult {
  success: boolean;
  image?: ImageData;
  error?: string;
  processingTime?: number;
}

/**
 * Simple inpainting using canvas context
 * For production, this should use Stable Diffusion via Ollama
 */
export class InpaintingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }
    this.ctx = ctx;
  }

  /**
   * Basic inpainting using surrounding pixels
   * This is a placeholder - real implementation uses AI
   */
  async inpaintBasic(options: InpaintOptions): Promise<InpaintResult> {
    const startTime = Date.now();

    try {
      const { original, mask, prompt } = options;

      // Set canvas size
      this.canvas.width = original.width;
      this.canvas.height = original.height;

      // Draw original
      this.ctx.putImageData(original, 0, 0);

      // Get mask bounds
      const bounds = this.getMaskBounds(mask);
      if (!bounds) {
        return {
          success: false,
          error: 'Mask is empty'
        };
      }

      // Simple inpainting: blur surrounding area
      // In real implementation, this calls SD via Ollama
      await this.fillWithSurroundingPixels(bounds, mask);

      // Get result
      const result = this.ctx.getImageData(0, 0, original.width, original.height);

      return {
        success: true,
        image: result,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Inpainting failed'
      };
    }
  }

  /**
   * Get bounding box of mask
   */
  private getMaskBounds(mask: ImageData): { x: number; y: number; width: number; height: number } | null {
    const data = mask.data;
    let minX = mask.width;
    let minY = mask.height;
    let maxX = 0;
    let maxY = 0;
    let hasPixels = false;

    for (let y = 0; y < mask.height; y++) {
      for (let x = 0; x < mask.width; x++) {
        const idx = (y * mask.width + x) * 4;
        // Check if pixel is masked (non-zero alpha)
        if (data[idx + 3] > 128) {
          hasPixels = true;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (!hasPixels) return null;

    return {
      x: minX,
      y: minY,
      width: maxX - minX + 1,
      height: maxY - minY + 1
    };
  }

  /**
   * Fill masked area with surrounding pixels (simple algorithm)
   */
  private async fillWithSurroundingPixels(
    bounds: { x: number; y: number; width: number; height: number },
    mask: ImageData
  ): Promise<void> {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const maskData = mask.data;

    // Simple diffusion: average of surrounding non-masked pixels
    const radius = 5;

    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        const maskIdx = (y * mask.width + x) * 4;

        // If pixel is masked
        if (maskData[maskIdx + 3] > 128) {
          let r = 0, g = 0, b = 0, count = 0;

          // Sample surrounding pixels
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const sy = y + dy;
              const sx = x + dx;

              if (sy >= 0 && sy < this.canvas.height &&
                  sx >= 0 && sx < this.canvas.width) {
                const sIdx = (sy * this.canvas.width + sx) * 4;
                const sMaskIdx = (sy * mask.width + sx) * 4;

                // Only use non-masked pixels
                if (maskData[sMaskIdx + 3] <= 128) {
                  r += data[sIdx];
                  g += data[sIdx + 1];
                  b += data[sIdx + 2];
                  count++;
                }
              }
            }
          }

          if (count > 0) {
            const idx = (y * this.canvas.width + x) * 4;
            data[idx] = r / count;
            data[idx + 1] = g / count;
            data[idx + 2] = b / count;
            data[idx + 3] = 255;
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * Full AI inpainting via Ollama Stable Diffusion
   */
  async inpaintAI(options: InpaintOptions): Promise<InpaintResult> {
    const startTime = Date.now();

    try {
      // Convert images to base64
      const originalBase64 = this.imageDataToBase64(options.original);
      const maskBase64 = this.imageDataToBase64(options.mask);

      // Call Ollama API
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'sd-inpaint',
          prompt: options.prompt,
          images: [originalBase64, maskBase64],
          options: {
            strength: options.strength ?? 0.75,
            steps: options.steps ?? 20
          },
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const result = await response.json();

      if (!result.images || result.images.length === 0) {
        throw new Error('No image generated');
      }

      const resultImage = this.base64ToImageData(result.images[0], options.original.width, options.original.height);

      return {
        success: true,
        image: resultImage,
        processingTime: Date.now() - startTime
      };
    } catch (error) {
      // Fallback to basic inpainting
      console.warn('AI inpainting failed, using basic:', error);
      return this.inpaintBasic(options);
    }
  }

  /**
   * Check if Ollama with SD is available
   */
  async isAIAvailable(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags', {
        signal: AbortSignal.timeout(5000)
      });

      if (!response.ok) return false;

      const data = await response.json();
      // Check if sd-inpaint model exists
      return data.models?.some((m: any) => m.name.includes('sd')) ?? false;
    } catch {
      return false;
    }
  }

  private imageDataToBase64(imageData: ImageData): string {
    this.canvas.width = imageData.width;
    this.canvas.height = imageData.height;
    this.ctx.putImageData(imageData, 0, 0);
    return this.canvas.toDataURL('image/png').split(',')[1];
  }

  private base64ToImageData(base64: string, width: number, height: number): ImageData {
    return new ImageData(new Uint8ClampedArray(0), width, height); // Placeholder
  }
}

export const inpaintingEngine = new InpaintingEngine();
