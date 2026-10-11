import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  Check,
  Edit2,
  Save,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { usePipelineContext } from '../layouts/MainLayout';
import { translationService } from '../services/translationService';

export const Translation: React.FC = () => {
  const { record, setRecord } = usePipelineContext();
  const navigate = useNavigate();

  const [copiedStage, setCopiedStage] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const [showWordBreakdown, setShowWordBreakdown] = useState(false);

  const [editableEnglish, setEditableEnglish] = useState('');
  const [editableHindi, setEditableHindi] = useState('');

  if (!record) return null;

  const currentEnglish = editableEnglish || record.translation.englishTranslation;
  const currentHindi = editableHindi || record.translation.hindiTranslation;

  const handleCopy = async (key: string, text: string) => {
    const success = await translationService.copyToClipboard(text);
    if (success) {
      setCopiedStage(key);
      setTimeout(() => setCopiedStage(null), 2000);
    }
  };

  const handleSaveEdit = (key: string) => {
    setRecord((prev) => {
      if (!prev) return null;
      const updated = { ...prev };
      if (key === 'english') {
        updated.translation.englishTranslation = currentEnglish;
      } else if (key === 'hindi') {
        updated.translation.hindiTranslation = currentHindi;
      }
      return updated;
    });
    setEditingStage(null);
  };

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <span>{record.metadata.corpusCatalogId}</span>
            <span>•</span>
            <span>{record.metadata.period}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight mt-0.5">
            Translation & Meaning
          </h1>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => navigate('/history')}
        >
          Export & Catalog
        </Button>
      </div>

      {/* Card 1: Original Inscription & Transliteration */}
      <Card variant="default" className="p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
          <span className="text-xs font-mono text-zinc-400 font-medium">
            Decoded Brahmi & Phonetics
          </span>
          <Button
            variant="ghost"
            size="sm"
            icon={copiedStage === 'brahmi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            onClick={() => handleCopy('brahmi', record.ocr.rawBrahmiLine)}
          >
            {copiedStage === 'brahmi' ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <div className="p-4 bg-zinc-950 rounded border border-zinc-800/80">
          <p className="font-serif text-3xl text-white tracking-widest leading-relaxed overflow-x-auto">
            {record.ocr.rawBrahmiLine}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs font-mono text-zinc-400 pt-2 border-t border-zinc-900">
            <div>IAST: <strong className="text-white">{record.transliteration.iastText}</strong></div>
            <div>Devanagari: <strong className="text-white">{record.transliteration.devanagariText}</strong></div>
          </div>
        </div>

        {/* Optional Collapsible Lexical Breakdown */}
        <div>
          <button
            onClick={() => setShowWordBreakdown(!showWordBreakdown)}
            className="text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>{showWordBreakdown ? 'Hide' : 'Show'} Lexical Word Breakdown</span>
            {showWordBreakdown ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showWordBreakdown && (
            <div className="mt-3 overflow-x-auto border border-zinc-800 rounded bg-zinc-950">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-900/50">
                    <th className="p-2.5">Brahmi</th>
                    <th className="p-2.5">IAST</th>
                    <th className="p-2.5">Devanagari</th>
                    <th className="p-2.5">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {record.transliteration.wordSegmentation.map((w, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/30">
                      <td className="p-2.5 font-serif text-lg text-white">{w.brahmiWord}</td>
                      <td className="p-2.5 text-zinc-300 font-semibold">{w.iastWord}</td>
                      <td className="p-2.5 text-zinc-400">{w.devanagariWord}</td>
                      <td className="p-2.5 text-zinc-400 font-sans">{w.meaningSummary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Card 2: Translations (English & Hindi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* English Translation */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono text-zinc-400 font-medium">English Translation</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                icon={copiedStage === 'english' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => handleCopy('english', currentEnglish)}
              >
                {copiedStage === 'english' ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={editingStage === 'english' ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                onClick={() => (editingStage === 'english' ? handleSaveEdit('english') : setEditingStage('english'))}
              >
                {editingStage === 'english' ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>

          {editingStage === 'english' ? (
            <textarea
              rows={3}
              value={currentEnglish}
              onChange={(e) => setEditableEnglish(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white font-sans text-sm focus:outline-none focus:border-zinc-500"
            />
          ) : (
            <p className="font-sans text-sm text-zinc-200 leading-relaxed italic p-3 bg-zinc-950 rounded border border-zinc-800/80">
              "{currentEnglish}"
            </p>
          )}
        </Card>

        {/* Hindi Translation */}
        <Card variant="default" className="p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-mono text-zinc-400 font-medium">हिंदी अनुवाद (Hindi)</span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                icon={copiedStage === 'hindi' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                onClick={() => handleCopy('hindi', currentHindi)}
              >
                {copiedStage === 'hindi' ? 'Copied' : 'Copy'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={editingStage === 'hindi' ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                onClick={() => (editingStage === 'hindi' ? handleSaveEdit('hindi') : setEditingStage('hindi'))}
              >
                {editingStage === 'hindi' ? 'Save' : 'Edit'}
              </Button>
            </div>
          </div>

          {editingStage === 'hindi' ? (
            <textarea
              rows={3}
              value={currentHindi}
              onChange={(e) => setEditableHindi(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-white font-serif text-sm focus:outline-none focus:border-zinc-500"
            />
          ) : (
            <p className="font-serif text-sm text-zinc-200 leading-relaxed p-3 bg-zinc-950 rounded border border-zinc-800/80">
              "{currentHindi}"
            </p>
          )}
        </Card>
      </div>

      {/* Card 3: Historical Context */}
      <Card variant="default" className="p-5 space-y-3">
        <div className="border-b border-zinc-800 pb-2">
          <span className="text-xs font-mono text-zinc-400 font-medium">Historical Context & Commentary</span>
        </div>
        <p className="text-xs text-zinc-300 font-sans leading-relaxed">
          {record.translation.historicalContext.summary}
        </p>
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-zinc-400">
          <span>Reign: <strong className="text-white">{record.translation.historicalContext.reignOf}</strong></span>
          <span>•</span>
          <span>Significance: <strong className="text-white">{record.translation.historicalContext.geopoliticalSignificance}</strong></span>
        </div>
      </Card>
    </div>
  );
};
