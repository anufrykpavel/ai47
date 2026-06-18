/**
 * AI Engine - orchestrates local and remote AI models
 */

export interface AIRequest {
  type: 'inpaint' | 'style-transfer' | 'text-edit' | 'object-detection';
  image?: ImageData;
  mask?: ImageData;
  text?: string;
  prompt?: string;
  options?: Record<string, any>;
}

export interface AIResult {
  success: boolean;
  data?: ImageData | string | BoundingBox[];
  error?: string;
  cost?: number;
  model: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export class AIEngine {
  private ollamaUrl: string = 'http://localhost:11434';
  private openRouterKey: string | null = null;
  private maxCost: number = 0.001; // Safety limit per request
  
  constructor(config?: { ollamaUrl?: string; openRouterKey?: string }) {
    if (config?.ollamaUrl) this.ollamaUrl = config.ollamaUrl;
    if (config?.openRouterKey) this.openRouterKey = config.openRouterKey;
  }
  
  /**
   * Check if Ollama is available locally
   */
  async isOllamaAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }
  
  /**
   * Inpaint - fill selected area with AI
   */
  async inpaint(image: ImageData, mask: ImageData, prompt: string): Promise<AIResult> {
    // Try local Ollama first
    const localAvailable = await this.isOllamaAvailable();
    
    if (localAvailable) {
      return this.inpaintLocal(image, mask, prompt);
    }
    
    // Fallback to remote
    if (this.openRouterKey) {
      return this.inpaintRemote(image, mask, prompt);
    }
    
    return {
      success: false,
      error: 'No AI provider available. Install Ollama or set OpenRouter key.',
      model: 'none'
    };
  }
  
  private async inpaintLocal(image: ImageData, mask: ImageData, prompt: string): Promise<AIResult> {
    try {
      // Convert ImageData to base64
      const imageBase64 = this.imageDataToBase64(image);
      const maskBase64 = this.imageDataToBase64(mask);
      
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'sd-inpaint', // or similar local model
          prompt: `Inpaint with: ${prompt}`,
          images: [imageBase64, maskBase64],
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: true,
        data: this.base64ToImageData(result.images[0]),
        model: 'ollama/sd-inpaint',
        cost: 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: 'ollama/sd-inpaint'
      };
    }
  }
  
  private async inpaintRemote(image: ImageData, mask: ImageData, prompt: string): Promise<AIResult> {
    // Using OpenRouter with cheap models
    // This is a placeholder - real implementation would use proper API
    return {
      success: false,
      error: 'Remote inpaint not implemented yet',
      model: 'openrouter'
    };
  }
  
  /**
   * Edit text with AI
   */
  async editText(text: string, instruction: string): Promise<AIResult> {
    const localAvailable = await this.isOllamaAvailable();
    
    if (localAvailable) {
      return this.editTextLocal(text, instruction);
    }
    
    if (this.openRouterKey) {
      return this.editTextRemote(text, instruction);
    }
    
    return {
      success: false,
      error: 'No AI provider available',
      model: 'none'
    };
  }
  
  private async editTextLocal(text: string, instruction: string): Promise<AIResult> {
    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2',
          prompt: `Edit this text according to the instruction.

Text: "${text}"

Instruction: ${instruction}

Provide only the edited text, no explanations.`,
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama error: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: true,
        data: result.response.trim(),
        model: 'ollama/llama3.2',
        cost: 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: 'ollama/llama3.2'
      };
    }
  }
  
  private async editTextRemote(text: string, instruction: string): Promise<AIResult> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openRouterKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-haiku',
          messages: [{
            role: 'user',
            content: `Edit this text: "${text}"
            
Instruction: ${instruction}

Provide only the edited text.`
          }],
          max_tokens: 500
        })
      });
      
      if (!response.ok) {
        throw new Error(`OpenRouter error: ${response.status}`);
      }
      
      const result = await response.json();
      const editedText = result.choices[0]?.message?.content || text;
      
      return {
        success: true,
        data: editedText.trim(),
        model: 'claude-3.5-haiku',
        cost: result.usage?.total_tokens * 0.000002 || 0
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        model: 'claude-3.5-haiku'
      };
    }
  }
  
  /**
   * Detect objects in image (placeholder - would use OpenCV or ONNX)
   */
  async detectObjects(image: ImageData): Promise<AIResult> {
    // This would integrate with OpenCV.js or a small ONNX model
    // For now, return placeholder
    return {
      success: false,
      error: 'Object detection not yet implemented. Use manual selection.',
      model: 'none'
    };
  }
  
  /**
   * Style transfer
   */
  async styleTransfer(image: ImageData, prompt: string): Promise<AIResult> {
    // Similar to inpaint but applies style to whole image
    return {
      success: false,
      error: 'Style transfer not yet implemented',
      model: 'none'
    };
  }
  
  // Helper methods
  private imageDataToBase64(imageData: ImageData): string {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d')!;
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png').split(',')[1];
  }
  
  private base64ToImageData(base64: string): ImageData {
    // Implementation would decode base64 to ImageData
    throw new Error('Not implemented');
  }
}

export const aiEngine = new AIEngine();
