// Export types based on PRD specifications

export type ExportFormat = 'png' | 'jpg' | 'mp4';
export type ExportResolution = '720p' | '1080p';

export interface ExportOptions {
  format: ExportFormat;
  resolution: ExportResolution;
  aspectRatio?: '1:1' | '9:16' | '16:9' | 'custom';
  customDimensions?: {
    width: number;
    height: number;
  };
  hasWatermark: boolean;
}

export interface Export {
  id: string;
  userId: string;
  templateId: string;
  fileURL: string;
  format: ExportFormat;
  resolution: string;
  hasWatermark: boolean;
  createdAt: Date;
  expiresAt?: Date; // For temporary links
}

export interface ExportState {
  isExporting: boolean;
  progress: number;
  error: string | null;
  lastExport: Export | null;
}

export interface ShareOptions {
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'email';
  saveToGallery?: boolean;
  copyToClipboard?: boolean;
  generateLink?: boolean;
}
