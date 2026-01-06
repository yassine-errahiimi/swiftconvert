
export enum ToolType {
  IMAGE_TO_PDF = 'image-to-pdf',
  WORD_TO_PDF = 'word-to-pdf',
  PDF_TO_IMAGE = 'pdf-to-image',
  PDF_TO_WORD = 'pdf-to-word'
}

export interface FileItem {
  id: string;
  file: File;
  previewUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  resultUrl?: string;
  resultName?: string;
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  allowedTypes: string[];
}
