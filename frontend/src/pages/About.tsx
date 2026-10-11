import React from 'react';
import { Info, Cpu, BookOpen, ShieldCheck, Award, GitBranch } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const About: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Page Header */}
      <div className="border-b border-zinc-800 pb-5">
        <div className="flex items-center gap-2">
          <Badge variant="neutral">Research & Architecture Overview</Badge>
          <Badge variant="outline">B.Tech Capstone MVP</Badge>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-white flex items-center gap-3 mt-2">
          <Info className="w-8 h-8 text-zinc-300" />
          About Lipika AI
        </h1>
        <p className="text-sm text-zinc-300 font-sans mt-2 leading-relaxed">
          Lipika AI is an AI-assisted research workbench designed for digitizing, segmenting, recognizing, translating, and contextually interpreting ancient Indian Brahmi inscriptions.
        </p>
      </div>

      {/* System Architecture Section */}
      <Card variant="archival" className="space-y-4 p-6">
        <h3 className="font-serif text-xl text-white font-medium flex items-center gap-2">
          <Cpu className="w-5 h-5 text-zinc-300" />
          Technical Architecture & Design Methodology
        </h3>
        <p className="text-sm text-zinc-300 leading-relaxed font-sans">
          Lipika AI embodies a high-contrast monochrome research laboratory aesthetic. The system decouples the React frontend from the Python/FastAPI ML engine to guarantee modularity and production readiness.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 font-mono text-xs">
          <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
            <span className="text-white font-bold block">Frontend Engine</span>
            <p className="text-zinc-400">React 19 / Vite + Tailwind CSS v4 + Framer Motion + WebGL2 Shaders + Isolated Service Layer</p>
          </div>
          <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
            <span className="text-white font-bold block">ML Backend Target</span>
            <p className="text-zinc-400">Python FastAPI + OpenCV Binarization + Neural Brahmi Character Classifier + IAST Converter</p>
          </div>
        </div>
      </Card>

      {/* Core Workflow Steps */}
      <div className="space-y-4">
        <h3 className="font-serif text-xl font-medium text-white">The 10-Step Pipeline Architecture</h3>

        <div className="space-y-3 font-mono text-xs">
          {[
            { step: '01', title: 'Ancient Inscription Image Capture', desc: 'High-res multispectral capture or digital rubbing upload.' },
            { step: '02', title: 'Image Enhancement & CLAHE', desc: 'OpenCV contrast limited adaptive histogram equalization and Laplacian sharpening.' },
            { step: '03', title: 'Character Bounding Box Segmentation', desc: 'Contour extraction and bounding geometry calculation.' },
            { step: '04', title: 'Brahmi Neural OCR Classifier', desc: 'ResNet / MobileNet inference predicting Unicode hex codes.' },
            { step: '05', title: 'Confidence Scoring & Candidate Ranking', desc: 'Per-glyph softmax confidence probabilities.' },
            { step: '06', title: 'Human Epigraphist Review', desc: 'Interactive character override studio.' },
            { step: '07', title: 'Phonetic IAST Transliteration', desc: 'Standardized International Alphabet of Sanskrit Transliteration mapping.' },
            { step: '08', title: 'Hindi & English Dual Translation', desc: 'Contextual translation engine.' },
            { step: '09', title: 'Historical & Geopolitical Annotation', desc: 'Reign, dynasty, and epigraphical commentary.' },
            { step: '10', title: 'TEI XML Publication & Export', desc: 'EpiDoc compliant TEI-XML, Markdown, and JSON metadata.' },
          ].map((item) => (
            <div key={item.step} className="p-3 bg-zinc-900/60 border border-zinc-800 rounded flex items-center gap-4">
              <span className="text-white font-bold text-sm shrink-0">{item.step}</span>
              <div>
                <span className="text-zinc-200 font-semibold block">{item.title}</span>
                <span className="text-zinc-400 font-sans text-xs">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
