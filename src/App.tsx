/**
 * Main App Component - AI47
 * Figma-inspired design with color-coded panels
 */
import React from 'react';
import { useAppStore } from './stores/app';
import { PDFViewer } from './components/viewer/PDFViewer';
import { CanvasEditor } from './components/editor/CanvasEditor';
import { AIPanel } from './components/ai/AIPanel';
import { OCRPanel } from './components/ocr/OCRPanel';
import { FileUploader } from './components/ui/FileUploader';

const App: React.FC = () => {
  const { document, ui, toggleSidebar } = useAppStore();

  const hasDocument = document.type !== null;

  // Determine panel background color
  const getPanelClass = () => {
    switch (ui.sidebar) {
      case 'ai':
        return 'bg-purple-100';
      case 'ocr':
        return 'bg-green-100';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header - Clean monochrome */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold tracking-tight">AI47</span>
          <span className="text-sm text-gray-500">Universal AI Editor</span>
        </div>

        {hasDocument && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 truncate max-w-[300px]">
              {document.file?.name}
            </span>
            
            {/* OCR Button - Mint accent */}
            <button
              onClick={() => toggleSidebar('ocr')}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                ui.sidebar === 'ocr'
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              📄 OCR
            </button>
            
            {/* AI Button - Purple accent */}
            <button
              onClick={() => toggleSidebar('ai')}
              className={`px-4 py-2 text-sm rounded-full transition-all duration-200 ${
                ui.sidebar === 'ai'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
              }`}
            >
              🤖 AI
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area - Warm off-white */}
        <main className="flex-1 bg-gray-50 overflow-hidden">
          {!hasDocument ? (
            <FileUploader />
          ) : document.type === 'pdf' ? (
            <PDFViewer />
          ) : (
            <CanvasEditor />
          )}
        </main>

        {/* Sidebar - Color-coded by function */}
        {ui.sidebar === 'ocr' && (
          <aside className="w-80 border-l border-gray-200 bg-green-50 overflow-hidden shadow-[-4px_0_20px_rgba(0,0,0,0.05)]">
            <OCRPanel />
          </aside>
        )}
        {ui.sidebar === 'ai' && (
          <aside className="w-80 border-l border-gray-200 bg-purple-50 overflow-hidden shadow-[-4px_0_20px_rgba(0,0,0,0.05)]">
            <AIPanel />
          </aside>
        )}
      </div>

      {/* Footer - Minimal */}
      <footer className="h-8 bg-white border-t border-gray-200 flex items-center px-6 justify-between text-xs text-gray-400 flex-shrink-0">
        <div>
          {hasDocument && document.type === 'pdf' && (
            <span>Page {document.currentPage} of {document.totalPages}</span>
          )}
          {hasDocument && document.type === 'image' && (
            <span>Image Editor</span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span>AI47 v0.1.0</span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
