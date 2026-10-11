import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  FileImage,
  Trash2,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  BookOpenCheck,
  ArrowRight,
  X,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { usePipelineContext } from '../layouts/MainLayout';
import {
  analysisService,
  AnalysisSession,
} from '../services/analysisService';
import { MOCK_INSCRIPTIONS } from '../data/mockInscriptions';

export const Analyze: React.FC = () => {
  const { setRecord, setActiveId } = usePipelineContext();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [session, setSession] = useState<AnalysisSession | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setValidationError(null);
    const validation = analysisService.validateFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file.');
      return;
    }

    const newSession = analysisService.createSessionFromFile(file);
    setSession(newSession);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
  };

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
      // Error handled inside session
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Scan & Analyze
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Upload an inscription image or select an archival sample to run neural OCR.
          </p>
        </div>

        {session?.isComplete && (
          <Button
            variant="primary"
            size="sm"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => navigate('/results')}
          >
            Open in OCR Studio
          </Button>
        )}
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="p-3 bg-zinc-900 border border-zinc-700 rounded-lg flex items-center justify-between text-zinc-200 text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0" />
            <span>{validationError}</span>
          </div>
          <button onClick={() => setValidationError(null)} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* State 1: Upload Dropzone & Quick Samples */}
      {!session && (
        <div className="space-y-6 max-w-2xl mx-auto pt-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-dashed rounded-xl p-8 sm:p-12 text-center transition-all flex flex-col items-center justify-center space-y-3 ${
              dragActive
                ? 'border-white bg-zinc-900/60'
                : 'border-zinc-800 hover:border-zinc-600 bg-zinc-950/60'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
              <Upload className="w-5 h-5 stroke-[1.5]" />
            </div>

            <div>
              <p className="text-sm font-medium text-white">
                Drag and drop your inscription image
              </p>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">
                Supports JPG, PNG, WEBP (up to 15 MB)
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/*"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2"
            >
              Browse Files
            </Button>
          </div>

          {/* Quick Archival Samples */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase text-zinc-500 text-center">
              Or test with pre-indexed archival samples
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {MOCK_INSCRIPTIONS.map((item) => (
                <button
                  key={item.metadata.id}
                  onClick={() => handleLoadSample(item.metadata.id)}
                  className="p-2.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-left transition-colors flex items-center gap-2.5"
                >
                  <img
                    src={item.metadata.imageUrl}
                    alt={item.metadata.title}
                    className="w-10 h-10 rounded object-cover border border-zinc-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{item.metadata.title}</p>
                    <p className="text-[10px] font-mono text-zinc-500 truncate">{item.metadata.corpusCatalogId}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* State 2: Selected Image & Analysis Process */}
      {session && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Image Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <Card variant="default" className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800/80 pb-2">
                <span className="text-white truncate font-medium max-w-[70%]">
                  {session.fileName}
                </span>
                <span className="text-zinc-500">
                  {(session.fileSize / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

              <div className="relative h-[340px] bg-zinc-950 rounded border border-zinc-800 overflow-hidden flex items-center justify-center p-3">
                <img
                  src={session.previewUrl}
                  alt="Inscription preview"
                  className="max-h-full max-w-full object-contain rounded select-none"
                />

                {session.isProcessing && (
                  <div className="absolute inset-0 bg-white/5 pointer-events-none flex flex-col justify-between">
                    <motion.div
                      animate={{ y: [0, 320, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-lg shadow-white/30"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5 text-zinc-400" />}
                    onClick={handleRemoveImage}
                    disabled={session.isProcessing}
                  >
                    Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={session.isProcessing}
                  >
                    Replace
                  </Button>
                </div>

                {!session.isProcessing && !session.isComplete && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Play className="w-3.5 h-3.5" />}
                    onClick={handleStartAnalysis}
                  >
                    {session.error ? 'Retry Analysis' : 'Run Neural OCR'}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Clean Status & Results (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card variant="default" className="p-5 space-y-4">
              <div className="border-b border-zinc-800 pb-3">
                <h3 className="text-sm font-medium text-white">
                  Analysis Status
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {session.isProcessing
                    ? 'Extracting contours and classifying Brahmi glyphs...'
                    : session.isComplete
                    ? 'Inference complete. Results ready for review.'
                    : session.error
                    ? 'Analysis failed.'
                    : 'Ready to run.'}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-zinc-400">
                  <span>Progress</span>
                  <span className="text-white font-medium">{session.overallProgress}%</span>
                </div>
                <Progress value={session.overallProgress} size="sm" variant="neutral" />
              </div>

              {/* Error Alert */}
              {session.error && (
                <div className="p-3 bg-zinc-900 border border-zinc-700 rounded text-xs space-y-2">
                  <p className="text-zinc-300">{session.error}</p>
                  <Button variant="primary" size="sm" onClick={handleStartAnalysis}>
                    Retry
                  </Button>
                </div>
              )}

              {/* Results Preview */}
              {session.isComplete && session.resultRecord && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-zinc-950 rounded border border-zinc-800/80 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Glyphs Detected</span>
                      <span className="text-white font-mono font-bold">
                        {session.resultRecord.ocr.totalGlyphsDetected}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Average Confidence</span>
                      <span className="text-white font-mono font-bold">
                        {session.resultRecord.ocr.averageConfidence.toFixed(1)}%
                      </span>
                    </div>
                    <div className="pt-1.5 border-t border-zinc-900">
                      <span className="text-zinc-500 text-[11px] block">IAST Transliteration:</span>
                      <span className="text-white font-mono text-xs font-medium">
                        {session.resultRecord.transliteration.iastText}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<FileCheck2 className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/results')}
                    >
                      OCR Studio
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<BookOpenCheck className="w-3.5 h-3.5" />}
                      onClick={() => navigate('/verification')}
                    >
                      Verify
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
