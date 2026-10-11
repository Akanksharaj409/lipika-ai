import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ScanLine,
  FileCheck2,
  Languages,
  BookOpenCheck,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Database,
  Award,
  Sparkles,
  Eye,
  CheckCircle2,
  Globe,
  FileText,
  Layers,
  Zap,
  HelpCircle,
  ChevronRight,
  Lock,
  Compass,
} from 'lucide-react';
import { AnimatedText } from '../components/reactbits/AnimatedText';
import { InteractiveCard } from '../components/reactbits/InteractiveCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { usePipelineContext } from '../layouts/MainLayout';

export const Home: React.FC = () => {
  const { record, setActiveId, allInscriptions } = usePipelineContext();
  const navigate = useNavigate();

  // Hero Interactive Visual State (3-Stage Transformation Stream)
  const [activeHeroStage, setActiveHeroStage] = useState<'raw' | 'ai' | 'text'>('ai');

  const heroStages = [
    { id: 'raw', label: '1. Inscription Image', sub: 'High-res stone rubbing scan' },
    { id: 'ai', label: '2. AI Segmentation', sub: 'OpenCV & Bounding Box Detection' },
    { id: 'text', label: '3. Digital Text', sub: 'Brahmi Unicode + IAST + Meaning' },
  ];

  const sampleGlyphs = [
    { brahmi: '𑀤', iast: 'da', dev: 'द', conf: 98.2, hex: 'U+11024' },
    { brahmi: '𑀯', iast: 'va', dev: 'व', conf: 96.5, hex: 'U+1102F' },
    { brahmi: '𑀦', iast: 'na', dev: 'न', conf: 97.9, hex: 'U+11026' },
    { brahmi: '𑀁', iast: 'ṁ', dev: 'ं', conf: 99.1, hex: 'U+11001' },
    { brahmi: '𑀧', iast: 'pa', dev: 'प', conf: 92.4, hex: 'U+11027' },
    { brahmi: '𑀺', iast: 'i', dev: 'ि', conf: 88.0, hex: 'U+1103A' },
    { brahmi: '𑀬', iast: 'ya', dev: 'य', conf: 95.8, hex: 'U+1102D' },
  ];

  return (
    <div className="space-y-24 py-4 text-zinc-100">
      {/* ========================================================================= */}
      {/* SECTION 1: HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 p-8 sm:p-14 shadow-2xl space-y-12">
        {/* Background Decorative Grid Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/5 via-zinc-500/5 to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="neutral" icon={<Award className="w-3.5 h-3.5" />}>
                Ancient Heritage Research Lab
              </Badge>
              <Badge variant="outline" icon={<Cpu className="w-3.5 h-3.5" />}>
                Brahmi Script MVP Focus
              </Badge>
            </div>

            <div className="space-y-3">
              <span className="font-mono text-xs text-zinc-400 font-semibold tracking-widest uppercase block">
                Lipika AI • Digital Epigraphy
              </span>
              <h1 className="font-serif text-4xl sm:text-6xl font-medium tracking-tight text-white leading-tight">
                <AnimatedText text="Preserving the past. Decoding the future." />
              </h1>
            </div>

            <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed">
              Lipika AI is an AI-assisted research platform for digitizing, segmenting, and interpreting ancient Indian inscriptions. Using computer vision, neural OCR, and AI-assisted language processing, our first MVP focuses specifically on the ancient <strong className="text-white font-semibold">Brahmi script</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                onClick={() => navigate('/analyze')}
              >
                Analyze an Inscription
              </Button>
              <Button
                size="lg"
                variant="outline"
                icon={<Compass className="w-4 h-4" />}
                onClick={() => navigate('/dashboard')}
              >
                Explore the Workflow
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-800 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                <span>EpiDoc TEI-XML Export</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-300 shrink-0" />
                <span>Expert Human Audit</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visual Demonstration */}
          <div className="lg:col-span-6 space-y-4">
            <Card variant="archival" className="p-6 space-y-5">
              {/* Interactive Stage Switcher Tabs */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                  Interactive Transformation Visual
                </span>
                <span className="text-[11px] font-mono text-zinc-500">Click tabs to view</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-950 rounded-md border border-zinc-800">
                {heroStages.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setActiveHeroStage(st.id as any)}
                    className={`px-2 py-2 rounded text-center transition-all ${
                      activeHeroStage === st.id
                        ? 'bg-white text-black shadow-md font-semibold text-xs'
                        : 'text-zinc-400 hover:text-white text-xs'
                    }`}
                  >
                    <span className="block font-mono text-[11px] leading-tight">{st.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Viewport Canvas */}
              <div className="relative min-h-[280px] bg-zinc-950 rounded-lg border border-zinc-800 p-4 flex flex-col justify-between overflow-hidden">
                <AnimatePresence mode="wait">
                  {/* STAGE 1: RAW INSCRIPTION */}
                  {activeHeroStage === 'raw' && (
                    <motion.div
                      key="stage-raw"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4"
                    >
                      <div className="relative overflow-hidden rounded border border-zinc-800 h-44">
                        <img
                          src="https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=800"
                          alt="Ashoka Rock Edict III Raw Rubbing"
                          className="w-full h-full object-cover filter contrast-125"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
                        <span className="absolute bottom-2 left-2 font-mono text-[10px] bg-zinc-950/80 px-2 py-0.5 rounded text-white border border-zinc-700">
                          Ashoka Major Rock Edict III (Girnar Granite, c. 257 BCE)
                        </span>
                      </div>
                      <p className="text-xs font-mono text-zinc-400">
                        Raw stone rubbing captured in-situ. Weathering, surface fractures, and erosion obscure ancient characters.
                      </p>
                    </motion.div>
                  )}

                  {/* STAGE 2: AI PROCESSING & SEGMENTATION */}
                  {activeHeroStage === 'ai' && (
                    <motion.div
                      key="stage-ai"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4"
                    >
                      <div className="relative overflow-hidden rounded border border-zinc-700 bg-zinc-900 p-4 h-44 flex flex-col justify-center items-center">
                        {/* Simulated Bounding Box Grid */}
                        <div className="flex flex-wrap justify-center gap-2 max-w-md">
                          {sampleGlyphs.map((g, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-2 bg-zinc-950 border-2 border-zinc-500 rounded text-center min-w-[42px]"
                            >
                              <span className="font-serif text-xl font-bold text-white block">{g.brahmi}</span>
                              <span className="font-mono text-[9px] text-zinc-300 block">{g.conf}%</span>
                            </motion.div>
                          ))}
                        </div>
                        <span className="absolute top-2 right-2 font-mono text-[10px] bg-zinc-800 text-white px-2 py-0.5 rounded border border-zinc-600">
                          OpenCV CLAHE + ResNet Segment Pass
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                        <span>7 Bounding Boxes Extracted</span>
                        <span className="text-white font-semibold">96.4% Neural Confidence</span>
                      </div>
                    </motion.div>
                  )}

                  {/* STAGE 3: DIGITAL TEXT */}
                  {activeHeroStage === 'text' && (
                    <motion.div
                      key="stage-text"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-3"
                    >
                      <div className="p-4 bg-zinc-900 border border-zinc-700 rounded-lg space-y-2">
                        <div className="text-xs font-mono text-zinc-400 flex justify-between">
                          <span>Brahmi Unicode Stream</span>
                          <span className="text-white font-semibold">U+11000–U+1107F</span>
                        </div>
                        <p className="font-serif text-3xl font-bold text-white tracking-widest">
                          𑀤𑀾𑀯𑀸𑀦𑀸𑀁𑀧𑀺𑀬
                        </p>
                      </div>

                      <div className="p-3 bg-zinc-900/80 border border-zinc-800 rounded space-y-1 font-mono text-xs">
                        <div className="flex justify-between">
                          <span className="text-zinc-400">IAST Transliteration:</span>
                          <span className="text-white font-semibold">Devānaṁpiye</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-400">English Epithet:</span>
                          <span className="text-zinc-300">"Beloved of the Gods" (Ashoka)</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stage Progress Indicator Footnote */}
                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-2">
                  <span>Transformation Pipeline</span>
                  <span className="text-zinc-300 font-semibold">Click tabs above to toggle view</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: THE PROBLEM */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="neutral">The Heritage Challenge</Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white">
            Why Ancient Inscriptions Are Being Lost
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Centuries of natural weathering, environmental erosion, and urbanization threaten India’s stone heritage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InteractiveCard className="space-y-3">
            <div className="p-3 rounded bg-zinc-900 border border-zinc-700 w-fit text-white">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-white">Weathering & Physical Abrasion</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Monsoonal rainfall, wind erosion, and micro-cracks continuously degrade high-relief stone edicts. Without high-definition digital preservation, vital historical lacunae risk becoming unreadable forever.
            </p>
          </InteractiveCard>

          <InteractiveCard className="space-y-3">
            <div className="p-3 rounded bg-zinc-900 border border-zinc-700 w-fit text-white">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-white">Scarcity of Expert Epigraphists</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Translating Brahmi requires rare specialized training in Prakrit grammar, paleography, and regional script evolution. Thousands of recorded rubbings in museum archives remain unanalyzed.
            </p>
          </InteractiveCard>

          <InteractiveCard className="space-y-3">
            <div className="p-3 rounded bg-zinc-900 border border-zinc-700 w-fit text-white">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-white">Lack of Machine-Readable Data</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Unlike Latin or Greek epigraphy, Indian Brahmi edicts lack open digital OCR benchmarks and TEI-XML corpora, isolating ancient Indian history from global computational humanities.
            </p>
          </InteractiveCard>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: HOW LIPIKA AI WORKS */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <Badge variant="outline">System Workflow</Badge>
            <h2 className="font-serif text-3xl font-medium text-white mt-1">How Lipika AI Operates</h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-md">
            A seamless bridge from stone surface captures to machine-readable TEI-XML publications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Image Ingestion & Preprocessing',
              desc: 'Applies OpenCV contrast adjustments, noise reduction, and CLAHE rubbing enhancement to isolate chiseled strokes.',
              icon: <ScanLine className="w-5 h-5 text-zinc-300" />,
            },
            {
              step: '02',
              title: 'Bounding Box Binarization',
              desc: 'Detects individual character contours, assigning spatial coordinates (x, y, w, h) across the inscription face.',
              icon: <Layers className="w-5 h-5 text-white" />,
            },
            {
              step: '03',
              title: 'Brahmi Neural Classification',
              desc: 'Maps visual character features against Ashokan and Post-Mauryan Brahmi unicode font stacks with confidence probabilities.',
              icon: <FileCheck2 className="w-5 h-5 text-zinc-200" />,
            },
            {
              step: '04',
              title: 'Phonetic & Contextual Translation',
              desc: 'Generates IAST transliteration, Devanagari conversion, Hindi/English translations, and historical context notes.',
              icon: <Languages className="w-5 h-5 text-zinc-400" />,
            },
          ].map((item) => (
            <Card key={item.step} variant="archival" className="flex flex-col justify-between h-full space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-2xl font-bold text-zinc-600">{item.step}</span>
                  <div className="p-2 rounded bg-zinc-900 border border-zinc-800">{item.icon}</div>
                </div>
                <h3 className="font-serif text-lg font-medium text-white mb-2">{item.title}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">{item.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: AI PIPELINE TECHNICAL DETAIL */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <Card variant="archival" className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <Badge variant="neutral">Computer Vision & Deep Learning Stack</Badge>
              <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1">
                The 4-Stage Computational Pipeline
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400">Ashokan & Post-Mauryan Brahmi Focus</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-white font-bold text-sm block">Stage 1: Adaptive Filtering</span>
                <p className="text-zinc-300 font-sans">
                  Raw inscription images are processed using Contrast Limited Adaptive Histogram Equalization (CLAHE) and Laplacian sharpening to make faint chisel marks visible under varying lighting conditions.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-white font-bold text-sm block">Stage 2: Glyph Segmentation</span>
                <p className="text-zinc-300 font-sans">
                  Morphological contour extraction isolates individual glyph boxes. Handles ligatures, conjuncts, and vowel matras (U+11038–U+11045).
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-white font-bold text-sm block">Stage 3: Neural Classification</span>
                <p className="text-zinc-300 font-sans">
                  Deep convolutional neural classifier predicts Brahmi Unicode equivalents (`U+11000` to `U+1107F`) and produces ranked alternative candidates for damaged or doubtful characters.
                </p>
              </div>

              <div className="p-4 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-white font-bold text-sm block">Stage 4: Philological Translation</span>
                <p className="text-zinc-300 font-sans">
                  Prakrit grammar engine maps output to IAST phonetics, Devanagari equivalents, and dual-language (Hindi & English) semantic explanations.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 5: HUMAN VERIFICATION INTEGRITY */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <Badge variant="solid" icon={<ShieldCheck className="w-3.5 h-3.5" />}>
            Philological Integrity
          </Badge>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-white leading-tight">
            Human-in-the-Loop Expert Audit
          </h2>
          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            Machine learning accelerates initial transcription, but human expertise remains paramount. Lipika AI features a specialized verification studio allowing epigraphists to inspect low-confidence glyphs, apply manual character overrides, record lacuna notes, and generate authenticated TEI-XML publication files.
          </p>

          <div className="pt-2">
            <Button
              variant="outline"
              icon={<BookOpenCheck className="w-4 h-4" />}
              onClick={() => navigate('/verification')}
            >
              Test Verification Studio
            </Button>
          </div>
        </div>

        <div className="lg:col-span-6">
          <Card variant="archival" className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="font-mono text-xs text-white font-semibold">Verification Audit Panel Preview</span>
              <Badge variant="solid">Authenticated</Badge>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex justify-between items-center">
                <span>Senior Epigraphist Sign-off</span>
                <span className="text-white font-bold">Verified</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex justify-between items-center">
                <span>EpiDoc TEI XML Schema</span>
                <span className="text-zinc-300">Valid TEI-P5</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 flex justify-between items-center">
                <span>Corpus Catalog Registration</span>
                <span className="text-zinc-400">BR-ASH-GIR-003</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 6: KEY CAPABILITIES */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="neutral">Core Capabilities</Badge>
          <h2 className="font-serif text-3xl font-medium text-white">
            Engineered for Academic Epigraphy
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card variant="glass" className="space-y-3">
            <ScanLine className="w-6 h-6 text-white" />
            <h3 className="font-serif text-lg font-medium text-white">Multispectral Enhancement</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Interactive sliders for brightness, contrast, Laplacian sharpening, and stone rubbing color filters.
            </p>
          </Card>

          <Card variant="glass" className="space-y-3">
            <FileCheck2 className="w-6 h-6 text-white" />
            <h3 className="font-serif text-lg font-medium text-white">Glyph Bounding Matrix</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Vector bounding box canvas showing character confidence ratings, hex codes, and alternative candidates.
            </p>
          </Card>

          <Card variant="glass" className="space-y-3">
            <Languages className="w-6 h-6 text-white" />
            <h3 className="font-serif text-lg font-medium text-white">Parallel Reader & IAST</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Side-by-side Brahmi Unicode, standardized IAST phonetics, Devanagari, and word-level meanings.
            </p>
          </Card>

          <Card variant="glass" className="space-y-3">
            <Globe className="w-6 h-6 text-white" />
            <h3 className="font-serif text-lg font-medium text-white">Dual-Language Translation</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Full Hindi and English translations paired with historical, geopolitical, and regnal context commentary.
            </p>
          </Card>

          <Card variant="glass" className="space-y-3">
            <FileText className="w-6 h-6 text-white" />
            <h3 className="font-serif text-lg font-medium text-white">TEI-XML Export Engine</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              One-click generation of EpiDoc compliant TEI-XML, structured JSON, and Markdown research reports.
            </p>
          </Card>

          <Card variant="glass" className="space-y-3">
            <Database className="w-6 h-6 text-white" />
            <h3 className="font-serif text-lg font-medium text-white">CII Catalog Corpus</h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Pre-loaded with authentic Mauryan, Mahameghavahana, and Shunga Brahmi edicts (Ashoka, Kharavela, Heliodorus).
            </p>
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: RESEARCH IMPACT */}
      {/* ========================================================================= */}
      <section className="p-8 rounded-xl border border-zinc-800 bg-zinc-950 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div>
            <Badge variant="outline">Digital Humanities Impact</Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-white mt-1">
              Accelerating Epigraphical Discovery
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans text-xs">
          <div className="space-y-2">
            <span className="font-serif text-lg text-white font-medium block">1. Heritage Preservation</span>
            <p className="text-zinc-400 leading-relaxed">
              Creates permanent, machine-readable digital archives of ancient edicts before physical weathering erodes stone faces.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-lg text-white font-medium block">2. Scholarly Efficiency</span>
            <p className="text-zinc-400 leading-relaxed">
              Reduces initial character decipherment time from weeks to seconds, allowing researchers to focus on historical analysis.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-serif text-lg text-white font-medium block">3. Open AI Benchmarks</span>
            <p className="text-zinc-400 leading-relaxed">
              Establishes standardized datasets for ancient Indian scripts, driving computational linguistics forward.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 8: CALL TO ACTION (CTA) */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-black p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <Badge variant="neutral">Launch Research Workbench</Badge>
          <h2 className="font-serif text-3xl sm:text-5xl font-medium text-white">
            Start Digitizing Brahmi Inscriptions
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
            Select an authentic edict from the Corpus Inscriptionum Indicarum catalog or upload a custom rubbing image to run the neural OCR pipeline.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button
            size="lg"
            variant="primary"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
            onClick={() => navigate('/analyze')}
          >
            Analyze an Inscription
          </Button>
          <Button
            size="lg"
            variant="outline"
            icon={<Database className="w-4 h-4" />}
            onClick={() => navigate('/history')}
          >
            Browse Archival Catalog
          </Button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 9: SCHOLARLY FOOTER */}
      {/* ========================================================================= */}
      <footer className="pt-8 border-t border-zinc-800 text-xs font-mono text-zinc-400 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-serif font-bold text-sm">
                𑀮
              </div>
              <span className="font-serif text-base font-medium text-white">LIPIKA.AI</span>
            </div>
            <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
              AI-assisted platform for digitizing, segmenting, and interpreting ancient Indian Brahmi inscriptions.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-white font-semibold block uppercase">Navigation</span>
            <ul className="space-y-1 text-zinc-400 font-sans">
              <li><Link to="/analyze" className="hover:text-white transition-colors">Image Scan & Prep</Link></li>
              <li><Link to="/results" className="hover:text-white transition-colors">Brahmi OCR Studio</Link></li>
              <li><Link to="/verification" className="hover:text-white transition-colors">Human Verification</Link></li>
              <li><Link to="/translation" className="hover:text-white transition-colors">Transliteration & Meaning</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-semibold block uppercase">Research & Corpus</span>
            <ul className="space-y-1 text-zinc-400 font-sans">
              <li><Link to="/history" className="hover:text-white transition-colors">CII Catalog Corpus</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Telemetry Dashboard</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Pipeline Methodology</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <span className="text-white font-semibold block uppercase">Target MVP Specs</span>
            <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
              MVP Target Script: Ashokan & Post-Mauryan Brahmi (c. 3rd–1st Century BCE).
              Built for B.Tech Hackathon & Capstone Project.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-zinc-500">
          <span>© 2026 Lipika AI Project • Ancient Indian Epigraphy & Neural AI Research</span>
          <span>Brahmi Script MVP v1.0</span>
        </div>
      </footer>
    </div>
  );
};
