import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Edit3,
  HelpCircle,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { usePipelineContext } from '../layouts/MainLayout';
import { CharacterSegment } from '../types/inscription';

export const Verification: React.FC = () => {
  const { record, verifyInscription, correctGlyph } = usePipelineContext();
  const navigate = useNavigate();

  const [verificationMap, setVerificationMap] = useState<Record<string, 'accepted' | 'edited' | 'uncertain' | 'pending'>>({});
  const [editingGlyph, setEditingGlyph] = useState<CharacterSegment | null>(null);
  const [customCharInput, setCustomCharInput] = useState('');
  const [customNoteInput, setCustomNoteInput] = useState('');

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('Dr. Epigraphist (ASI)');
  const [finalAuditNotes, setFinalAuditNotes] = useState('Verified against Corpus Inscriptionum Indicarum rubbing plates.');

  const [activeIndex, setActiveIndex] = useState(0);

  if (!record) return null;

  const segments = record.ocr.segments || [];
  const totalGlyphs = segments.length;

  const verifiedCount = Object.values(verificationMap).filter(
    (status) => status === 'accepted' || status === 'edited'
  ).length;

  const activeGlyph = segments[activeIndex] || segments[0];

  const handleAccept = (glyphId: string) => {
    setVerificationMap((prev) => ({ ...prev, [glyphId]: 'accepted' }));
    if (activeIndex < totalGlyphs - 1) {
      setActiveIndex((idx) => idx + 1);
    }
  };

  const handleChooseAlternative = (glyphId: string, altChar: string, altIast: string) => {
    correctGlyph(glyphId, altChar, `Replaced with alternative prediction ${altIast}`);
    setVerificationMap((prev) => ({ ...prev, [glyphId]: 'edited' }));
    if (activeIndex < totalGlyphs - 1) {
      setActiveIndex((idx) => idx + 1);
    }
  };

  const handleMarkUncertain = (glyphId: string) => {
    setVerificationMap((prev) => ({ ...prev, [glyphId]: 'uncertain' }));
    if (activeIndex < totalGlyphs - 1) {
      setActiveIndex((idx) => idx + 1);
    }
  };

  const handleOpenEditModal = (glyph: CharacterSegment) => {
    setEditingGlyph(glyph);
    setCustomCharInput(glyph.correctedChar || glyph.brahmiChar);
    setCustomNoteInput(glyph.notes || '');
  };

  const handleSaveCustomEdit = () => {
    if (editingGlyph && customCharInput) {
      correctGlyph(editingGlyph.id, customCharInput, customNoteInput);
      setVerificationMap((prev) => ({ ...prev, [editingGlyph.id]: 'edited' }));
      setEditingGlyph(null);
    }
  };

  const handleCompleteVerification = async () => {
    await verifyInscription(reviewerName, finalAuditNotes);
    setIsCompleteModalOpen(false);
    navigate('/translation');
  };

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Human Verification
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Glyph {activeIndex + 1} of {totalGlyphs} • Verified {verifiedCount} of {totalGlyphs}
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<CheckCircle2 className="w-4 h-4" />}
          onClick={() => setIsCompleteModalOpen(true)}
        >
          Complete Verification
        </Button>
      </div>

      {/* Progress Line */}
      <div className="space-y-1.5">
        <Progress value={(verifiedCount / totalGlyphs) * 100} size="sm" variant="neutral" />
      </div>

      {/* Main Inspection Card */}
      {activeGlyph && (
        <Card variant="default" className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Original Stone Crop */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-zinc-500 block uppercase">
                Original Stone Inscription
              </span>
              <div className="relative h-56 bg-zinc-950 rounded border border-zinc-800 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={record.metadata.imageUrl}
                  alt="Original stone crop"
                  className="max-h-full max-w-full object-contain filter contrast-125 select-none"
                  style={{
                    transform: `scale(2.2)`,
                    transformOrigin: `${activeGlyph.x + activeGlyph.width / 2}% ${activeGlyph.y + activeGlyph.height / 2}%`,
                  }}
                />
              </div>
            </div>

            {/* Right: AI Prediction & Alternatives */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-zinc-500 uppercase">
                  AI Prediction
                </span>
                <ConfidenceBadge confidence={activeGlyph.confidence} size="sm" />
              </div>

              {/* Main Predicted Character */}
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-center space-y-1">
                <span className="font-serif text-5xl font-bold text-white block">
                  {activeGlyph.correctedChar || activeGlyph.brahmiChar}
                </span>
                <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-400 pt-1">
                  <span>IAST: <strong className="text-white">{activeGlyph.phoneticIAST}</strong></span>
                  <span>•</span>
                  <span>Devanagari: <strong className="text-white">{activeGlyph.devanagariEquiv}</strong></span>
                </div>
              </div>

              {/* Alternatives */}
              {activeGlyph.alternatives.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-500 block">
                    Choose alternative candidate:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {activeGlyph.alternatives.map((alt) => (
                      <button
                        key={alt.unicode}
                        onClick={() => handleChooseAlternative(activeGlyph.id, alt.char, alt.iast)}
                        className="p-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded text-left transition-colors flex items-center justify-between"
                      >
                        <span className="font-serif text-lg text-white font-bold">{alt.char}</span>
                        <span className="text-xs font-mono text-zinc-400">{alt.iast} ({alt.confidence}%)</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons & Stepper */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                icon={<Check className="w-3.5 h-3.5" />}
                onClick={() => handleAccept(activeGlyph.id)}
              >
                Accept
              </Button>
              <Button
                variant="secondary"
                size="sm"
                icon={<Edit3 className="w-3.5 h-3.5" />}
                onClick={() => handleOpenEditModal(activeGlyph)}
              >
                Edit
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<HelpCircle className="w-3.5 h-3.5 text-zinc-400" />}
                onClick={() => handleMarkUncertain(activeGlyph.id)}
              >
                Uncertain
              </Button>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={activeIndex === 0}
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                icon={<ChevronLeft className="w-4 h-4" />}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={activeIndex === totalGlyphs - 1}
                onClick={() => setActiveIndex((i) => Math.min(totalGlyphs - 1, i + 1))}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Character Modal */}
      <Modal
        isOpen={!!editingGlyph}
        onClose={() => setEditingGlyph(null)}
        title="Manual Character Override"
        subtitle="Specify corrected Brahmi or phonetic equivalent"
      >
        {editingGlyph && (
          <div className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-zinc-400 block mb-1">Corrected Character</label>
              <input
                type="text"
                value={customCharInput}
                onChange={(e) => setCustomCharInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white font-serif text-lg focus:outline-none focus:border-zinc-400"
              />
            </div>
            <div>
              <label className="text-zinc-400 block mb-1">Scholar Notes / Justification</label>
              <textarea
                rows={2}
                value={customNoteInput}
                onChange={(e) => setCustomNoteInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-200 font-sans focus:outline-none focus:border-zinc-400"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingGlyph(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleSaveCustomEdit}>
                Save Override
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Complete Verification Modal */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Complete Verification"
        subtitle="Sign off on verified inscription text for translation & export"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
            <p className="text-zinc-400">Total Glyphs Verified: <span className="text-white font-bold">{verifiedCount} of {totalGlyphs}</span></p>
          </div>
          <div>
            <label className="text-zinc-400 block mb-1">Reviewer Signature</label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-zinc-400"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setIsCompleteModalOpen(false)}>
              Back
            </Button>
            <Button variant="primary" size="sm" onClick={handleCompleteVerification}>
              Sign Off & Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
