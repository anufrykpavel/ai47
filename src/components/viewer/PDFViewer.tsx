/**
 * PDF Viewer Component
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { useAppStore } from '../../stores/app';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface PDFPage {
  number: number;
  viewport: pdfjs.PageViewport;
}

export const PDFViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdf, setPdf] = useState<pdfjs.PDFDocumentProxy | null>(null);
  const [page, setPage] = useState<pdfjs.PDFPageProxy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);
  
  const { document, setDocument } = useAppStore();
  
  // Load PDF document
  const loadPdf = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      
      setPdf(pdfDoc);
      setDocument({ totalPages: pdfDoc.numPages });
      
      // Load first page
      const firstPage = await pdfDoc.getPage(1);
      setPage(firstPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
    } finally {
      setLoading(false);
    }
  }, [setDocument]);
  
  // Load page when page number changes
  const loadPage = useCallback(async (pageNum: number) => {
    if (!pdf) return;
    
    setLoading(true);
    
    try {
      const newPage = await pdf.getPage(pageNum);
      setPage(newPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  }, [pdf]);
  
  // Initial PDF load
  useEffect(() => {
    if (document.file && document.type === 'pdf') {
      loadPdf(document.file);
    }
    
    return () => {
      pdf?.destroy();
    };
  }, [document.file, document.type, loadPdf, pdf]);
  
  // Render page to canvas
  useEffect(() => {
    if (!page || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const viewport = page.getViewport({ scale });
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    page.render({
      canvasContext: ctx,
      viewport
    });
  }, [page, scale]);
  
  const handlePrevPage = () => {
    if (document.currentPage > 1) {
      const newPage = document.currentPage - 1;
      useAppStore.getState().setCurrentPage(newPage);
      loadPage(newPage);
    }
  };
  
  const handleNextPage = () => {
    if (document.currentPage < document.totalPages) {
      const newPage = document.currentPage + 1;
      useAppStore.getState().setCurrentPage(newPage);
      loadPage(newPage);
    }
  };
  
  const handleZoomIn = () => setScale(s => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.25, 0.5));
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-center">
          <p className="font-semibold">Error loading PDF</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-100">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={document.currentPage <= 1 || loading}
            className="px-3 py-1.5 text-sm bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm font-medium min-w-[100px] text-center">
            Page {document.currentPage} of {document.totalPages || '?'}
          </span>
          <button
            onClick={handleNextPage}
            disabled={document.currentPage >= document.totalPages || loading}
            className="px-3 py-1.5 text-sm bg-gray-100 border rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            Next →
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            −
          </button>
          <span className="text-sm min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            +
          </button>
        </div>
        
        <div className="text-sm text-gray-500">
          {loading ? 'Loading...' : pdf ? 'Ready' : ''}
        </div>
      </div>
      
      {/* Page content */}
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <canvas
            ref={canvasRef}
            className="shadow-lg bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
};
