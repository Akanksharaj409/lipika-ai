import { useState, useEffect, useCallback } from 'react';
import {
  FullInscriptionRecord,
  EnhancementConfig,
  CharacterSegment,
  InscriptionMetadata,
} from '../types/inscription';
import { apiService } from '../services/apiClient';

export function useInscriptionPipeline(initialId = 'ins-ashoka-03') {
  const [activeId, setActiveId] = useState<string>(initialId);
  const [record, setRecord] = useState<FullInscriptionRecord | null>(null);
  const [allInscriptions, setAllInscriptions] = useState<InscriptionMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [selectedGlyph, setSelectedGlyph] = useState<CharacterSegment | null>(null);

  // Load all available inscriptions for dropdown
  useEffect(() => {
    apiService.getInscriptions().then(setAllInscriptions).catch(console.error);
  }, []);

  // Fetch record details when activeId changes
  useEffect(() => {
    setLoading(true);
    apiService.getInscriptionById(activeId)
      .then((data) => {
        setRecord(data);
        if (data.ocr.segments.length > 0) {
          setSelectedGlyph(data.ocr.segments[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeId]);

  // Enhancement updater
  const updateEnhancement = useCallback(async (newConfig: EnhancementConfig) => {
    if (!record) return;
    setProcessingStep('Applying Image Filters...');
    try {
      const updated = await apiService.updateEnhancementConfig(record.metadata.id, newConfig);
      setRecord((prev) => prev ? { ...prev, enhancement: updated } : null);
    } finally {
      setProcessingStep(null);
    }
  }, [record]);

  // Glyph correction updater
  const correctGlyph = useCallback(async (glyphId: string, newChar: string, notes?: string) => {
    if (!record) return;
    try {
      const updatedSeg = await apiService.updateGlyphCorrection(record.metadata.id, glyphId, newChar, notes);
      setRecord((prev) => {
        if (!prev) return null;
        const newSegs = prev.ocr.segments.map((s) => s.id === glyphId ? updatedSeg : s);
        return {
          ...prev,
          ocr: { ...prev.ocr, segments: newSegs },
          verification: { ...prev.verification, correctionsCount: prev.verification.correctionsCount + 1 }
        };
      });
      if (selectedGlyph?.id === glyphId) {
        setSelectedGlyph(updatedSeg);
      }
    } catch (err) {
      console.error(err);
    }
  }, [record, selectedGlyph]);

  // Submit human verification
  const verifyInscription = useCallback(async (reviewerName: string, notes: string) => {
    if (!record) return;
    setProcessingStep('Recording Verification Audit...');
    try {
      await apiService.submitVerification(record.metadata.id, reviewerName, notes);
      setRecord((prev) => prev ? {
        ...prev,
        verification: {
          ...prev.verification,
          isVerified: true,
          verifiedBy: reviewerName,
          verificationDate: new Date().toISOString().split('T')[0],
          verificationNotes: notes,
        }
      } : null);
    } finally {
      setProcessingStep(null);
    }
  }, [record]);

  return {
    activeId,
    setActiveId,
    record,
    setRecord,
    allInscriptions,
    loading,
    processingStep,
    selectedGlyph,
    setSelectedGlyph,
    updateEnhancement,
    correctGlyph,
    verifyInscription,
  };
}
