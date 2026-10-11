import {
  FullInscriptionRecord,
  InscriptionMetadata,
  EnhancementConfig,
  BrahmiOcrResult,
  TransliterationResult,
  TranslationResult,
  CharacterSegment,
} from '../types/inscription';

export interface InscriptionApiService {
  // Core record operations
  getInscriptions(): Promise<InscriptionMetadata[]>;
  getInscriptionById(id: string): Promise<FullInscriptionRecord>;
  
  // Pipeline Step 1 & 2: Upload & Image Enhancement
  uploadInscriptionImage(file: File, metadata: Partial<InscriptionMetadata>): Promise<FullInscriptionRecord>;
  updateEnhancementConfig(id: string, config: EnhancementConfig): Promise<EnhancementConfig>;
  
  // Pipeline Step 3 & 4: Character Segmentation & Brahmi OCR
  runSegmentation(id: string): Promise<CharacterSegment[]>;
  runOcrInference(id: string): Promise<BrahmiOcrResult>;
  updateGlyphCorrection(id: string, glyphId: string, correctedChar: string, notes?: string): Promise<CharacterSegment>;
  
  // Pipeline Step 5 & 6: Transliteration & Translation
  generateTransliteration(id: string): Promise<TransliterationResult>;
  generateTranslation(id: string): Promise<TranslationResult>;
  
  // Verification & Export
  submitVerification(id: string, verifiedBy: string, notes: string): Promise<boolean>;
  exportRecord(id: string, format: 'json' | 'tei-xml' | 'pdf-report' | 'markdown'): Promise<{ downloadUrl: string; content: string }>;
}
