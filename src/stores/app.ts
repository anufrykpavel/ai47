/**
 * App State - Zustand store
 */
import { create } from 'zustand';
import { fabric } from 'fabric';

export interface DocumentState {
  type: 'pdf' | 'image' | null;
  file: File | null;
  currentPage: number;
  totalPages: number;
}

export interface CanvasState {
  zoom: number;
  showGrid: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export interface AIState {
  status: 'idle' | 'processing' | 'error';
  selectedTool: string | null;
  provider: 'ollama' | 'openrouter' | null;
}

export interface UIState {
  sidebar: 'layers' | 'ai' | 'ocr' | null;
  showToolbar: boolean;
  theme: 'light' | 'dark';
}

interface AppStore {
  // Document
  document: DocumentState;
  setDocument: (doc: Partial<DocumentState>) => void;
  setCurrentPage: (page: number) => void;
  
  // Canvas
  canvas: CanvasState;
  setCanvas: (canvas: Partial<CanvasState>) => void;
  setZoom: (zoom: number) => void;
  toggleGrid: () => void;
  
  // AI
  ai: AIState;
  setAI: (ai: Partial<AIState>) => void;
  selectAITool: (tool: string | null) => void;
  
  // UI
  ui: UIState;
  setUI: (ui: Partial<UIState>) => void;
  toggleSidebar: (panel: 'layers' | 'ai' | 'ocr') => void;
  toggleTheme: () => void;
  
  // Actions
  reset: () => void;
}

const initialState = {
  document: {
    type: null,
    file: null,
    currentPage: 1,
    totalPages: 0
  },
  canvas: {
    zoom: 1,
    showGrid: false,
    canUndo: false,
    canRedo: false
  },
  ai: {
    status: 'idle',
    selectedTool: null,
    provider: null
  },
  ui: {
    sidebar: null,
    showToolbar: true,
    theme: 'light'
  }
};

export const useAppStore = create<AppStore>((set) => ({
  document: initialState.document,
  setDocument: (doc) => set((state) => ({
    document: { ...state.document, ...doc }
  })),
  setCurrentPage: (page) => set((state) => ({
    document: { ...state.document, currentPage: page }
  })),
  
  canvas: initialState.canvas,
  setCanvas: (canvas) => set((state) => ({
    canvas: { ...state.canvas, ...canvas }
  })),
  setZoom: (zoom) => set((state) => ({
    canvas: { ...state.canvas, zoom: Math.max(0.1, Math.min(5, zoom)) }
  })),
  toggleGrid: () => set((state) => ({
    canvas: { ...state.canvas, showGrid: !state.canvas.showGrid }
  })),
  
  ai: initialState.ai,
  setAI: (ai) => set((state) => ({
    ai: { ...state.ai, ...ai }
  })),
  selectAITool: (tool) => set((state) => ({
    ai: { ...state.ai, selectedTool: tool }
  })),
  
  ui: initialState.ui,
  setUI: (ui) => set((state) => ({
    ui: { ...state.ui, ...ui }
  })),
  toggleSidebar: (panel) => set((state) => ({
    ui: { 
      ...state.ui, 
      sidebar: state.ui.sidebar === panel ? null : panel 
    }
  })),
  toggleTheme: () => set((state) => ({
    ui: { 
      ...state.ui, 
      theme: state.ui.theme === 'light' ? 'dark' : 'light' 
    }
  })),
  
  reset: () => set(initialState)
}));
