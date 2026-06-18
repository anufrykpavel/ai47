/**
 * PDF Viewer Component
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { pdfEngine, PDFPage } from '../../core/pdf';
import { useAppStore } from '../../stores/app';

export const PDFViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<PDFPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { document, setDocument, setCanvas } = useAppStore();
  
  const loadPage = useCallback(async (pageNum: number) => {
    if (!document.file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await pdfEngine.load(document.file);
      const totalPages = pdfEngine.getPageCount();
      setDocument({ totalPages });
      
      const renderedPage = await pdfEngine.renderPage(pageNum, 1.5);
      setPage(renderedPage);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PDF');
    } finally {
      setLoading(false);
    }
  }, [document.file, setDocument]);
  
  useEffect(() => {
    if (document.file && document.currentPage) {
      loadPage(document.currentPage);
    }
  }, [document.file, document.currentPage, loadPage]);
  
  useEffect(() => {
    if (containerRef.current && page?.canvas) {
      // Clear previous content
      containerRef.current.innerHTML = '';
      
      // Add canvas
      page.canvas.style.maxWidth = '100%';
      page.canvas.style.height = 'auto';
      containerRef.current.appendChild(page.canvas);
    }
  }, [page]);
  
  const handlePrevPage = () => {
    if (document.currentPage > 1) {
      useAppStore.getState().setCurrentPage(document.currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (document.currentPage < document.totalPages) {
      useAppStore.getState().setCurrentPage(document.currentPage + 1);
    }
  };
  
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
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={document.currentPage <= 1}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            ← Prev
          </button>
          <span className="text-sm">
            Page {document.currentPage} of {document.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={document.currentPage >= document.totalPages}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          {loading && 'Loading...'}
        </div>
      </div>
      
      {/* Page content */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div
          ref={containerRef}
          className="flex justify-center min-h-full"
        >
          {!page && !loading && (
            <div className="text-gray-400">No PDF loaded</div>
          )}
        </div>
      </div>
    </div>
  );
};
