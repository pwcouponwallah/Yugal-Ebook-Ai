
export interface EbookConfig {
  topic: string;
  authorName: string;
  targetPages: number;
  tone: string;
  niche: string;
}

export interface ChapterOutline {
  title: string;
  summary: string;
  subheadings: string[];
}

export interface EbookOutline {
  title: string;
  introduction: string;
  chapters: ChapterOutline[];
  conclusion: string;
}

export interface ChapterContent {
  title: string;
  content: string;
}

export interface FullEbook {
  config: EbookConfig;
  outline: EbookOutline;
  chapters: ChapterContent[];
}

export enum AppStep {
  CONFIG = 'config',
  OUTLINING = 'outlining',
  GENERATING = 'generating',
  PREVIEW = 'preview'
}
