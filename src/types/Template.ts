// Template types based on PRD specifications

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Background {
  type: 'image' | 'color' | 'gradient';
  url?: string;
  color?: string;
}

export interface Element {
  id: string;
  type: 'image' | 'text' | 'shape' | 'sticker';
  position: Position;
  size?: Size; // Optional - calculated automatically for text elements if missing
  placeholder?: boolean;
  locked?: boolean;
  shape?: 'circle' | 'square' | 'rectangle';
  border?: {
    width: number;
    color: string;
  };
  // Text-specific properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  alignment?: 'left' | 'center' | 'right';
  editable?: boolean;
  maxLength?: number;
  placeholderText?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  shadow?: boolean;
  // Image-specific properties
  url?: string;
  // Common properties
  opacity?: number;
  rotation?: number;
}

export interface TemplateMetadata {
  createdAt: string;
  updatedAt?: string;
  popularity: number;
  downloads: number;
  language: string;
}

export interface Template {
  id: string;
  version: string;
  type: 'image' | 'video';
  category: string;
  subcategory: string;
  tags: string[];
  isPremium: boolean;
  aspectRatio: string;
  dimensions: Size;
  background: Background;
  elements: Element[];
  metadata: TemplateMetadata;
}

export interface TemplateFilters {
  category?: string;
  subcategory?: string;
  isPremium?: boolean;
  tags?: string[];
  search?: string;
  sortBy?: 'popular' | 'newest' | 'trending';
}

export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  templateCount: number;
  subcategories: string[];
}
