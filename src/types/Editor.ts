// Editor types based on PRD specifications

import { Element, Template, Position } from './Template';

export interface EditorElement extends Element {
  isSelected?: boolean;
  isEditing?: boolean;
  zIndex?: number;
}

export interface EditorState {
  template: Template | null;
  elements: EditorElement[];
  selectedElementId: string | null;
  history: EditorState[];
  historyIndex: number;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ImagePickerOptions {
  mediaType: 'photo' | 'video' | 'mixed';
  quality: number;
  maxWidth?: number;
  maxHeight?: number;
  allowsEditing?: boolean;
}

export interface TextEditorOptions {
  text?: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  shadow?: boolean;
}

export interface FilterOptions {
  brightness?: number;
  contrast?: number;
  saturation?: number;
  grayscale?: boolean;
  sepia?: boolean;
  vintage?: boolean;
  vibrant?: boolean;
}

export interface GestureState {
  scale: number;
  rotation: number;
  translation: Position;
}
