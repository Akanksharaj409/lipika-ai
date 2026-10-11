import { InscriptionApiService } from './apiInterface';
import { MOCK_INSCRIPTIONS } from '../data/mockInscriptions';
import {
  FullInscriptionRecord,
  InscriptionMetadata,
  EnhancementConfig,
  BrahmiOcrResult,
  TransliterationResult,
  TranslationResult,
  CharacterSegment,
} from '../types/inscription';

// Helper to simulate network latency cleanly
const delay = <T>(data: T, ms = 300): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), ms));
};

class MockInscriptionService implements InscriptionApiService {
  private records: Map<string, FullInscriptionRecord> = new Map();

  constructor() {
    MOCK_INSCRIPTIONS.forEach((item) => {
      this.records.set(item.metadata.id, item);
    });
  }

  async getInscriptions(): Promise<InscriptionMetadata[]> {
    const list = Array.from(this.records.values()).map((r) => r.metadata);
    return delay(list, 200);
  }

  async getInscriptionById(id: string): Promise<FullInscriptionRecord> {
    const record = this.records.get(id) || this.records.get('ins-ashoka-03')!;
    return delay(record, 250);
  }

  async uploadInscriptionImage(file: File, metadataInput: Partial<InscriptionMetadata>): Promise<FullInscriptionRecord> {
    const newId = `ins-user-${Date.now()}`;
    const previewUrl = URL.createObjectURL(file);

    const newRecord: FullInscriptionRecord = {
      metadata: {
        id: newId,
        title: metadataInput.title || file.name.replace(/\.[^/.]+$/, ''),
        provenance: metadataInput.provenance || 'User Uploaded Sample',
        siteLocation: metadataInput.siteLocation || 'Unspecified Site',
        currentLocation: 'User Digital Asset',
        period: metadataInput.period || 'Unknown Ancient Period',
        dynasty: metadataInput.dynasty || 'Undetermined',
        estimatedCentury: metadataInput.estimatedCentury || 'c. 3rd-1st Century BCE',
        material: metadataInput.material || 'Sandstone / Rock Surface',
        dimensions: 'Variable',
        language: 'Prakrit / Sanskrit',
        script: metadataInput.script || 'Ashokan Brahmi',
        category: metadataInput.category || 'Rock Edict',
        corpusCatalogId: `BR-USR-${Math.floor(100 + Math.random() * 900)}`,
        uploaderName: 'Research Fellow',
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
        totalGlyphsDetected: 8,
        averageConfidence: 91.5,
        rawBrahmiLine: '𑀤𑀾𑀯𑀸𑀦𑀸𑀁𑀧𑀺𑀬𑁂 𑀧𑀺𑀬𑀤𑀲𑀺',
        lineBreakPositions: [],
        segments: MOCK_INSCRIPTIONS[0].ocr.segments.slice(0, 8),
      },
      transliteration: {
        rawBrahmi: '𑀤𑀾𑀯𑀸𑀦𑀸𑀁𑀧𑀺𑀬𑁂 𑀧𑀺𑀬𑀤𑀲𑀺',
        iastText: 'Devānaṁpiye Piyadasi',
        devanagariText: 'देवानांपिये पियदसि',
        phoneticEnglish: 'Devanampriya Priyadarsi',
        wordSegmentation: MOCK_INSCRIPTIONS[0].transliteration.wordSegmentation.slice(0, 2),
      },
      translation: {
        hindiTranslation: 'देवताओं के प्रिय, प्रियदर्शी राजा',
        englishTranslation: 'Beloved-of-the-Gods, King Priyadarsi',
        criticalApparatusNotes: ['Newly uploaded Brahmi epigraph segment.'],
        historicalContext: {
          reignOf: 'Mauryan Epigraphical Corpus',
          summary: 'Newly digitized inscription uploaded for automated OCR segmentation and transliteration.',
          keyThemes: ['Digital Humanities', 'Epigraphic Digitization'],
          geopoliticalSignificance: 'Under epigraphical analysis.',
        },
      },
      verification: {
        isVerified: false,
        correctionsCount: 0,
      },
    };

    this.records.set(newId, newRecord);
    return delay(newRecord, 500);
  }

