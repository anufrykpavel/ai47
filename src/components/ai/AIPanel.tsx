/**
 * AI Panel Component
 * Lilac/Purple color theme for AI functionality
 */
import React, { useState, useCallback } from 'react';
import { aiEngine } from '../../core/ai';
import { useAppStore } from '../../stores/app';

export const AIPanel: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
  
  const { ai, setAI } = useAppStore();

  // Check Ollama availability on mount
  React.useEffect(() => {
    const checkOllama = async () => {
      const available = await aiEngine.isOllamaAvailable();
      setOllamaStatus(available ? 'available' : 'unavailable');
      setAI({ provider: available ? 'ollama' : 'openrouter' });
    };
    checkOllama();
  }, [setAI]);

  const handleTextEdit = useCallback(async () => {
    if (!prompt) return;
    
    setAI({ status: 'processing' });
    
    try {
      const response = await aiEngine.editText(
        'Sample text to edit',
        prompt
      );
      
      if (response.success && typeof response.data === 'string') {
        setResult(response.data);
      } else {
        setResult(`Error: ${response.error}`);
      }
    } catch (err) {
      setResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAI({ status: 'idle' });
    }
  }, [prompt, setAI]);

  const aiTools = [
    {
      id: 'inpaint',
      name: 'Inpaint',
      description: 'Fill selected area with AI',
      icon: '🎨',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: 'style-transfer',
      name: 'Style Transfer',
      description: 'Apply style to image',
      icon: '✨',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: 'text-edit',
      name: 'Text Edit',
      description: 'AI text editing',
      icon: '📝',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: 'object-detect',
      name: 'Detect Objects',
      description: 'Auto-select objects',
      icon: '🔍',
      color: 'bg-purple-100 text-purple-700 border-purple-200'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-purple-50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-purple-200 bg-white/50">
        <h3 className="font-semibold text-gray-800 text-lg">AI Tools</h3>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-gray-500">Provider:</span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              ollamaStatus === 'available'
                ? 'bg-purple-100 text-purple-700'
                : ollamaStatus === 'checking'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {ollamaStatus === 'checking' && 'Checking...'}
            {ollamaStatus === 'available' && 'Ollama (Local)'}
            {ollamaStatus === 'unavailable' && 'OpenRouter (Cloud)'}
          </span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-2 gap-3">
          {aiTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setAI({ selectedTool: tool.id })}
              className={`p-4 text-left border rounded-2xl transition-all duration-200 ${
                ai.selectedTool === tool.id
                  ? 'bg-purple-600 border-purple-600 text-white shadow-lg'
                  : `${tool.color} hover:shadow-md`
              }`}
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className={`font-medium text-sm ${
                ai.selectedTool === tool.id ? 'text-white' : 'text-gray-800'
              }`}>
                {tool.name}
              </div>
              <div className={`text-xs mt-1 ${
                ai.selectedTool === tool.id ? 'text-purple-100' : 'text-gray-500'
              }`}>
                {tool.description}
              </div>
            </button>
          ))}
        </div>

        {/* Prompt Input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Make this text more formal, Remove the logo, etc."
            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm resize-none bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            rows={3}
          />
          
          <button
            onClick={handleTextEdit}
            disabled={!prompt || ai.status === 'processing'}
            className="mt-3 w-full px-4 py-2.5 bg-purple-600 text-white rounded-full text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {ai.status === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </span>
            ) : (
              'Run AI'
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 p-4 bg-white border border-purple-200 rounded-2xl shadow-sm">
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Result:</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-purple-200 bg-white/50 text-xs text-gray-500">
        <p>AI47 uses local Ollama when available. Fallback to OpenRouter.</p>
      </div>
    </div>
  );
};
