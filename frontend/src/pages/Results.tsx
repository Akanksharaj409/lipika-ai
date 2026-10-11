import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Filter,
  Layers,
  Clock,
  Cpu,
  Edit3,
  Search,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ImageViewer } from '../components/ui/ImageViewer';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { Progress } from '../components/ui/Progress';
import { usePipelineContext } from '../layouts/MainLayout';
import { CharacterSegment } from '../types/inscription';

export const Results: React.FC = () => {
  const { record, selectedGlyph, setSelectedGlyph } = usePipelineContext();
  const navigate = useNavigate();

  // Filter state for "Review uncertain characters"
  const [filterUncertainOnly, setFilterUncertainOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!record) return null;

  const segments = record.ocr.segments || [];

  // Summary Metrics Computation
  const totalDetected = segments.length;
  const avgConfidence = record.ocr.averageConfidence || 94.6;
  const lowConfSegments = segments.filter((s) => s.confidence < 90);
  const lowConfCount = lowConfSegments.length;
  const processingTimeMs = 340; // Simulated inference latency in ms

  // Filtered segments array (Dynamic rendering)
  const displayedSegments = segments.filter((seg) => {
    const matchesUncertain = filterUncertainOnly ? seg.confidence < 90 : true;
    const matchesSearch =
      searchQuery === '' ||
      seg.brahmiChar.includes(searchQuery) ||
      seg.phoneticIAST.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.unicodeHex.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seg.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesUncertain && matchesSearch;
  });

  return (
    <div className="space-y-6 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Pipeline Step 04</Badge>
            <span className="text-xs font-mono text-zinc-400">ResNet Brahmi Neural Classifier</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-white flex items-center gap-3 mt-1">
            <FileCheck2 className="w-7 h-7 text-zinc-300" />
            Brahmi OCR Results & Glyph Workspace
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate('/analyze')}>
            Back to Image Scan
          </Button>
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/verification')}
          >
            Human Verification & Correction
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TOP SUMMARY BAR */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Characters Detected */}
        <Card variant="glass" className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-zinc-400 block uppercase">Characters Detected</span>
            <span className="text-2xl font-mono font-bold text-white">{totalDetected} Glyphs</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-white">
            <Layers className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 2: Average Confidence */}
        <Card variant="glass" className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-zinc-400 block uppercase">Average Confidence</span>
            <span className="text-2xl font-mono font-bold text-white">{avgConfidence.toFixed(1)}%</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 3: Low-Confidence Count */}
        <Card variant="glass" className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-zinc-400 block uppercase">Low-Confidence Glyphs</span>
            <span className={`text-2xl font-mono font-bold ${lowConfCount > 0 ? 'text-white' : 'text-zinc-500'}`}>
              {lowConfCount} Uncertain
            </span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-300">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>

        {/* Metric 4: Processing Time */}
        <Card variant="glass" className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-mono text-zinc-400 block uppercase">Neural Processing Time</span>
            <span className="text-2xl font-mono font-bold text-zinc-300">{processingTimeMs} ms</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Filter / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Review Uncertain Characters Button */}
          <Button
            variant={filterUncertainOnly ? 'primary' : 'outline'}
            size="sm"
            icon={<AlertTriangle className="w-4 h-4" />}
            onClick={() => setFilterUncertainOnly(!filterUncertainOnly)}
          >
            {filterUncertainOnly ? 'Showing Uncertain Only' : 'Review Uncertain Characters'}
            {lowConfCount > 0 && <span className="ml-1 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] text-white">{lowConfCount}</span>}
          </Button>

          {filterUncertainOnly && (
            <Button variant="ghost" size="sm" onClick={() => setFilterUncertainOnly(false)}>
              Reset Filter
            </Button>
          )}
        </div>

        {/* Search Input */}
        <div className="w-full sm:w-64 bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search character or IAST..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN TWO-PANEL WORKSPACE */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========================================================================= */}
        {/* LEFT PANEL: INSCRIPTION CANVAS WITH ZOOM, PAN, RESET, FULLSCREEN, CROP */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <Card variant="default" className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-medium text-white">Inscription Inspection Canvas</h3>
              <Badge variant="neutral">{record.metadata.script}</Badge>
            </div>

            <ImageViewer
              imageUrl={record.metadata.imageUrl}
              segments={segments}
              selectedGlyphId={selectedGlyph?.id}
              onGlyphSelect={setSelectedGlyph}
              enhancementConfig={record.enhancement}
            />
          </Card>

          {/* Raw Brahmi Line Output Box */}
          <Card variant="archival" className="p-4 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold block">
              Raw Predicted Brahmi Character Stream
            </span>
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-white font-serif text-2xl tracking-widest leading-relaxed overflow-x-auto">
              {record.ocr.rawBrahmiLine}
            </div>
          </Card>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: DETECTED BRAHMI CHARACTERS STREAM (DYNAMICALLY RENDERED) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-serif text-lg font-medium text-white">
              Detected Character Predictions ({displayedSegments.length})
            </h3>
            <span className="text-xs font-mono text-zinc-400">High / Medium / Low Rating</span>
          </div>

          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {displayedSegments.length === 0 ? (
              <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-lg text-center font-mono text-xs text-zinc-400">
                No glyphs match the selected filter query.
              </div>
            ) : (
              displayedSegments.map((seg, idx) => {
                const isSelected = selectedGlyph?.id === seg.id;
                const isLowConf = seg.confidence < 70;
                const isMedConf = seg.confidence >= 70 && seg.confidence < 90;
                const isHighConf = seg.confidence >= 90;

                const confLabel = isHighConf ? 'High' : isMedConf ? 'Medium' : 'Low';
                const confColorClass = isHighConf
                  ? 'border-zinc-700 bg-zinc-900 text-white'
                  : isMedConf
                  ? 'border-zinc-800 bg-zinc-900/80 text-zinc-300'
                  : 'border-zinc-700 bg-zinc-900 text-zinc-400 border-dashed';

                return (
                  <Card
                    key={seg.id}
                    variant={isSelected ? 'archival' : 'default'}
                    onClick={() => setSelectedGlyph(seg)}
                    className={`cursor-pointer transition-all duration-150 p-4 space-y-3 ${
                      isSelected
                        ? 'ring-2 ring-white border-zinc-400'
                        : isLowConf
                        ? 'border-zinc-700 bg-zinc-950/60 hover:border-zinc-500'
                        : 'hover:border-zinc-700'
                    }`}
                  >
                    {/* Character Card Top Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Large Glyph Box */}
                        <div className="w-12 h-12 rounded bg-zinc-950 border border-zinc-800 flex items-center justify-center font-serif text-3xl font-bold text-white shrink-0">
                          {seg.correctedChar || seg.brahmiChar}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-white">
                              Character {String(idx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">({seg.id})</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-sans text-xs text-zinc-300">
                              IAST: <strong className="text-white font-mono">{seg.phoneticIAST}</strong>
                            </span>
                            <span className="text-zinc-600">•</span>
                            <span className="font-sans text-xs text-zinc-400">Devanagari: {seg.devanagariEquiv}</span>
                          </div>
                        </div>
                      </div>

                      {/* Confidence Rating Badge */}
                      <div className="text-right space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded border ${confColorClass}`}
                        >
                          {isLowConf && <AlertTriangle className="w-3 h-3 text-zinc-400" />}
                          {confLabel} ({seg.confidence.toFixed(0)}%)
                        </span>
                        <span className="font-mono text-[10px] text-zinc-500 block">{seg.unicodeHex}</span>
                      </div>
                    </div>

                    {/* Bounding Box Information */}
                    <div className="p-2 bg-zinc-950 rounded border border-zinc-800/80 flex items-center justify-between font-mono text-[11px] text-zinc-400">
                      <span>Bounding Geometry:</span>
                      <span className="text-white">
                        x: {seg.x.toFixed(1)}%, y: {seg.y.toFixed(1)}%, w: {seg.width.toFixed(1)}%, h: {seg.height.toFixed(1)}%
                      </span>
                    </div>

                    {/* Top Alternative Predictions */}
                    {seg.alternatives.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold block">
                          Top Alternative Neural Predictions
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {seg.alternatives.map((alt) => (
                            <div
                              key={alt.unicode}
                              className="px-2 py-1 bg-zinc-950 border border-zinc-800 rounded font-mono text-xs flex items-center gap-1.5"
                            >
                              <span className="font-serif text-base text-white">{alt.char}</span>
                              <span className="text-zinc-400">({alt.iast})</span>
                              <span className="text-zinc-200 font-semibold">{alt.confidence}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
