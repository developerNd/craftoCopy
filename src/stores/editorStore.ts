import { create } from 'zustand';
import { EditorState, EditorElement, Template, FilterOptions, TextEditorOptions } from '../types';

interface EditorStore extends EditorState {
  // Actions
  loadTemplate: (template: Template) => void;
  updateElement: (elementId: string, updates: Partial<EditorElement>) => void;
  addElement: (element: EditorElement) => void;
  removeElement: (elementId: string) => void;
  selectElement: (elementId: string | null) => void;
  duplicateElement: (elementId: string) => void;
  
  // History management
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  
  // Element manipulation
  moveElement: (elementId: string, position: { x: number; y: number }) => void;
  resizeElement: (elementId: string, size: { width: number; height: number }) => void;
  rotateElement: (elementId: string, rotation: number) => void;
  setElementOpacity: (elementId: string, opacity: number) => void;
  bringToFront: (elementId: string) => void;
  sendToBack: (elementId: string) => void;
  
  // Text editing
  updateTextElement: (elementId: string, options: TextEditorOptions) => void;
  
  // Image editing
  replaceImage: (elementId: string, imageUrl: string) => void;
  applyFilter: (elementId: string, filter: FilterOptions) => void;
  
  // State management
  setDirty: (isDirty: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const editorStore = create<EditorStore>((set, get) => ({
  template: null,
  elements: [],
  selectedElementId: null,
  history: [],
  historyIndex: -1,
  isDirty: false,
  isLoading: false,
  error: null,

  loadTemplate: (template: Template) => {
    const elements: EditorElement[] = template.elements.map((element) => {
      // Ensure all elements have a size property
      let elementSize = element.size;
      if (!elementSize) {
        // For text elements without size, calculate based on content
        if (element.type === 'text') {
          const text = element.text || element.placeholderText || '';
          const fontSize = element.fontSize || 16;
          // Estimate: roughly 0.6 * fontSize per character, minimum width 200px
          const estimatedWidth = Math.max(text.length * fontSize * 0.6, 200);
          const estimatedHeight = fontSize * 1.5; // Line height
          elementSize = { width: estimatedWidth, height: estimatedHeight };
        } else {
          // Default size for other elements
          elementSize = { width: 100, height: 100 };
        }
      }

      return {
        ...element,
        size: elementSize,
        isSelected: false,
        isEditing: false,
        zIndex: 0,
      };
    });

    set({
      template,
      elements,
      selectedElementId: null,
      history: [{ template, elements, selectedElementId: null }],
      historyIndex: 0,
      isDirty: false,
      error: null,
    });
  },

  updateElement: (elementId: string, updates: Partial<EditorElement>) => {
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === elementId ? { ...element, ...updates } : element
      ),
      isDirty: true,
    }));
  },

  addElement: (element: EditorElement) => {
    set((state) => ({
      elements: [...state.elements, element],
      isDirty: true,
    }));
  },

  removeElement: (elementId: string) => {
    set((state) => ({
      elements: state.elements.filter((element) => element.id !== elementId),
      selectedElementId: state.selectedElementId === elementId ? null : state.selectedElementId,
      isDirty: true,
    }));
  },

  selectElement: (elementId: string | null) => {
    set((state) => ({
      selectedElementId: elementId,
      elements: state.elements.map((element) => ({
        ...element,
        isSelected: element.id === elementId,
      })),
    }));
  },

  duplicateElement: (elementId: string) => {
    const state = get();
    const element = state.elements.find((el) => el.id === elementId);
    if (element) {
      const duplicatedElement: EditorElement = {
        ...element,
        id: `${elementId}_copy_${Date.now()}`,
        position: {
          x: element.position.x + 20,
          y: element.position.y + 20,
        },
        isSelected: false,
        isEditing: false,
      };
      
      set((currentState) => ({
        elements: [...currentState.elements, duplicatedElement],
        isDirty: true,
      }));
    }
  },

  saveToHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({
      template: state.template,
      elements: state.elements,
      selectedElementId: state.selectedElementId,
    });
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const previousState = state.history[state.historyIndex - 1];
      set({
        template: previousState.template,
        elements: previousState.elements,
        selectedElementId: previousState.selectedElementId,
        historyIndex: state.historyIndex - 1,
        isDirty: true,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      set({
        template: nextState.template,
        elements: nextState.elements,
        selectedElementId: nextState.selectedElementId,
        historyIndex: state.historyIndex + 1,
        isDirty: true,
      });
    }
  },

  canUndo: () => {
    const state = get();
    return state.historyIndex > 0;
  },

  canRedo: () => {
    const state = get();
    return state.historyIndex < state.history.length - 1;
  },

  moveElement: (elementId: string, position: { x: number; y: number }) => {
    get().updateElement(elementId, { position });
  },

  resizeElement: (elementId: string, size: { width: number; height: number }) => {
    get().updateElement(elementId, { size });
  },

  rotateElement: (elementId: string, rotation: number) => {
    get().updateElement(elementId, { rotation });
  },

  setElementOpacity: (elementId: string, opacity: number) => {
    get().updateElement(elementId, { opacity });
  },

  bringToFront: (elementId: string) => {
    const state = get();
    const maxZIndex = Math.max(...state.elements.map((el) => el.zIndex || 0));
    get().updateElement(elementId, { zIndex: maxZIndex + 1 });
  },

  sendToBack: (elementId: string) => {
    const state = get();
    const minZIndex = Math.min(...state.elements.map((el) => el.zIndex || 0));
    get().updateElement(elementId, { zIndex: minZIndex - 1 });
  },

  updateTextElement: (elementId: string, options: TextEditorOptions) => {
    get().updateElement(elementId, {
      text: options.text,
      fontSize: options.fontSize,
      fontFamily: options.fontFamily,
      color: options.color,
      alignment: options.alignment,
      bold: options.bold,
      italic: options.italic,
      underline: options.underline,
      shadow: options.shadow,
    });
  },

  replaceImage: (elementId: string, imageUrl: string) => {
    set((state) => {
      const element = state.elements.find((el) => el.id === elementId);
      if (!element) {
        console.error('[EditorStore] Element not found for replaceImage:', elementId);
        return state;
      }
      
      return {
        ...state,
        elements: state.elements.map((el) =>
          el.id === elementId ? { ...el, url: imageUrl, placeholder: false } : el
        ),
        isDirty: true,
      };
    });
  },

  applyFilter: (elementId: string, filter: FilterOptions) => {
    // TODO: Implement filter application logic
    console.log('Applying filter:', filter, 'to element:', elementId);
  },

  setDirty: (isDirty: boolean) => set({ isDirty }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),

  reset: () => set({
    template: null,
    elements: [],
    selectedElementId: null,
    history: [],
    historyIndex: -1,
    isDirty: false,
    isLoading: false,
    error: null,
  }),
}));

// Export the hook
export const useEditorStore = editorStore;
