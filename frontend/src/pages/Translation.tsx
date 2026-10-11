import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Languages,
  Copy,
  Check,
  Edit2,
  Save,
  Globe,
  BookOpen,
  Sparkles,
  ArrowDown,
  ShieldCheck,
  AlertCircle,
  Eye,
  Database,
  Cpu,
  UserCheck,
  FileText,
  Bookmark,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { Progress } from '../components/ui/Progress';
import { Modal } from '../components/ui/Modal';
import { usePipelineContext } from '../layouts/MainLayout';
import { translationService } from '../services/translationService';

export const Translation: React.FC = () => {
  const { record, setRecord } = usePipelineContext();
  const navigate = useNavigate();

  // Copy feedback state per stage
  const [copiedStage, setCopiedStage] = useState<string | null>(null);

  // Edit mode toggles per stage
  const [editingStage, setEditingStage] = useState<string | null>(null);

  // Editable text states
  const [editableIast, setEditableIast] = useState('');
  const [editableHindi, setEditableHindi] = useState('');
  const [editableEnglish, setEditableEnglish] = useState('');
  const [editableContext, setEditableContext] = useState('');

  // Source image preview modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!record) return null;

  // Initialize editable text if empty
  const currentIast = editableIast || record.transliteration.iastText;
  const currentHindi = editableHindi || record.translation.hindiTranslation;
  const currentEnglish = editableEnglish || record.translation.englishTranslation;
  const currentContext = editableContext || record.translation.historicalContext.summary;

  const handleCopy = async (stageKey: string, text: string) => {
    const success = await translationService.copyToClipboard(text);
    if (success) {
      setCopiedStage(stageKey);
      setTimeout(() => setCopiedStage(null), 2000);
    }
  };

  const handleSaveEdit = (stageKey: string) => {
    setRecord((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      if (stageKey === 'iast') {
        updated.transliteration.iastText = currentIast;
      } else if (stageKey === 'hindi') {
        updated.translation.hindiTranslation = currentHindi;
      } else if (stageKey === 'english') {
        updated.translation.englishTranslation = currentEnglish;
      } else if (stageKey === 'context') {
        updated.translation.historicalContext.summary = currentContext;
      }
      return updated;
    });
    setEditingStage(null);
  };

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Pipeline Step 06, 07 & 08</Badge>
            <span className="text-xs font-mono text-zinc-400">Philological Transliteration & NMT Translation</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-white flex items-center gap-3 mt-1">
            <Languages className="w-7 h-7 text-zinc-300" />
            Transliteration & Translation Pipeline
          </h1>
        </div>

        <Button
          variant="primary"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => navigate('/history')}
        >
          View Archival Catalog
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* DISCLAIMER BANNER */}
      {/* ========================================================================= */}
      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-between gap-3 text-xs font-mono text-zinc-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-white shrink-0" />
          <p className="font-sans text-xs text-zinc-300">
            <strong className="text-white font-semibold font-mono">Interpretive Assistance Disclaimer:</strong>{' '}
            AI-generated translations are provided as interpretive assistance and should be reviewed by qualified researchers.
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 hidden sm:inline-flex">
          AI + Human Review
        </Badge>
      </div>

      {/* ========================================================================= */}
      {/* MAIN LAYOUT: VERTICAL PIPELINE (LEFT 8 COLS) + SIDE PANEL (RIGHT 4 COLS) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* VERTICAL INTERPRETATION PIPELINE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 space-y-4">
          {/* ----------------------------------------------------------------- */}
          {/* STAGE 1: VERIFIED BRAHMI SCRIPT STREAM */}
          {/* ----------------------------------------------------------------- */}
          <Card variant="archival" className="p-6 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase">Stage 01</span>
                <h3 className="font-serif text-lg font-medium text-white">Verified Brahmi Inscription Stream</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="solid" icon={<ShieldCheck className="w-3 h-3" />}>
                  Human Verified
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copiedStage === 'brahmi' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy('brahmi', record.ocr.rawBrahmiLine)}
                >
                  {copiedStage === 'brahmi' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded border border-zinc-800 text-white font-serif text-3xl tracking-widest leading-loose overflow-x-auto">
              {record.ocr.rawBrahmiLine}
            </div>
            <p className="text-[11px] font-mono text-zinc-400">Target Script: {record.metadata.script} (Unicode hex stack)</p>
          </Card>

          {/* DOWN ARROW CONNECTOR */}
          <div className="flex justify-center my-1 text-zinc-500">
            <div className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* STAGE 2: TRANSLITERATION (IAST & DEVANAGARI) */}
          {/* ----------------------------------------------------------------- */}
          <Card variant="default" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase">Stage 02</span>
                <h3 className="font-serif text-lg font-medium text-white">Phonetic Transliteration (IAST & Devanagari)</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="solid" icon={<ShieldCheck className="w-3 h-3" />}>
                  Human Verified
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copiedStage === 'iast' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy('iast', currentIast)}
                >
                  {copiedStage === 'iast' ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={editingStage === 'iast' ? <Save className="w-3.5 h-3.5 text-white" /> : <Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => (editingStage === 'iast' ? handleSaveEdit('iast') : setEditingStage('iast'))}
                >
                  {editingStage === 'iast' ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>

            {editingStage === 'iast' ? (
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-300">Edit IAST Transliteration:</label>
                <textarea
                  rows={2}
                  value={currentIast}
                  onChange={(e) => setEditableIast(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white font-mono text-sm focus:outline-none focus:border-zinc-400"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-zinc-950 rounded border border-zinc-800 font-mono text-base text-white font-semibold leading-relaxed">
                  {currentIast}
                </div>
                <div className="p-3 bg-zinc-950/60 rounded border border-zinc-800 font-sans text-sm text-zinc-300">
                  Devanagari Standard: <span className="font-bold text-white font-serif text-base ml-2">{record.transliteration.devanagariText}</span>
                </div>
              </div>
            )}

            {/* Word-by-word Breakdown Table */}
            <div className="pt-2 border-t border-zinc-800/80 space-y-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase font-semibold block">Lexical Word Breakdown</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950 text-white">
                      <th className="p-2">Brahmi</th>
                      <th className="p-2">IAST</th>
                      <th className="p-2">Devanagari</th>
                      <th className="p-2">Lexical Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {record.transliteration.wordSegmentation.map((w, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/50">
                        <td className="p-2 font-serif text-lg text-white">{w.brahmiWord}</td>
                        <td className="p-2 text-zinc-200 font-semibold">{w.iastWord}</td>
                        <td className="p-2 text-zinc-300">{w.devanagariWord}</td>
                        <td className="p-2 text-zinc-400 font-sans text-xs">{w.meaningSummary}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>

          {/* DOWN ARROW CONNECTOR */}
          <div className="flex justify-center my-1 text-zinc-500">
            <div className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* STAGE 3: HINDI TRANSLATION (हिंदी अनुवाद) */}
          {/* ----------------------------------------------------------------- */}
          <Card variant="default" className="p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase">Stage 03</span>
                <h3 className="font-serif text-lg font-medium text-white">हिंदी अनुवाद (Hindi Translation)</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" icon={<Sparkles className="w-3 h-3" />}>
                  AI Generated
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copiedStage === 'hindi' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy('hindi', currentHindi)}
                >
                  {copiedStage === 'hindi' ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={editingStage === 'hindi' ? <Save className="w-3.5 h-3.5 text-white" /> : <Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => (editingStage === 'hindi' ? handleSaveEdit('hindi') : setEditingStage('hindi'))}
                >
                  {editingStage === 'hindi' ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>

            {editingStage === 'hindi' ? (
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-300">Edit Hindi Translation:</label>
                <textarea
                  rows={3}
                  value={currentHindi}
                  onChange={(e) => setEditableHindi(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white font-serif text-base focus:outline-none focus:border-zinc-400"
                />
              </div>
            ) : (
              <p className="font-serif text-lg text-white leading-relaxed p-4 bg-zinc-950 rounded border border-zinc-800">
                "{currentHindi}"
              </p>
            )}
          </Card>

          {/* DOWN ARROW CONNECTOR */}
          <div className="flex justify-center my-1 text-zinc-500">
            <div className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* STAGE 4: ENGLISH TRANSLATION */}
          {/* ----------------------------------------------------------------- */}
          <Card variant="default" className="p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase">Stage 04</span>
                <h3 className="font-serif text-lg font-medium text-white">English Translation</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="outline" icon={<Sparkles className="w-3 h-3" />}>
                  AI Generated
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copiedStage === 'english' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy('english', currentEnglish)}
                >
                  {copiedStage === 'english' ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={editingStage === 'english' ? <Save className="w-3.5 h-3.5 text-white" /> : <Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => (editingStage === 'english' ? handleSaveEdit('english') : setEditingStage('english'))}
                >
                  {editingStage === 'english' ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>

            {editingStage === 'english' ? (
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-300">Edit English Translation:</label>
                <textarea
                  rows={3}
                  value={currentEnglish}
                  onChange={(e) => setEditableEnglish(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-white font-serif text-base focus:outline-none focus:border-zinc-400"
                />
              </div>
            ) : (
              <p className="font-serif text-base text-zinc-200 leading-relaxed italic p-4 bg-zinc-950 rounded border border-zinc-800">
                "{currentEnglish}"
              </p>
            )}
          </Card>

          {/* DOWN ARROW CONNECTOR */}
          <div className="flex justify-center my-1 text-zinc-500">
            <div className="p-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* STAGE 5: CONTEXTUAL & HISTORICAL EXPLANATION */}
          {/* ----------------------------------------------------------------- */}
          <Card variant="archival" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-zinc-400 font-bold uppercase">Stage 05</span>
                <h3 className="font-serif text-lg font-medium text-white">Contextual & Historical Explanation</h3>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="neutral" icon={<Sparkles className="w-3 h-3" />}>
                  AI Context Engine
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={copiedStage === 'context' ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={() => handleCopy('context', currentContext)}
                >
                  {copiedStage === 'context' ? 'Copied!' : 'Copy'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={editingStage === 'context' ? <Save className="w-3.5 h-3.5 text-white" /> : <Edit2 className="w-3.5 h-3.5" />}
                  onClick={() => (editingStage === 'context' ? handleSaveEdit('context') : setEditingStage('context'))}
                >
                  {editingStage === 'context' ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>

            {editingStage === 'context' ? (
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-300">Edit Context Summary:</label>
                <textarea
                  rows={4}
                  value={currentContext}
                  onChange={(e) => setEditableContext(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded p-3 text-zinc-200 font-sans text-xs leading-relaxed focus:outline-none focus:border-zinc-400"
                />
              </div>
            ) : (
              <p className="text-xs font-sans text-zinc-300 leading-relaxed p-4 bg-zinc-950 rounded border border-zinc-800">
                {currentContext}
              </p>
            )}

            {/* Metadata Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-zinc-800 font-mono text-xs">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Reign & Sovereign</span>
                <span className="text-white font-semibold">{record.translation.historicalContext.reignOf}</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Geopolitical Importance</span>
                <span className="text-white font-semibold">{record.translation.historicalContext.geopoliticalSignificance}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* SIDE PANEL: CONFIDENCE, SOURCE IMAGE, VERIFICATION & PROCESSING SPECS */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6 sticky top-20">
          <Card variant="archival" className="p-5 space-y-5">
            <h3 className="font-serif text-lg text-white font-medium border-b border-zinc-800 pb-2">
              Epigraphical Telemetry & Provenance
            </h3>

            {/* 1. Source Image Thumbnail Preview */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                Source Inscription Capture
              </span>
              <div
                onClick={() => setIsImageModalOpen(true)}
                className="relative group rounded border border-zinc-800 overflow-hidden cursor-pointer"
              >
                <img
                  src={record.metadata.imageUrl}
                  alt={record.metadata.title}
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/20 transition-colors flex items-center justify-center text-white opacity-0 group-hover:opacity-100">
                  <Eye className="w-6 h-6" />
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 block">Click image to inspect high-res scan</span>
            </div>

            {/* 2. Confidence Rating Meter */}
            <div className="space-y-2 pt-3 border-t border-zinc-800">
              <div className="flex justify-between text-xs font-mono text-zinc-300">
                <span>Neural OCR Confidence</span>
                <span className="text-white font-bold">{record.ocr.averageConfidence.toFixed(1)}%</span>
              </div>
              <Progress value={record.ocr.averageConfidence} size="md" variant="neutral" />
            </div>

            {/* 3. Verification Status */}
            <div className="space-y-2 pt-3 border-t border-zinc-800 font-mono text-xs">
              <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Verification Status</span>
              <div className="flex items-center justify-between p-2.5 bg-zinc-950 rounded border border-zinc-800">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-white" />
                  <span className="text-zinc-200 font-semibold">
                    {record.verification.isVerified ? 'Verified Record' : 'Pending Review'}
                  </span>
                </div>
                <Badge variant={record.verification.isVerified ? 'solid' : 'outline'}>
                  {record.verification.isVerified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
              {record.verification.verifiedBy && (
                <p className="text-[11px] text-zinc-400 font-sans">
                  Reviewed by {record.verification.verifiedBy} on {record.verification.verificationDate}
                </p>
              )}
            </div>

            {/* 4. Processing & Provenance Information */}
            <div className="space-y-2 pt-3 border-t border-zinc-800 font-mono text-xs">
              <span className="text-zinc-400 uppercase text-[10px] font-semibold block">Processing & Catalog Specs</span>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Corpus ID:</span>
                  <span className="text-white font-bold">{record.metadata.corpusCatalogId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Script Variant:</span>
                  <span className="text-zinc-200">{record.metadata.script}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Period/Century:</span>
                  <span className="text-zinc-300">{record.metadata.estimatedCentury}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">NMT Translation Engine:</span>
                  <span className="text-zinc-100 font-semibold">FastAPI Philological NMT v1</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Source Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        title={record.metadata.title}
        subtitle={record.metadata.provenance}
        maxWidth="2xl"
      >
        <div className="p-2 bg-zinc-950 rounded border border-zinc-800 flex justify-center">
          <img
            src={record.metadata.imageUrl}
            alt={record.metadata.title}
            className="max-h-[70vh] object-contain rounded"
          />
        </div>
      </Modal>
    </div>
  );
};
