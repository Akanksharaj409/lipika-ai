import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ImageViewer } from '../components/ui/ImageViewer';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { usePipelineContext } from '../layouts/MainLayout';
import { CharacterSegment } from '../types/inscription';

export const Results: React.FC = () => {
  const { record, selectedGlyph, setSelectedGlyph } = usePipelineContext();
  const navigate = useNavigate();

  const [filterUncertainOnly, setFilterUncertainOnly] = useState(false);

  if (!record) return null;

  const segments = record.ocr.segments || [];
  const totalDetected = segments.length;
  const avgConfidence = record.ocr.averageConfidence || 94.6;
  const lowConfCount = segments.filter((s) => s.confidence < 90).length;

  const displayedSegments = filterUncertainOnly
    ? segments.filter((seg) => seg.confidence < 90)
    : segments;

  const activeSegment = selectedGlyph || segments[0];

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-400 font-medium">
              {record.metadata.corpusCatalogId}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400">{record.metadata.script}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight mt-0.5">
            OCR Studio
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" onClick={() => navigate('/analyze')}>
            Rescan
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/verification')}
          >
            Verify Characters
          </Button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg text-xs font-mono">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-zinc-500">Glyphs: </span>
            <span className="text-white font-bold">{totalDetected}</span>
          </div>
          <div>
            <span className="text-zinc-500">Avg Confidence: </span>
            <span className="text-white font-bold">{avgConfidence.toFixed(1)}%</span>
          </div>
          <div>
            <span className="text-zinc-500">Uncertain: </span>
            <span className={`font-bold ${lowConfCount > 0 ? 'text-zinc-300' : 'text-zinc-500'}`}>
              {lowConfCount}
            </span>
          </div>
        </div>

        {lowConfCount > 0 && (
          <button
            onClick={() => setFilterUncertainOnly(!filterUncertainOnly)}
            className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
              filterUncertainOnly
                ? 'bg-white text-black font-medium'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>{filterUncertainOnly ? 'Showing Uncertain' : `Review ${lowConfCount} Uncertain`}</span>
          </button>
        )}
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Inscription Image Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card variant="default" className="p-3">
            <ImageViewer
              imageUrl={record.metadata.imageUrl}
              segments={segments}
              selectedGlyphId={activeSegment?.id}
              onGlyphSelect={setSelectedGlyph}
              enhancementConfig={record.enhancement}
            />
          </Card>

          {/* Decoded Stream Summary */}
          <Card variant="default" className="p-4 space-y-2">
            <span className="text-xs font-mono text-zinc-500 block uppercase">
              Predicted Stream
            </span>
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800/80">
              <p className="font-serif text-2xl text-white tracking-widest">
                {record.ocr.rawBrahmiLine}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs font-mono text-zinc-400">
                <span>IAST: <strong className="text-white">{record.transliteration.iastText}</strong></span>
                <span>•</span>
                <span>Devanagari: <strong className="text-white">{record.transliteration.devanagariText}</strong></span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right: Clean Character List & Detail Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Glyph Inspector */}
          {activeSegment && (
            <Card variant="default" className="p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="text-xs font-mono text-zinc-400 font-medium">
                  Glyph Details ({activeSegment.id})
                </span>
                <ConfidenceBadge confidence={activeSegment.confidence} size="sm" />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center font-serif text-4xl font-bold text-white shrink-0">
                  {activeSegment.correctedChar || activeSegment.brahmiChar}
                </div>
                <div className="space-y-1 text-xs font-mono">
                  <p className="text-zinc-400">
                    Phonetic IAST: <span className="text-white font-bold">{activeSegment.phoneticIAST}</span>
                  </p>
                  <p className="text-zinc-400">
                    Devanagari: <span className="text-zinc-200">{activeSegment.devanagariEquiv}</span>
                  </p>
                  <p className="text-zinc-500 text-[11px]">
                    Unicode: {activeSegment.unicodeHex}
                  </p>
                </div>
              </div>

              {/* Alternatives (if any) */}
              {activeSegment.alternatives.length > 0 && (
                <div className="pt-2 border-t border-zinc-800/80 space-y-1.5">
                  <span className="text-[11px] font-mono text-zinc-500 block">
                    Alternative Predictions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSegment.alternatives.map((alt) => (
                      <span
                        key={alt.unicode}
                        className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-300"
                      >
                        {alt.char} ({alt.iast}) • {alt.confidence}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Compact Characters List */}
          <div className="space-y-1.5 max-h-[440px] overflow-y-auto pr-1">
            <span className="text-xs font-mono text-zinc-500 block px-1">
              All Characters ({displayedSegments.length})
            </span>
            {displayedSegments.map((seg, idx) => {
              const isSelected = activeSegment?.id === seg.id;
              return (
                <div
                  key={seg.id}
                  onClick={() => setSelectedGlyph(seg)}
                  className={`p-2.5 rounded border transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-900 border-zinc-600 text-white'
                      : 'bg-zinc-950 hover:bg-zinc-900/50 border-zinc-800/80 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl font-bold w-6 text-center text-white">
                      {seg.correctedChar || seg.brahmiChar}
                    </span>
                    <span className="font-mono text-xs text-zinc-400">
                      #{idx + 1} • <strong className="text-white">{seg.phoneticIAST}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-zinc-400">
                      {seg.confidence.toFixed(0)}%
                    </span>
                    {seg.confidence < 90 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" title="Review recommended" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
