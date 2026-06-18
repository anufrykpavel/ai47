/**
 * AI Panel Component
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
      icon: '🎨'
    },
    {
      id: 'style-transfer',
      name: 'Style Transfer',
      description: 'Apply style to image',
      icon: '✨'
    },
    {
      id: 'text-edit',
      name: 'Text Edit',
      description: 'AI text editing',
      icon: '📝'
    },
    {
      id: 'object-detect',
      name: 'Detect Objects',
      description: 'Auto-select objects',
      icon: '🔍'
    }
  ];
  
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white">
        <h3 className="font-semibold text-gray-800">AI Tools</h3>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <span className="text-gray-500">Provider:</span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium ${
              ollamaStatus === 'available'
                ? 'bg-green-100 text-green-700'
                : ollamaStatus === 'checking'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {ollamaStatus === 'checking' && 'Checking...'}
            {ollamaStatus === 'available' && 'Ollama (Local)'}
            {ollamaStatus === 'unavailable' && 'OpenRouter (Cloud)'}
          </span>
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {aiTools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setAI({ selectedTool: tool.id })}
              className={`p-4 text-left border rounded-lg transition-colors ${
                ai.selectedTool === tool.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{tool.icon}</div>
              <div className="font-medium text-sm text-gray-800">{tool.name}</div>
              <div className="text-xs text-gray-500 mt-1">{tool.description}</div>
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
            className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
            rows={3}
          />
          
          <button
            onClick={handleTextEdit}
            disabled={!prompt || ai.status === 'processing'}
            className="mt-2 w-full px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <div className="text-xs font-medium text-gray-500 mb-1">Result:</div>
            <div className="text-sm text-gray-800 whitespace-pre-wrap">{result}</div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-3 border-t bg-white text-xs text-gray-500">
        <p>AI47 uses local Ollama when available.</p>
        <p className="mt-1">Fallback to OpenRouter for complex tasks.</p>
      </div>
    </div>
  );
};
