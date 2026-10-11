export type ScriptType =
  | 'Brahmi'
  | 'Ashokan Brahmi'
  | 'Gupta Brahmi'
  | 'Kushan Brahmi'
  | 'Tamil Brahmi'
  | 'Kalinga Brahmi'
  | 'Late Mauryan / Shunga Brahmi';

export type InscriptionCategory = 'Royal Edict' | 'Donative Inscription' | 'Pillar Inscription' | 'Rock Edict' | 'Copper Plate';

export type ConfidenceLevel = 'high' | 'doubtful' | 'conjectural';

export interface CharacterSegment {
  id: string;
  x: number; // percentage bounding box (0-100)
  y: number;
  width: number;
  height: number;
  confidence: number;
  brahmiChar: string;
  unicodeHex: string;
  phoneticIAST: string;
  devanagariEquiv: string;
  category: 'vowel' | 'consonant' | 'matra' | 'numeral' | 'modifier';
  alternatives: Array<{
    char: string;
    unicode: string;
    iast: string;
    confidence: number;
  }>;
  isCorrected?: boolean;
  correctedChar?: string;
  notes?: string;
}

export interface EnhancementConfig {
  brightness: number; // -100 to 100
  contrast: number; // 0 to 200
  sharpness: number; // 0 to 100
  binarizationThreshold: number; // 0 to 255
  invertColors: boolean;
  denoiseLevel: 'off' | 'low' | 'medium' | 'high';
  applyClahe: boolean; // Contrast Limited Adaptive Histogram Equalization
  colorFilter: 'grayscale' | 'multispectral-red' | 'multispectral-uv' | 'rubbing-mode';
}

export interface InscriptionMetadata {
  id: string;
  title: string;
  provenance: string;
  siteLocation: string;
  currentLocation: string;
  period: string;
  dynasty: string;
  estimatedCentury: string;
  material: string;
  dimensions: string;
  language: string;
  script: ScriptType;
  category: InscriptionCategory;
  ciiVolumeRef?: string;
  corpusCatalogId: string;
  uploaderName: string;
  uploadTimestamp: string;
  thumbnailUrl: string;
  imageUrl: string;
}

export interface BrahmiOcrResult {
  inscriptionId: string;
  totalGlyphsDetected: number;
  averageConfidence: number;
  segments: CharacterSegment[];
  rawBrahmiLine: string;
  lineBreakPositions: number[];
}

export interface TransliterationResult {
  rawBrahmi: string;
  iastText: string;
  devanagariText: string;
  phoneticEnglish: string;
  wordSegmentation: Array<{
    brahmiWord: string;
    iastWord: string;
    devanagariWord: string;
    meaningSummary: string;
  }>;
}

export interface TranslationResult {
  hindiTranslation: string;
  englishTranslation: string;
  criticalApparatusNotes: string[];
  historicalContext: {
    reignOf: string;
    summary: string;
    keyThemes: string[];
    geopoliticalSignificance: string;
  };
}

export interface HumanVerificationStatus {
  isVerified: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  verificationNotes?: string;
  correctionsCount: number;
  confidenceOverride?: number;
}

export interface FullInscriptionRecord {
  metadata: InscriptionMetadata;
  enhancement: EnhancementConfig;
  ocr: BrahmiOcrResult;
  transliteration: TransliterationResult;
  translation: TranslationResult;
  verification: HumanVerificationStatus;
}

export interface PipelineStep {
  id: number;
  key: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  path: string;
}
