import { TransliterationResult, TranslationResult } from '../types/inscription';
import { apiService } from './apiClient';

class TranslationService {
  /**
   * Fetches transliteration & translation records
   */
  async getInterpretationData(inscriptionId: string): Promise<{
    transliteration: TransliterationResult;
    translation: TranslationResult;
  }> {
    const [transliteration, translation] = await Promise.all([
      apiService.generateTransliteration(inscriptionId),
      apiService.generateTranslation(inscriptionId),
    ]);
    return { transliteration, translation };
  }

  /**
   * Copy text helper
   */
  async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}

export const translationService = new TranslationService();
