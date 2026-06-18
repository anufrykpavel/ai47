/**
 * OCR Panel Component
 */
import React, { useState, useCallback } from 'react';
import { ocrEngine, OCRResult } from '../../core/ocr';
import { useAppStore } from '../../stores/app';

export const OCRPanel: React.FC = () => {
  const [language, setLanguage] = useState('eng');
  const [results, setResults] = useState<OCRResult[]>([]);
  const [fullText, setFullText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { document } = useAppStore();

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'rus', name: 'Russian' },
    { code: 'deu', name: 'German' },
    { code: 'fra', name: 'French' },
    { code: 'spa', name: 'Spanish' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'chi_tra', name: 'Chinese (Traditional)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' },
    { code: 'ara', name: 'Arabic' }
  ];

  const handleOCR = useCallback(async () => {
    if (!document.file) return;

    setStatus('loading');
    setError(null);
    setProgress(0);

    try {
      // Initialize OCR
      await ocrEngine.init(language);
      setProgress(20);

      // Create image from file
      const imageUrl = URL.createObjectURL(document.file);
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      setProgress(50);

      // Draw to canvas to get ImageData
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setProgress(70);

      // Run OCR
      const [words, text] = await Promise.all([
        ocrEngine.recognize(imageData),
        ocrEngine.recognizeTextOnly(imageData)
      ]);

      setResults(words);
      setFullText(text);
      setStatus('success');

      // Cleanup
      URL.revokeObjectURL(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR failed');
      setStatus('error');
    } finally {
      setProgress(100);
    }
  }, [document.file, language]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(fullText);
  }, [fullText]);

  const downloadText = useCallback(() => {
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ocr-result.txt';
    link.click();
    URL.revokeObjectURL(url);
  }, [fullText]);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white">
        <h3 className="font-semibold text-gray-800">OCR</h3>
        <p className="text-sm text-gray-500 mt-1">
          Extract text from images and PDFs
        </p>
      </div>

      {/* Language selector */}
      <div className="px-4 py-3 border-b bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg text-sm"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-b bg-white">
        <button
          onClick={handleOCR}
          disabled={status === 'loading' || !document.file}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing... {progress}%
            </span>
          ) : (
            'Run OCR'
          )}
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-auto p-4">
        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {status === 'success' && (
          <>
            {/* Stats */}
            <div className="mb-4 grid grid-cols-2 gap-2">
              <div className="p-3 bg-white border rounded-lg">
                <div className="text-2xl font-bold text-blue-500">
                  {results.length}
                </div>
                <div className="text-xs text-gray-500">Words detected</div>
              </div>
              <div className="p-3 bg-white border rounded-lg">
                <div className="text-2xl font-bold text-green-500">
                  {Math.round(
                    results.reduce((acc, r) => acc + r.confidence, 0) / results.length
                  )}%
                </div>
                <div className="text-xs text-gray-500">Avg confidence</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                Copy
              </button>
              <button
                onClick={downloadText}
                className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                Download
              </button>
            </div>

            {/* Full text */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Full Text
              </h4>
              <div className="p-3 bg-white border rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {fullText || 'No text detected'}
                </pre>
              </div>
            </div>

            {/* Words with bboxes */}
            {results.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Detected Words
                </h4>
                <div className="space-y-2">
                  {results.slice(0, 20).map((word, idx) => (
                    <div
                      key={idx}
                      className="p-2 bg-white border rounded-lg flex justify-between items-center"
                    >
                      <span className="text-sm font-medium">{word.text}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          word.confidence > 80
                            ? 'bg-green-100 text-green-700'
                            : word.confidence > 50
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {Math.round(word.confidence)}%
                      </span>
                    </div>
                  ))}
                  {results.length > 20 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      ...and {results.length - 20} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-white text-xs text-gray-500">
        <p>Powered by Tesseract.js</p>
        <p className="mt-1">Runs locally in your browser</p>
      </div>
    </div>
  );
};
