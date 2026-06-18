# AI47 Architecture

## Overview

AI47 — браузерный редактор PDF/изображений с AI-функциями.

## System Design

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   PDF.js    │  │  Fabric.js   │  │   UI/UX      │       │
│  │  (render)   │  │  (canvas)    │  │  (React)     │       │
│  └──────┬──────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                │                  │               │
│         └────────────────┼──────────────────┘               │
│                          ▼                                  │
│                   ┌──────────────┐                         │
│                   │  App State   │                         │
│                   │   (Zustand)  │                         │
│                   └──────┬───────┘                         │
└──────────────────────────┼──────────────────────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                   AI Core (Browser)                          │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Tesseract   │  │   OpenCV     │  │   Ollama     │       │
│  │   (OCR)     │  │ (detection)  │  │  (local AI)  │       │
│  └─────────────┘  └──────────────┘  └──────────────┘       │
│                                                              │
│  Fallback: OpenRouter (cheap models: GPT-4o-mini, Haiku)   │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
ai47/
├── src/
│   ├── components/      # React components
│   │   ├── viewer/      # PDF/Image viewer
│   │   ├── editor/      # Canvas editor
│   │   ├── ai/          # AI panels
│   │   └── ui/          # UI primitives
│   ├── core/            # Core logic
│   │   ├── pdf.ts       # PDF handling
│   │   ├── canvas.ts    # Fabric.js wrapper
│   │   ├── ocr.ts       # Tesseract integration
│   │   └── ai.ts        # AI engine
│   ├── hooks/           # React hooks
│   ├── stores/          # Zustand stores
│   └── utils/           # Utilities
├── public/              # Static assets
├── docs/                # Documentation
├── tests/               # Test suite
└── package.json
```

## Key Components

### 1. PDF Engine (`src/core/pdf.ts`)

- Render PDF to canvas
- Extract text layer
- Convert to editable format

### 2. Canvas Editor (`src/core/canvas.ts`)

- Fabric.js wrapper
- Layers management
- History (undo/redo)
- Selection tools

### 3. OCR (`src/core/ocr.ts`)

- Tesseract.js integration
- Text recognition
- Bounding box extraction

### 4. AI Engine (`src/core/ai.ts`)

```typescript
interface AIFeatures {
  // Smart selection
  detectObjects(image: ImageData): BoundingBox[];
  
  // Inpainting (fill background)
  inpaint(image: ImageData, mask: Mask): ImageData;
  
  // Style transfer
  applyStyle(image: ImageData, prompt: string): ImageData;
  
  // Text editing
  editText(text: string, instruction: string): string;
}
```

## Data Flow

### Open PDF

```
PDF file → PDF.js → Canvas render → Display
                ↓
            Text layer → OCR (if needed)
```

### AI Edit

```
User selection → Object detection → AI analysis
                      ↓
              Inpainting / Style transfer / Text edit
                      ↓
              Update canvas layer → Render
```

### Export

```
Canvas layers → Merge → PDF/PNG/JPG → Download
```

## State Management

```typescript
interface AppState {
  // Document
  document: {
    type: 'pdf' | 'image';
    file: File;
    pages: Page[];
    currentPage: number;
  };
  
  // Canvas
  canvas: {
    layers: Layer[];
    activeLayer: string | null;
    history: HistoryState[];
    historyIndex: number;
  };
  
  // AI
  ai: {
    status: 'idle' | 'processing';
    selectedTool: AITool | null;
    results: AIResult[];
  };
  
  // UI
  ui: {
    sidebar: 'layers' | 'ai' | 'ocr' | null;
    zoom: number;
    showGrid: boolean;
  };
}
```

## API Design

### Local AI (Ollama)

```typescript
// inpainting
await ai.inpaint({
  image: canvasData,
  mask: selectionMask,
  model: 'sd-inpaint',
  prompt: 'fill with similar texture'
});

// text editing
await ai.editText({
  text: recognizedText,
  instruction: 'make it formal'
});
```

### Remote AI (OpenRouter)

```typescript
// for complex tasks
await ai.generate({
  provider: 'openrouter',
  model: 'anthropic/claude-3.5-haiku',
  prompt: instruction,
  maxCost: 0.001 // safety limit
});
```

## Performance

### Optimization

- Virtual scrolling for large PDFs
- Web Workers for OCR/AI
- Canvas offscreen rendering
- Debounced AI calls

### Memory

- Limit undo history (20 states)
- Compress layers on save
- Clear unused textures

## Security

- No file upload to server
- AI runs locally (Ollama) or via HTTPS API
- WASM sandboxing for Tesseract/OpenCV

## Future Extensions

- [ ] Cloud sync
- [ ] Collaboration
- [ ] Plugin system
- [ ] Mobile app
