# AI47 🎨📄

> Universal AI-powered editor for images and documents

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

AI47 — бесплатная альтернатива платным AI-редакторам (Adobe Acrobat AI, Canva Magic Edit, OCRabat).

## Features

- 📄 **PDF**: просмотр, редактирование, OCR
- 🖼️ **Images**: редактор с AI-инструментами
- 🤖 **AI**: smart selection, inpainting, style transfer
- 💰 **Free**: локальные модели + дешёвые API

## Tech Stack

| Component | Library |
|-----------|---------|
| PDF Rendering | PDF.js |
| Canvas Editor | Fabric.js |
| OCR | Tesseract.js |
| Computer Vision | OpenCV.js |
| AI Backend | Ollama / OpenRouter |

## Quick Start

```bash
# Clone
git clone https://github.com/anufrykpavel/ai47.git
cd ai47

# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

## Architecture

```
Input (PDF/Image) → Renderer → Canvas Layers → AI Engine → Export
                         ↓
                    OCR (Tesseract)
                    Object Detection (OpenCV)
                    AI Features (Ollama/OpenRouter)
```

## Roadmap

- [ ] MVP: PDF viewer + basic canvas
- [ ] OCR with Tesseract
- [ ] Smart selection (OpenCV)
- [ ] AI inpainting (Ollama SD)
- [ ] Text editing with AI
- [ ] Export to PDF/PNG/JPG

## License

MIT © anufrykpavel
