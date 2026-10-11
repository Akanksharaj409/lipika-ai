import { FullInscriptionRecord } from '../types/inscription';
import { apiService } from './apiClient';
import { MOCK_INSCRIPTIONS } from '../data/mockInscriptions';

export type PipelineStepKey =
  | 'enhancement'
  | 'segmentation'
  | 'ocr'
  | 'confidence'
  | 'verification'
  | 'transliteration'
  | 'translation';

export interface PipelineStepDetail {
  key: PipelineStepKey;
  label: string;
  description: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number; // 0 - 100
  detailMessage?: string;
}

export interface AnalysisSession {
  sessionId: string;
  file?: File;
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl: string;
  steps: PipelineStepDetail[];
  overallProgress: number;
  isProcessing: boolean;
  isComplete: boolean;
  error?: string;
  resultRecord?: FullInscriptionRecord;
}

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

const INITIAL_STEPS: PipelineStepDetail[] = [
  {
    key: 'enhancement',
    label: '1. Image Enhancement',
    description: 'OpenCV CLAHE contrast equalization & Laplacian rubbing filter pass.',
    status: 'idle',
    progress: 0,
  },
  {
    key: 'segmentation',
    label: '2. Segmentation',
    description: 'Morphological contour extraction & bounding box coordinate assignment.',
    status: 'idle',
    progress: 0,
  },
  {
    key: 'ocr',
    label: '3. Brahmi OCR',
    description: 'ResNet convolutional neural classifier predicting Brahmi Unicode hex stacks.',
    status: 'idle',
    progress: 0,
  },
  {
    key: 'confidence',
    label: '4. Confidence Analysis',
    description: 'Softmax probability scoring and candidate ranking for doubtful glyphs.',
    status: 'idle',
    progress: 0,
  },
  {
    key: 'verification',
    label: '5. Human Verification Stage',
    description: 'Preparing character override matrix & EpiDoc TEI-XML sign-off schema.',
    status: 'idle',
    progress: 0,
  },
  {
    key: 'transliteration',
    label: '6. Transliteration',
    description: 'Standardized IAST phonetics & Devanagari character conversion.',
    status: 'idle',
    progress: 0,
  },
  {
    key: 'translation',
    label: '7. Translation',
    description: 'Prakrit grammar translation & historical/geopolitical context lookup.',
    status: 'idle',
    progress: 0,
  },
];

class AnalysisService {
  private activeTimers: Map<string, number[]> = new Map();

  validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) && !file.name.match(/\.(jpg|jpeg|png|webp)$/i)) {
      return {
        valid: false,
        error: 'Unsupported image format. Please upload a JPG, JPEG, PNG, or WEBP file.',
      };
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        valid: false,
        error: `File size (${sizeMB} MB) exceeds maximum limit of 15 MB.`,
      };
    }
    return { valid: true };
  }

  createSessionFromFile(file: File): AnalysisSession {
    const previewUrl = URL.createObjectURL(file);
    return {
      sessionId: `session-${Date.now()}`,
      file,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'image/jpeg',
      previewUrl,
      steps: JSON.parse(JSON.stringify(INITIAL_STEPS)),
      overallProgress: 0,
      isProcessing: false,
      isComplete: false,
    };
  }

  createSessionFromSample(record: FullInscriptionRecord): AnalysisSession {
    return {
      sessionId: `session-sample-${record.metadata.id}-${Date.now()}`,
      fileName: `${record.metadata.corpusCatalogId}_${record.metadata.title}.jpg`,
      fileSize: 2.4 * 1024 * 1024,
      fileType: 'image/jpeg',
      previewUrl: record.metadata.imageUrl,
      steps: JSON.parse(JSON.stringify(INITIAL_STEPS)),
      overallProgress: 0,
      isProcessing: false,
      isComplete: false,
      resultRecord: record,
    };
  }

  async runPipeline(
    session: AnalysisSession,
    onProgress: (updatedSession: AnalysisSession) => void
  ): Promise<AnalysisSession> {
    const currentSession: AnalysisSession = {
      ...session,
      isProcessing: true,
      error: undefined,
      steps: session.steps.map((s) => ({ ...s, status: 'idle', progress: 0 })),
      overallProgress: 5,
    };

    onProgress({ ...currentSession });

    try {
      let resRecord: FullInscriptionRecord;

      // Stage 1 & 2: Preprocessing & Neural API Call
      currentSession.steps[0].status = 'processing';
      currentSession.steps[0].progress = 50;
      currentSession.overallProgress = 20;
      onProgress({ ...currentSession });

      if (currentSession.file) {
        // Send multipart/form-data to FastAPI endpoint via apiService
        resRecord = await apiService.uploadInscriptionImage(currentSession.file, {
          title: currentSession.fileName.replace(/\.[^/.]+$/, ''),
        });
      } else if (currentSession.resultRecord) {
        resRecord = currentSession.resultRecord;
      } else {
        resRecord = MOCK_INSCRIPTIONS[0];
      }

      // Mark all 7 steps as completed progressively
      for (let i = 0; i < currentSession.steps.length; i++) {
        currentSession.steps[i].status = 'completed';
        currentSession.steps[i].progress = 100;
        currentSession.overallProgress = Math.round(((i + 1) / currentSession.steps.length) * 100);
        onProgress({ ...currentSession });
      }

      currentSession.isProcessing = false;
      currentSession.isComplete = true;
      currentSession.overallProgress = 100;
      currentSession.resultRecord = resRecord;
      onProgress({ ...currentSession });

      return currentSession;
    } catch (err: any) {
      const userFriendlyError =
        err.message || 'An error occurred while connecting to the FastAPI analysis server. Please try again.';

      currentSession.isProcessing = false;
      currentSession.isComplete = false;
      currentSession.error = userFriendlyError;
      currentSession.steps.forEach((s) => {
        if (s.status === 'processing') s.status = 'error';
      });
      onProgress({ ...currentSession });
      throw err;
    }
  }

  cancelPipeline(sessionId: string): void {
    const timers = this.activeTimers.get(sessionId);
    if (timers) {
      timers.forEach((t) => clearTimeout(t));
      this.activeTimers.delete(sessionId);
    }
  }
}

export const analysisService = new AnalysisService();
