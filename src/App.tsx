/**
 * Main App Component
 */
import React from 'react';
import { useAppStore } from './stores/app';
import { PDFViewer } from './components/viewer/PDFViewer';
import { CanvasEditor } from './components/editor/CanvasEditor';
import { AIPanel } from './components/ai/AIPanel';
import { FileUploader } from './components/ui/FileUploader';
import { OCRPanel } from './components/ocr/OCRPanel';

const App: React.FC = () => {
  const { document, ui, toggleSidebar } = useAppStore();

  const hasDocument = document.type !== null;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="h-14 bg-white border-b flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">AI47</span>
          <span className="text-sm text-gray-500">Universal AI Editor</span>
        </div>

        {hasDocument && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {document.file?.name}
            </span>
            <button
              onClick={() => toggleSidebar('ocr')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                ui.sidebar === 'ocr'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              📄 OCR
            </button>
            <button
              onClick={() => toggleSidebar('ai')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                ui.sidebar === 'ai'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              🤖 AI
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor Area */}
        <main className="flex-1 overflow-hidden">
          {!hasDocument ? (
            <FileUploader />
          ) : document.type === 'pdf' ? (
            <PDFViewer />
          ) : (
            <CanvasEditor />
          )}
        </main>

        {/* Sidebar */}
        {ui.sidebar === 'ocr' && (
          <aside className="w-80 border-l bg-white overflow-hidden">
            <OCRPanel />
          </aside>
        )}
        {ui.sidebar === 'ai' && (
          <aside className="w-80 border-l bg-white overflow-hidden">
            <AIPanel />
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="h-8 bg-gray-50 border-t flex items-center px-4 justify-between text-xs text-gray-500">
        <div>
          {hasDocument && document.type === 'pdf' && (
            <span>PDF • Page {document.currentPage}/{document.totalPages}</span>
          )}
          {hasDocument && document.type === 'image' && (
            <span>Image Editor</span>
          )}
        </div>
        <div>
          AI47 v0.1.0 • MIT License
        </div>
      </footer>
    </div>
  );
};

export default App;
