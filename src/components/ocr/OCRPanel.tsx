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
    { code: 'afr', name: 'Afrikaans' },
    { code: 'amh', name: 'Amharic' },
    { code: 'ara', name: 'Arabic' },
    { code: 'asm', name: 'Assamese' },
    { code: 'aze', name: 'Azerbaijani' },
    { code: 'aze_cyrl', name: 'Azerbaijani (Cyrillic)' },
    { code: 'bel', name: 'Belarusian' },
    { code: 'ben', name: 'Bengali' },
    { code: 'bod', name: 'Tibetan' },
    { code: 'bos', name: 'Bosnian' },
    { code: 'bre', name: 'Breton' },
    { code: 'bul', name: 'Bulgarian' },
    { code: 'cat', name: 'Catalan' },
    { code: 'ceb', name: 'Cebuano' },
    { code: 'ces', name: 'Czech' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'chi_tra', name: 'Chinese (Traditional)' },
    { code: 'chr', name: 'Cherokee' },
    { code: 'cos', name: 'Corsican' },
    { code: 'cym', name: 'Welsh' },
    { code: 'dan', name: 'Danish' },
    { code: 'deu', name: 'German' },
    { code: 'deu_frak', name: 'German (Fraktur)' },
    { code: 'dzo', name: 'Dzongkha' },
    { code: 'ell', name: 'Greek' },
    { code: 'eng', name: 'English' },
    { code: 'enm', name: 'English (Middle)' },
    { code: 'epo', name: 'Esperanto' },
    { code: 'equ', name: 'Math/Equations' },
    { code: 'est', name: 'Estonian' },
    { code: 'eus', name: 'Basque' },
    { code: 'fao', name: 'Faroese' },
    { code: 'fas', name: 'Persian' },
    { code: 'fil', name: 'Filipino' },
    { code: 'fin', name: 'Finnish' },
    { code: 'fra', name: 'French' },
    { code: 'frk', name: 'Frankish' },
    { code: 'frm', name: 'French (Middle)' },
    { code: 'fry', name: 'Frisian' },
    { code: 'gla', name: 'Scottish Gaelic' },
    { code: 'gle', name: 'Irish' },
    { code: 'glg', name: 'Galician' },
    { code: 'grc', name: 'Greek (Ancient)' },
    { code: 'guj', name: 'Gujarati' },
    { code: 'hat', name: 'Haitian' },
    { code: 'heb', name: 'Hebrew' },
    { code: 'hin', name: 'Hindi' },
    { code: 'hrv', name: 'Croatian' },
    { code: 'hun', name: 'Hungarian' },
    { code: 'hye', name: 'Armenian' },
    { code: 'iku', name: 'Inuktitut' },
    { code: 'ind', name: 'Indonesian' },
    { code: 'isl', name: 'Icelandic' },
    { code: 'ita', name: 'Italian' },
    { code: 'ita_old', name: 'Italian (Old)' },
    { code: 'jav', name: 'Javanese' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'jpn_vert', name: 'Japanese (Vertical)' },
    { code: 'kan', name: 'Kannada' },
    { code: 'kat', name: 'Georgian' },
    { code: 'kat_old', name: 'Georgian (Old)' },
    { code: 'kaz', name: 'Kazakh' },
    { code: 'khm', name: 'Khmer' },
    { code: 'kir', name: 'Kyrgyz' },
    { code: 'kmr', name: 'Kurdish (Kurmanji)' },
    { code: 'kor', name: 'Korean' },
    { code: 'kor_vert', name: 'Korean (Vertical)' },
    { code: 'lao', name: 'Lao' },
    { code: 'lat', name: 'Latin' },
    { code: 'lav', name: 'Latvian' },
    { code: 'lit', name: 'Lithuanian' },
    { code: 'ltz', name: 'Luxembourgish' },
    { code: 'mal', name: 'Malayalam' },
    { code: 'mar', name: 'Marathi' },
    { code: 'mkd', name: 'Macedonian' },
    { code: 'mlt', name: 'Maltese' },
    { code: 'mon', name: 'Mongolian' },
    { code: 'mri', name: 'Maori' },
    { code: 'msa', name: 'Malay' },
    { code: 'mya', name: 'Burmese' },
    { code: 'nep', name: 'Nepali' },
    { code: 'nld', name: 'Dutch' },
    { code: 'nor', name: 'Norwegian' },
    { code: 'oci', name: 'Occitan' },
    { code: 'ori', name: 'Oriya' },
    { code: 'osd', name: 'Orientation and Script Detection' },
    { code: 'pan', name: 'Punjabi' },
    { code: 'pol', name: 'Polish' },
    { code: 'por', name: 'Portuguese' },
    { code: 'pus', name: 'Pashto' },
    { code: 'que', name: 'Quechua' },
    { code: 'ron', name: 'Romanian' },
    { code: 'rus', name: 'Russian' },
    { code: 'san', name: 'Sanskrit' },
    { code: 'sin', name: 'Sinhala' },
    { code: 'slk', name: 'Slovak' },
    { code: 'slk_frak', name: 'Slovak (Fraktur)' },
    { code: 'slv', name: 'Slovenian' },
    { code: 'snd', name: 'Sindhi' },
    { code: 'spa', name: 'Spanish' },
    { code: 'spa_old', name: 'Spanish (Old)' },
    { code: 'sqi', name: 'Albanian' },
    { code: 'srp', name: 'Serbian' },
    { code: 'srp_latn', name: 'Serbian (Latin)' },
    { code: 'sun', name: 'Sundanese' },
    { code: 'swa', name: 'Swahili' },
    { code: 'swe', name: 'Swedish' },
    { code: 'syr', name: 'Syriac' },
    { code: 'tam', name: 'Tamil' },
    { code: 'tat', name: 'Tatar' },
    { code: 'tel', name: 'Telugu' },
    { code: 'tgk', name: 'Tajik' },
    { code: 'tha', name: 'Thai' },
    { code: 'tir', name: 'Tigrinya' },
    { code: 'ton', name: 'Tonga' },
    { code: 'tur', name: 'Turkish' },
    { code: 'uig', name: 'Uyghur' },
    { code: 'ukr', name: 'Ukrainian' },
    { code: 'urd', name: 'Urdu' },
    { code: 'uzb', name: 'Uzbek' },
    { code: 'uzb_cyrl', name: 'Uzbek (Cyrillic)' },
    { code: 'vie', name: 'Vietnamese' },
    { code: 'yid', name: 'Yiddish' }
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
