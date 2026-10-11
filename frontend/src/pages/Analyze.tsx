import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  Upload,
  FileImage,
  Trash2,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  FileCheck2,
  Languages,
  BookOpenCheck,
  ArrowRight,
  Database,
  X,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Progress } from '../components/ui/Progress';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { usePipelineContext } from '../layouts/MainLayout';
import {
  analysisService,
  AnalysisSession,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from '../services/analysisService';
import { MOCK_INSCRIPTIONS } from '../data/mockInscriptions';

export const Analyze: React.FC = () => {
  const { setRecord, setActiveId } = usePipelineContext();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Analysis Session State
  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Zoom Canvas State
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // =========================================================================
  // FILE HANDLERS
  // =========================================================================
  const handleFileSelect = (file: File) => {
    setValidationError(null);
    const validation = analysisService.validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file.');
      return;
    }

    const newSession = analysisService.createSessionFromFile(file);
    setSession(newSession);
    setZoomLevel(100);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    if (session) {
      analysisService.cancelPipeline(session.sessionId);
    }
    setSession(null);
    setValidationError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = (sampleId: string) => {
    const sampleRecord = MOCK_INSCRIPTIONS.find((i) => i.metadata.id === sampleId) || MOCK_INSCRIPTIONS[0];
    const newSession = analysisService.createSessionFromSample(sampleRecord);
    setSession(newSession);
    setActiveId(sampleRecord.metadata.id);
    setValidationError(null);
    setZoomLevel(100);
  };

  // =========================================================================
  // PIPELINE PROCESSOR & RETRY ACTION
  // =========================================================================
  const handleStartAnalysis = async () => {
    if (!session || session.isProcessing) return;

    try {
      await analysisService.runPipeline(session, (updatedSession) => {
        setSession({ ...updatedSession });
        if (updatedSession.resultRecord) {
          setRecord(updatedSession.resultRecord);
          setActiveId(updatedSession.resultRecord.metadata.id);
        }
      });
    } catch (err) {
      // Error state handled inside session.error
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Pipeline Step 01–07</Badge>
            <span className="text-xs font-mono text-zinc-400">FastAPI & OpenCV Neural Inference Engine</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-white flex items-center gap-3 mt-1">
            <ScanLine className="w-7 h-7 text-zinc-300" />
            Inscription Scan & Analysis Canvas
          </h1>
        </div>

        {session?.isComplete && (
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/results')}
          >
            Open Brahmi OCR Studio
          </Button>
        )}
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-between text-zinc-200 text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button onClick={() => setValidationError(null)} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STATE 1: UPLOAD DROPZONE */}
      {/* ========================================================================= */}
      {!session && (
        <div className="space-y-8">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-10 sm:p-14 text-center transition-all duration-200 flex flex-col items-center justify-center space-y-4 ${
              dragActive
                ? 'border-white bg-zinc-900/60 scale-[1.005]'
                : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950/60 hover:bg-zinc-900/40'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <Upload className="w-8 h-8 stroke-[1.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-xl text-white font-medium">
                Upload Ancient Brahmi Inscription Capture
              </h3>
              <p className="text-xs text-zinc-400 font-sans max-w-md mx-auto">
                Drag and drop your high-resolution stone rubbing or multispectral photo, or click below to select a file.
              </p>
            </div>

            {/* Allowed Formats & Max Size Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Badge variant="neutral">JPG</Badge>
              <Badge variant="neutral">JPEG</Badge>
              <Badge variant="neutral">PNG</Badge>
              <Badge variant="neutral">WEBP</Badge>
              <span className="text-zinc-600 font-mono text-xs">|</span>
              <span className="text-zinc-300 font-mono text-xs font-semibold">Max File Size: 15 MB</span>
            </div>

            <div className="pt-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              <Button
                variant="primary"
                size="lg"
                icon={<FileImage className="w-5 h-5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Local Files
              </Button>
            </div>
          </div>

          {/* Quick Pre-loaded Samples Loader */}
          <Card variant="archival" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-zinc-300" />
                <h4 className="font-serif text-lg text-white font-medium">Or Select Authentic Archival Sample</h4>
              </div>
              <span className="text-xs font-mono text-zinc-400">Pre-indexed in CII Corpus</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_INSCRIPTIONS.map((item) => (
                <div
                  key={item.metadata.id}
                  onClick={() => handleLoadSample(item.metadata.id)}
                  className="p-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-500 rounded-lg cursor-pointer transition-all flex items-center gap-3 group"
                >
                  <img
                    src={item.metadata.imageUrl}
                    alt={item.metadata.title}
                    className="w-14 h-14 rounded object-cover border border-zinc-800 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="overflow-hidden">
                    <span className="font-mono text-[10px] text-zinc-300 font-semibold block">
                      {item.metadata.corpusCatalogId}
                    </span>
                    <h5 className="font-serif text-xs font-medium text-white truncate">{item.metadata.title}</h5>
                    <span className="text-[10px] font-mono text-zinc-400 block">{item.metadata.script}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STATE 2, 3 & 4: IMAGE PREVIEW, PROCESSING, ERROR & SUCCESS STATES */}
      {/* ========================================================================= */}
      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Image Preview Canvas */}
          <div className="lg:col-span-7 space-y-4">
            <Card variant="default" className="space-y-4">
              {/* Canvas Header Toolbar */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs font-mono">
                <div className="flex items-center gap-2 truncate max-w-[60%]">
                  <FileImage className="w-4 h-4 text-zinc-300 shrink-0" />
                  <span className="text-white truncate font-semibold">{session.fileName}</span>
                  <span className="text-zinc-500">({(session.fileSize / (1024 * 1024)).toFixed(2)} MB)</span>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoomLevel((z) => Math.min(250, z + 25))}
                    className="h-7 w-7 p-0"
                    aria-label="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </Button>
                  <span className="text-[11px] text-zinc-300 w-10 text-center">{zoomLevel}%</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoomLevel((z) => Math.max(75, z - 25))}
                    className="h-7 w-7 p-0"
                    aria-label="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoomLevel(100)}
                    className="h-7 w-7 p-0 text-zinc-400"
                    aria-label="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Viewport Box */}
              <div className="relative h-[380px] bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden flex items-center justify-center p-4 bg-grid-pattern">
                <img
                  src={session.previewUrl}
                  alt="Uploaded Inscription Preview"
                  className="max-h-[340px] object-contain rounded transition-transform duration-200 select-none"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                />

                {/* Scanner Overlay Animation during processing */}
                {session.isProcessing && (
                  <div className="absolute inset-0 bg-white/5 pointer-events-none flex flex-col justify-between">
                    <motion.div
                      animate={{ y: [0, 360, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg shadow-white/30"
                    />
                  </div>
                )}
              </div>

              {/* Image Actions Bar */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={handleRemoveImage}
                    disabled={session.isProcessing}
                  >
                    Remove Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={session.isProcessing}
                  >
                    Replace Image
                  </Button>
                </div>

                {!session.isProcessing && !session.isComplete && (
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Play className="w-4 h-4" />}
                    onClick={handleStartAnalysis}
                  >
                    {session.error ? 'Retry AI Analysis' : 'Start AI Analysis'}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: 7-Step Pipeline Telemetry & Error / Success States */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="archival" className="space-y-5">
              <div className="flex items-center justify-between border-zinc-800 border-b pb-3">
                <div>
                  <span className="font-mono text-xs text-zinc-400 font-semibold">FastAPI Pipeline Status</span>
                  <h3 className="font-serif text-lg font-medium text-white mt-0.5">7-Stage AI Sequence</h3>
                </div>
                {session.isProcessing && (
                  <span className="text-xs font-mono text-white animate-pulse flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    Analyzing Image...
                  </span>
                )}
                {session.isComplete && <Badge variant="solid">Analysis Complete</Badge>}
                {session.error && <Badge variant="outline">Analysis Failed</Badge>}
              </div>

              {/* ERROR STATE ALERT & RETRY ACTION */}
              {session.error && (
                <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-5 h-5 text-zinc-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-mono text-xs font-bold text-white">Analysis Error</h4>
                      <p className="text-xs font-sans text-zinc-300 mt-1 leading-relaxed">{session.error}</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    icon={<RefreshCw className="w-4 h-4" />}
                    onClick={handleStartAnalysis}
                  >
                    Retry AI Analysis
                  </Button>
                </div>
              )}

              {/* Overall Progress Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-zinc-300">
                  <span>Overall Pipeline Completion</span>
                  <span className="text-white font-bold">{session.overallProgress}%</span>
                </div>
                <Progress value={session.overallProgress} size="md" variant="neutral" />
              </div>

              {/* 7 Individual Steps */}
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {session.steps.map((st) => {
                  const isDone = st.status === 'completed';
                  const isProc = st.status === 'processing';
                  const isErr = st.status === 'error';

                  return (
                    <div
                      key={st.key}
                      className={`p-3 rounded border transition-all ${
                        isErr
                          ? 'bg-zinc-900/80 border-zinc-700'
                          : isProc
                          ? 'bg-zinc-900 border-zinc-500 ring-1 ring-zinc-500/40'
                          : isDone
                          ? 'bg-zinc-950 border-zinc-800 opacity-90'
                          : 'bg-zinc-950/40 border-zinc-900 opacity-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                          ) : isProc ? (
                            <Cpu className="w-4 h-4 text-zinc-300 animate-spin shrink-0" />
                          ) : isErr ? (
                            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
                          )}
                          <span
                            className={`font-mono text-xs font-semibold ${
                              isProc ? 'text-white' : isDone ? 'text-zinc-200' : isErr ? 'text-zinc-300' : 'text-zinc-500'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-400">{st.progress}%</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-sans leading-relaxed pl-6">{st.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* SUCCESS STATE SUMMARY & NAVIGATION */}
              {session.isComplete && session.resultRecord && (
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <div className="p-3 bg-zinc-950 rounded border border-zinc-700 text-xs font-mono space-y-1">
                    <p className="text-white font-semibold">FastAPI Inference Results:</p>
                    <p className="text-zinc-300">Glyphs Segmented: <span className="text-white font-bold">{session.resultRecord.ocr.totalGlyphsDetected}</span></p>
                    <p className="text-zinc-300">Average Confidence: <span className="text-white font-bold">{session.resultRecord.ocr.averageConfidence.toFixed(1)}%</span></p>
                    <p className="text-zinc-300">IAST Transliteration: <span className="text-zinc-200 font-serif text-sm">{session.resultRecord.transliteration.iastText}</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<FileCheck2 className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/results')}
                    >
                      Brahmi OCR Studio
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<BookOpenCheck className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/verification')}
                    >
                      Verification Studio
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