  async updateEnhancementConfig(id: string, config: EnhancementConfig): Promise<EnhancementConfig> {
    const record = this.records.get(id);
    if (record) {
      record.enhancement = { ...config };
    }
    return delay(config, 150);
  }

  async runSegmentation(id: string): Promise<CharacterSegment[]> {
    const record = this.records.get(id);
    return delay(record ? record.ocr.segments : MOCK_INSCRIPTIONS[0].ocr.segments, 400);
  }

  async runOcrInference(id: string): Promise<BrahmiOcrResult> {
    const record = this.records.get(id);
    return delay(record ? record.ocr : MOCK_INSCRIPTIONS[0].ocr, 500);
  }

  async updateGlyphCorrection(id: string, glyphId: string, correctedChar: string, notes?: string): Promise<CharacterSegment> {
    const record = this.records.get(id);
    if (record) {
      const seg = record.ocr.segments.find((s) => s.id === glyphId);
      if (seg) {
        seg.isCorrected = true;
        seg.correctedChar = correctedChar;
        seg.notes = notes;
        record.verification.correctionsCount += 1;
        return delay(seg, 150);
      }
    }
    throw new Error('Glyph not found');
  }

  async generateTransliteration(id: string): Promise<TransliterationResult> {
    const record = this.records.get(id);
    return delay(record ? record.transliteration : MOCK_INSCRIPTIONS[0].transliteration, 300);
  }

  async generateTranslation(id: string): Promise<TranslationResult> {
    const record = this.records.get(id);
    return delay(record ? record.translation : MOCK_INSCRIPTIONS[0].translation, 350);
  }

  async submitVerification(id: string, verifiedBy: string, notes: string): Promise<boolean> {
    const record = this.records.get(id);
    if (record) {
      record.verification.isVerified = true;
      record.verification.verifiedBy = verifiedBy;
      record.verification.verificationDate = new Date().toISOString().split('T')[0];
      record.verification.verificationNotes = notes;
    }
    return delay(true, 300);
  }

  async exportRecord(id: string, format: 'json' | 'tei-xml' | 'pdf-report' | 'markdown'): Promise<{ downloadUrl: string; content: string }> {
    const record = this.records.get(id) || MOCK_INSCRIPTIONS[0];
    
    let content = '';
    if (format === 'tei-xml') {
      content = `<?xml version="1.0" encoding="UTF-8"?>
<TEI xmlns="http://www.tei-c.org/ns/1.0">
  <teiHeader>
    <fileDesc>
      <titleStmt>
        <title>${record.metadata.title}</title>
        <editor>${record.verification.verifiedBy || 'Lipika AI Epigraphy Engine'}</editor>
      </titleStmt>
      <publicationStmt>
        <p>Lipika AI Digital Humanities Archive</p>
      </publicationStmt>
      <sourceDesc>
        <msDesc>
          <msIdentifier>
            <idno>${record.metadata.corpusCatalogId}</idno>
            <repository>${record.metadata.currentLocation}</repository>
          </msIdentifier>
        </msDesc>
      </sourceDesc>
    </fileDesc>
  </teiHeader>
  <text>
    <body>
      <div type="edition" xml:lang="pra-Brah">
        <ab>${record.ocr.rawBrahmiLine}</ab>
      </div>
      <div type="transliteration" xml:lang="sa-Latn">
        <ab>${record.transliteration.iastText}</ab>
      </div>
      <div type="translation" xml:lang="en">
        <p>${record.translation.englishTranslation}</p>
      </div>
    </body>
  </text>
</TEI>`;
    } else if (format === 'json') {
      content = JSON.stringify(record, null, 2);
    } else {
      content = `# Lipika AI Epigraphical Report: ${record.metadata.title}

Catalog ID: ${record.metadata.corpusCatalogId}
Period: ${record.metadata.period} (${record.metadata.estimatedCentury})
Script: ${record.metadata.script}

## Raw Brahmi OCR Transcription
${record.ocr.rawBrahmiLine}

## IAST Transliteration
${record.transliteration.iastText}

## English Translation
${record.translation.englishTranslation}

## Hindi Translation
${record.translation.hindiTranslation}
`;
    }

    return delay({
      downloadUrl: '#',
      content,
    }, 250);
  }
}

export const mockApiService = new MockInscriptionService();
