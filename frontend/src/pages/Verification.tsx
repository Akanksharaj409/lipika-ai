import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpenCheck,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  FileText,
  Check,
  X,
  AlertCircle,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { usePipelineContext } from '../layouts/MainLayout';
import { CharacterSegment } from '../types/inscription';

export const Verification: React.FC = () => {
  const { record, setRecord, verifyInscription, correctGlyph } = usePipelineContext();
  const navigate = useNavigate();

  // Verification state per character ID: 'accepted' | 'edited' | 'uncertain' | 'pending'
  const [verificationMap, setVerificationMap] = useState<Record<string, 'accepted' | 'edited' | 'uncertain' | 'pending'>>({});
  
  // Active editing modal/inline state
  const [editingGlyph, setEditingGlyph] = useState<CharacterSegment | null>(null);
  const [customCharInput, setCustomCharInput] = useState('');
  const [customNoteInput, setCustomNoteInput] = useState('');

  // Complete Verification Modal
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [reviewerName, setReviewerName] = useState('Dr. Epigraphist (ASI)');
  const [finalAuditNotes, setFinalAuditNotes] = useState('Verified against Corpus Inscriptionum Indicarum rubbing plates.');

  // Active character carousel index
  const [activeIndex, setActiveIndex] = useState(0);

  if (!record) return null;

  const segments = record.ocr.segments || [];
  const totalGlyphs = segments.length;

  // Verified Count computation
  const verifiedCount = Object.values(verificationMap).filter(
    (status) => status === 'accepted' || status === 'edited'
  ).length;

  const activeGlyph = segments[activeIndex] || segments[0];
  const activeStatus = verificationMap[activeGlyph?.id] || (activeGlyph?.isCorrected ? 'edited' : 'pending');

  // Actions
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
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Pipeline Step 05</Badge>
            <Badge variant="outline">Human-in-the-Loop Audit</Badge>
          </div>
          <h1 className="font-serif text-3xl font-medium text-white flex items-center gap-3 mt-1">
            <BookOpenCheck className="w-7 h-7 text-zinc-300" />
            Human Verification & Philological Audit
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => setIsCompleteModalOpen(true)}
          >
            Complete Verification
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCHOLARLY INTEGRITY & DISCLAIMER NOTICE */}
      {/* ========================================================================= */}
      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-zinc-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-white shrink-0" />
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="text-white">AI-assisted prediction</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-300">Requires human verification</span>
            </div>
            <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
              AI suggestions are probabilistic neural estimates and are not automatically treated as scholarly truth. All epigraphical readings require expert philological review.
            </p>
          </div>
        </div>
        <Badge variant="neutral" className="shrink-0">Research Protocol</Badge>
      </div>

      {/* ========================================================================= */}
      {/* VERIFICATION PROGRESS TELEMETRY BAR */}
      {/* ========================================================================= */}
      <Card variant="glass" className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-white" />
            <span className="text-zinc-300 font-semibold">Verification Audit Progress:</span>
            <span className="text-white font-bold text-sm">
              Verified: {verifiedCount} / {totalGlyphs}
            </span>
          </div>
          <span className="text-zinc-400 font-semibold">
            {Math.round((verifiedCount / totalGlyphs) * 100)}% Complete
          </span>
        </div>

        <Progress value={(verifiedCount / totalGlyphs) * 100} size="md" variant="neutral" />

        {/* Carousel Stepper Dots */}
        <div className="flex items-center justify-between pt-2 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {segments.map((s, idx) => {
              const status = verificationMap[s.id] || (s.isCorrected ? 'edited' : 'pending');
              const isActive = idx === activeIndex;

              return (
                <button
                  key={s.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-7 h-7 rounded flex items-center justify-center font-mono text-xs transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold ring-2 ring-zinc-400'
                      : status === 'accepted'
                      ? 'bg-zinc-800 border border-zinc-500 text-white'
                      : status === 'edited'
                      ? 'bg-zinc-900 border border-zinc-600 text-zinc-200'
                      : status === 'uncertain'
                      ? 'bg-black border border-zinc-700 border-dashed text-zinc-400'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0 pl-4">
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

      {/* ========================================================================= */}
      {/* 3-PART VERIFICATION INSPECTION CARD (LEFT - CENTER - RIGHT) */}
      {/* ========================================================================= */}
      {activeGlyph && (
        <Card variant="archival" className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-3 gap-2">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-white">
                Glyph Inspection #{String(activeIndex + 1).padStart(2, '0')} of {totalGlyphs}
              </span>
              <span className="text-zinc-500 font-mono text-xs">({activeGlyph.id})</span>
            </div>

            <div className="flex items-center gap-2">
              {activeStatus === 'accepted' && <Badge variant="solid">Verified Accepted</Badge>}
              {activeStatus === 'edited' && <Badge variant="outline">Manually Overridden</Badge>}
              {activeStatus === 'uncertain' && <Badge variant="neutral">Flagged Uncertain</Badge>}
              {activeStatus === 'pending' && <Badge variant="outline">Review Pending</Badge>}
              <ConfidenceBadge confidence={activeGlyph.confidence} />
            </div>
          </div>

          {/* 3-PANEL GRID: LEFT (CROP) - CENTER (AI PREDICTION) - RIGHT (ALTERNATIVES) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* ----------------------------------------------------------------- */}
            {/* LEFT PANEL: ORIGINAL CROPPED CHARACTER IMAGE */}
            {/* ----------------------------------------------------------------- */}
            <div className="md:col-span-4 bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between items-center space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold self-start">
                LEFT: Original Stone Crop
              </span>

              {/* Cropped Character Preview Box */}
              <div className="relative w-full h-44 bg-zinc-900 rounded border border-zinc-700 overflow-hidden flex items-center justify-center p-2 bg-grid-pattern">
                <img
                  src={record.metadata.imageUrl}
                  alt="Original Inscription Character Surface"
                  className="max-h-full max-w-full object-contain filter contrast-125 select-none"
                  style={{
                    transform: `scale(2.2)`,
                    transformOrigin: `${activeGlyph.x + activeGlyph.width / 2}% ${activeGlyph.y + activeGlyph.height / 2}%`,
                  }}
                />
                <div className="absolute inset-0 border-2 border-white/60 pointer-events-none rounded" />
              </div>

              <div className="w-full text-[10px] font-mono text-zinc-400 text-center space-y-0.5">
                <p>Coordinates: x={activeGlyph.x}%, y={activeGlyph.y}%</p>
                <p>Dimensions: {activeGlyph.width} × {activeGlyph.height}%</p>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* CENTER PANEL: AI PREDICTION */}
            {/* ----------------------------------------------------------------- */}
            <div className="md:col-span-4 bg-zinc-950 border border-zinc-700 rounded-lg p-4 flex flex-col justify-between space-y-4 text-center">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                  CENTER: AI Prediction
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Softmax Score</span>
              </div>

              <div className="py-2 space-y-2">
                <span className="font-serif text-6xl font-bold text-white block">
                  {activeGlyph.correctedChar || activeGlyph.brahmiChar}
                </span>

                <div className="space-y-1">
                  <span className="text-xs font-mono text-zinc-300 block">
                    AI Confidence: <strong className="text-white font-bold">{activeGlyph.confidence.toFixed(1)}%</strong>
                  </span>
                  <div className="flex items-center justify-center gap-1.5 font-mono text-xs">
                    <Badge variant="neutral">{activeGlyph.unicodeHex}</Badge>
                    <Badge variant="solid">IAST: {activeGlyph.phoneticIAST}</Badge>
                  </div>
                </div>
              </div>

              <div className="p-2 bg-zinc-900 rounded border border-zinc-800 text-[11px] font-mono text-zinc-300">
                Devanagari Equivalent: <span className="text-white font-bold">{activeGlyph.devanagariEquiv}</span>
              </div>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* RIGHT PANEL: ALTERNATIVE PREDICTIONS */}
            {/* ----------------------------------------------------------------- */}
            <div className="md:col-span-4 bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-center w-full">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  RIGHT: Top Alternatives
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Ranked Probabilities</span>
              </div>

              <div className="space-y-2 flex-1">
                {activeGlyph.alternatives.length === 0 ? (
                  <p className="text-xs font-mono text-zinc-500 text-center py-6">No secondary alternatives detected.</p>
                ) : (
                  activeGlyph.alternatives.map((alt) => (
                    <div
                      key={alt.unicode}
                      onClick={() => handleChooseAlternative(activeGlyph.id, alt.char, alt.iast)}
                      className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-600 rounded flex items-center justify-between cursor-pointer transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-2xl font-bold text-white group-hover:scale-110 transition-transform">
                          {alt.char}
                        </span>
                        <div>
                          <span className="text-xs font-mono text-zinc-300 block">{alt.iast}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{alt.unicode}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-mono text-xs font-bold text-white">{alt.confidence}%</span>
                        <span className="text-[10px] font-mono text-zinc-400 block group-hover:text-white">
                          Select →
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ACTION TOOLBAR: ACCEPT | EDIT | CHOOSE ALTERNATIVE | MARK UNCERTAIN */}
          {/* ========================================================================= */}
          <div className="pt-4 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              {/* ACCEPT BUTTON */}
              <Button
                variant="primary"
                icon={<Check className="w-4 h-4" />}
                onClick={() => handleAccept(activeGlyph.id)}
              >
                Accept Prediction
              </Button>

              {/* EDIT BUTTON */}
              <Button
                variant="secondary"
                icon={<Edit3 className="w-4 h-4" />}
                onClick={() => handleOpenEditModal(activeGlyph)}
              >
                Edit Character
              </Button>

              {/* MARK UNCERTAIN BUTTON */}
              <Button
                variant="outline"
                icon={<HelpCircle className="w-4 h-4" />}
                onClick={() => handleMarkUncertain(activeGlyph.id)}
              >
                Mark Uncertain / Lacuna
              </Button>
            </div>

            {/* COMPLETE VERIFICATION CTA */}
            <Button
              variant="primary"
              size="lg"
              icon={<CheckCircle2 className="w-5 h-5" />}
              onClick={() => setIsCompleteModalOpen(true)}
            >
              Complete Verification
            </Button>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MANUAL CHARACTER EDIT MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!editingGlyph}
        onClose={() => setEditingGlyph(null)}
        title="Manual Epigraphical Character Override"
        subtitle="Specify corrected Brahmi unicode character and scholar notes"
      >
        {editingGlyph && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-zinc-400 block">Original AI Glyph:</span>
                <span className="font-serif text-3xl font-bold text-white">{editingGlyph.brahmiChar}</span>
              </div>
              <ConfidenceBadge confidence={editingGlyph.confidence} />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300">Corrected Character (Brahmi / IAST Equivalent)</label>
              <input
                type="text"
                value={customCharInput}
                onChange={(e) => setCustomCharInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white font-serif text-xl focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300">Philological Reasoning / Lacuna Notes</label>
              <textarea
                rows={3}
                placeholder="Describe stone abrasion, epigraphical context, or dictionary reference..."
                value={customNoteInput}
                onChange={(e) => setCustomNoteInput(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-200 font-sans focus:outline-none focus:border-zinc-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" onClick={() => setEditingGlyph(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<Check className="w-4 h-4" />} onClick={handleSaveCustomEdit}>
                Save Override
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* COMPLETE VERIFICATION MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        title="Complete Verification & Update OCR Result"
        subtitle="Sign off on verified inscription text for TEI-XML export and translation"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-3 bg-zinc-950 rounded border border-zinc-700 space-y-1">
            <p className="text-white font-semibold">Audit Summary:</p>
            <p className="text-zinc-300">Inscription Title: <span className="text-white">{record.metadata.title}</span></p>
            <p className="text-zinc-300">Total Glyphs Verified: <span className="text-white font-bold">{verifiedCount} / {totalGlyphs}</span></p>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300">Epigraphist / Reviewer Signature</label>
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-white font-sans focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300">Final Verification Audit Remarks</label>
            <textarea
              rows={3}
              value={finalAuditNotes}
              onChange={(e) => setFinalAuditNotes(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-zinc-200 font-sans focus:outline-none focus:border-zinc-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setIsCompleteModalOpen(false)}>
              Back to Review
            </Button>
            <Button
              variant="primary"
              icon={<CheckCircle2 className="w-4 h-4" />}
              onClick={handleCompleteVerification}
            >
              Sign Off & Update OCR Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
