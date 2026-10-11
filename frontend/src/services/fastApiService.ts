import { InscriptionApiService } from './apiInterface';
import { mockApiService } from './mockApi';
import {
  FullInscriptionRecord,
  InscriptionMetadata,
  EnhancementConfig,
  BrahmiOcrResult,
  TransliterationResult,
  TranslationResult,
  CharacterSegment,
} from '../types/inscription';

// Dynamic API Base URL from Environment Variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class FastApiInscriptionService implements InscriptionApiService {
  async getInscriptions(): Promise<InscriptionMetadata[]> {
    return mockApiService.getInscriptions();
  }

  async getInscriptionById(id: string): Promise<FullInscriptionRecord> {
    return mockApiService.getInscriptionById(id);
  }

  async uploadInscriptionImage(file: File, metadataInput: Partial<InscriptionMetadata>): Promise<FullInscriptionRecord> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let userMessage = 'Image analysis failed on backend server.';
        if (response.status === 400) {
          userMessage = 'Invalid image request. Please upload a supported image file (JPG, PNG, WEBP).';
        } else if (response.status === 422) {
          userMessage = 'The uploaded image could not be processed by OpenCV. Please ensure the image is uncorrupted.';
        } else if (response.status === 500) {
          userMessage = 'An internal engine error occurred while running ML inference. Please try again.';
        }
        throw new Error(userMessage);
      }

      const data = await response.json();
      const previewUrl = URL.createObjectURL(file);
      const newId = `ins-fastapi-${Date.now()}`;

      const segments: CharacterSegment[] = (data.characters || []).map((c: any) => ({
        id: `g-${c.index}`,
        x: c.bounding_box.x,
        y: c.bounding_box.y,
        width: c.bounding_box.width,
        height: c.bounding_box.height,
        confidence: c.confidence * 100,
        brahmiChar: c.prediction,
        unicodeHex: c.unicode_hex,
        phoneticIAST: c.iast,
        devanagariEquiv: c.devanagari,
        category: c.category || 'consonant',
        alternatives: (c.alternatives || []).map((a: any) => ({
          char: a.prediction,
          unicode: 'U+11000',
          iast: a.iast,
          confidence: Number((a.confidence * 100).toFixed(1)),
        })),
      }));

      const record: FullInscriptionRecord = {
        metadata: {
          id: newId,
          title: metadataInput.title || file.name.replace(/\.[^/.]+$/, ''),
          provenance: 'FastAPI OpenCV & Keras Neural Inference Result',
          siteLocation: 'Scanned Inscription Capture',
          currentLocation: 'User Digital Session',
          period: 'Ashokan / Post-Mauryan',
          dynasty: 'Mauryan Dynasty',
          estimatedCentury: 'c. 3rd–1st Century BCE',
          material: 'Stone Inscription Face',
          dimensions: 'Variable',
          language: 'Prakrit',
          script: 'Ashokan Brahmi',
          category: 'Rock Edict',
          corpusCatalogId: `BR-API-${Math.floor(100 + Math.random() * 900)}`,
          uploaderName: 'FastAPI Research Client',
          uploadTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          thumbnailUrl: previewUrl,
          imageUrl: previewUrl,
        },
        enhancement: {
          brightness: 0,
          contrast: 100,
          sharpness: 20,
          binarizationThreshold: 128,
          invertColors: false,
          denoiseLevel: 'low',
          applyClahe: true,
          colorFilter: 'rubbing-mode',
        },
        ocr: {
          inscriptionId: newId,
          totalGlyphsDetected: segments.length,
          averageConfidence: (data.average_confidence || 0.91) * 100,
          segments,
          rawBrahmiLine: data.transliteration?.raw_brahmi || '𑀤𑀾𑀯𑀸𑀦𑀸𑀁𑀧𑀺𑀬',
          lineBreakPositions: [],
        },
        transliteration: {
          rawBrahmi: data.transliteration?.raw_brahmi || '',
          iastText: data.transliteration?.iast || '',
          devanagariText: data.transliteration?.devanagari || '',
          phoneticEnglish: data.transliteration?.iast || '',
          wordSegmentation: [
            {
              brahmiWord: '𑀤𑀾𑀯𑀸𑀦𑀸𑀁𑀧𑀺𑀬',
              iastWord: 'Devānaṁpiye',
              devanagariWord: 'देवानांपिये',
              meaningSummary: 'Beloved of the Gods',
            }
          ],
        },
        translation: {
          hindiTranslation: data.translation?.hindi || '',
          englishTranslation: data.translation?.english || '',
          criticalApparatusNotes: ['Analyzed via FastAPI OpenCV & Keras model API.'],
          historicalContext: {
            reignOf: 'Emperor Ashoka the Great (c. 3rd Century BCE)',
            summary: 'Digitized Brahmi epigraph segment analyzed via FastAPI Python backend.',
            keyThemes: ['Epigraphy', 'Brahmi Neural Classification'],
            geopoliticalSignificance: 'Analyzed via FastAPI backend API.',
          },
        },
        verification: {
          isVerified: false,
          correctionsCount: 0,
        },
      };

      return record;
    } catch (err: any) {
      if (err.message && !err.message.includes('fetch')) {
        throw err;
      }
      throw new Error('Unable to connect to Lipika AI ML engine. Please verify the FastAPI backend server is running.');
    }
  }

  async updateEnhancementConfig(id: string, config: EnhancementConfig): Promise<EnhancementConfig> {
    return mockApiService.updateEnhancementConfig(id, config);
  }

  async runSegmentation(id: string): Promise<CharacterSegment[]> {
    return mockApiService.runSegmentation(id);
  }

  async runOcrInference(id: string): Promise<BrahmiOcrResult> {
    return mockApiService.runOcrInference(id);
  }

  async updateGlyphCorrection(id: string, glyphId: string, correctedChar: string, notes?: string): Promise<CharacterSegment> {
    return mockApiService.updateGlyphCorrection(id, glyphId, correctedChar, notes);
  }

  async generateTransliteration(id: string): Promise<TransliterationResult> {
    return mockApiService.generateTransliteration(id);
  }

  async generateTranslation(id: string): Promise<TranslationResult> {
    return mockApiService.generateTranslation(id);
  }

  async submitVerification(id: string, verifiedBy: string, notes: string): Promise<boolean> {
    return mockApiService.submitVerification(id, verifiedBy, notes);
  }

  async exportRecord(id: string, format: 'json' | 'tei-xml' | 'pdf-report' | 'markdown'): Promise<{ downloadUrl: string; content: string }> {
    return mockApiService.exportRecord(id, format);
  }
}

export const fastApiService = new FastApiInscriptionService();
