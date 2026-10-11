import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  CheckCircle2,
  Layers,
  Cpu,
  FileCheck2,
  ArrowRight,
  Clock,
  Activity,
  Sparkles,
  ShieldCheck,
  History as HistoryIcon,
  BookOpenCheck,
  BarChart3,
  Search,
  ScanLine,
  Compass,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Progress } from '../components/ui/Progress';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { AnimatedCounter } from '../components/reactbits/AnimatedCounter';
import { usePipelineContext } from '../layouts/MainLayout';

export const Dashboard: React.FC = () => {
  const { allInscriptions, record, setActiveId } = usePipelineContext();
  const navigate = useNavigate();

  // Mock Epigraphical Research Activity Logs
  const recentActivityLogs = [
    {
      id: 'act-01',
      timestamp: '10:42 AM Today',
      title: 'OpenCV CLAHE & Rubbing Filter Pass',
      target: 'Ashoka Major Rock Edict III (Girnar)',
      catalogId: 'BR-ASH-GIR-003',
      status: 'Completed',
      confidence: 98.2,
      script: 'Ashokan Brahmi',
    },
    {
      id: 'act-02',
      timestamp: '09:15 AM Today',
      title: 'Human Verification Sign-off Recorded',
      target: 'Hathigumpha Inscription of Kharavela',
      catalogId: 'BR-KHA-HAT-001',
      status: 'Verified',
      reviewer: 'Dr. R. Sharma (ASI)',
      confidence: 87.2,
      script: 'Kalinga Brahmi',
    },
    {
      id: 'act-03',
      timestamp: 'Yesterday 04:30 PM',
      title: 'ResNet Brahmi Neural OCR Segmentation',
      target: 'Heliodorus Pillar Inscription (Besnagar)',
      catalogId: 'BR-SHU-BES-001',
      status: 'Completed',
      confidence: 96.1,
      script: 'Shunga Brahmi',
    },
  ];

  // Confidence Distribution Data
  const confidenceBreakdown = [
    { level: 'High Confidence (>90%)', percentage: 78, count: 28, color: 'bg-zinc-100' },
    { level: 'Medium Confidence (70-89%)', percentage: 17, count: 6, color: 'bg-zinc-400' },
    { level: 'Low Confidence (<70%)', percentage: 5, count: 2, color: 'bg-zinc-600' },
  ];

  return (
    <div className="space-y-8 py-2">
      {/* ========================================================================= */}
      {/* TOP: WELCOME HEADER & QUICK ACTION */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Epigraphical Research Laboratory</Badge>
            <span className="text-xs font-mono text-zinc-400">Ashokan & Post-Mauryan Corpus</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-white flex items-center gap-3 mt-1">
            <LayoutDashboard className="w-7 h-7 text-zinc-300" />
            Digital Epigraphy Research Dashboard
          </h1>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<ScanLine className="w-4 h-4" />}
          onClick={() => navigate('/analyze')}
        >
          Analyze New Inscription
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* STATISTICS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Analyses */}
        <Card variant="glass" className="flex items-center gap-4">
          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 shrink-0 text-white">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-white">
              <AnimatedCounter value={24} />
            </p>
            <p className="text-xs text-zinc-400 font-sans">Total Inscription Scans</p>
          </div>
        </Card>

        {/* Verified Analyses */}
        <Card variant="glass" className="flex items-center gap-4">
          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 shrink-0 text-zinc-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-zinc-100">
              <AnimatedCounter value={16} />
            </p>
            <p className="text-xs text-zinc-400 font-sans">Verified Records</p>
          </div>
        </Card>

        {/* Average OCR Confidence */}
        <Card variant="glass" className="flex items-center gap-4">
          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 shrink-0 text-zinc-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-white">
              <AnimatedCounter value={93.4} decimals={1} suffix="%" />
            </p>
            <p className="text-xs text-zinc-400 font-sans">Average OCR Confidence</p>
          </div>
        </Card>

        {/* Characters Recognized */}
        <Card variant="glass" className="flex items-center gap-4">
          <div className="p-3 rounded bg-zinc-900 border border-zinc-800 shrink-0 text-zinc-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-mono font-bold text-zinc-200">
              <AnimatedCounter value={1280} suffix="+" />
            </p>
            <p className="text-xs text-zinc-400 font-sans">Characters Recognized</p>
          </div>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* RECENT ANALYSES & CONFIDENCE ANALYTICS GRID */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* RECENT ANALYSES (8 COLS) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <h3 className="font-serif text-xl font-medium text-white flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-zinc-400" />
              Recent Epigraphical Analyses
            </h3>
            <Link to="/history" className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 transition-colors">
              View All Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {allInscriptions.map((item, idx) => {
              const conf = idx === 0 ? 94.6 : idx === 1 ? 87.2 : 96.1;
              const isVerified = idx !== 1;

              return (
                <Card key={item.id} variant="archival" className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded object-cover border border-zinc-800 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-white font-semibold">{item.corpusCatalogId}</span>
                        <Badge variant="neutral">{item.script}</Badge>
                      </div>
                      <h4 className="font-serif text-lg font-medium text-white mt-0.5">{item.title}</h4>
                      <p className="text-xs font-mono text-zinc-400">{item.provenance} • {item.estimatedCentury}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-zinc-800 pt-3 sm:pt-0">
                    <div className="text-left sm:text-right space-y-1">
                      <ConfidenceBadge confidence={conf} size="sm" />
                      <span className="text-[10px] font-mono text-zinc-400 block">
                        {isVerified ? 'Human Verified' : 'Review Pending'}
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveId(item.id);
                        navigate('/results');
                      }}
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Open
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* CONFIDENCE ANALYTICS & QUICK ACTIONS (4 COLS) */}
        <div className="lg:col-span-4 space-y-6">
          {/* CONFIDENCE ANALYTICS CHART */}
          <Card variant="archival" className="p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h4 className="font-serif text-lg font-medium text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-zinc-300" />
                Confidence Analytics
              </h4>
              <span className="text-[10px] font-mono text-zinc-400">Corpus Summary</span>
            </div>

            {/* Clean SVG / Bar Chart Visualization */}
            <div className="space-y-3 pt-1 font-mono text-xs">
              {confidenceBreakdown.map((item) => (
                <div key={item.level} className="space-y-1">
                  <div className="flex justify-between text-zinc-300 text-[11px]">
                    <span>{item.level}</span>
                    <span className="font-semibold text-white">{item.percentage}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* QUICK ACTIONS */}
          <Card variant="default" className="p-5 space-y-3">
            <h4 className="font-serif text-lg font-medium text-white border-b border-zinc-800 pb-2">
              Research Quick Actions
            </h4>

            <div className="space-y-2">
              <Button
                variant="primary"
                className="w-full justify-start"
                icon={<ScanLine className="w-4 h-4" />}
                onClick={() => navigate('/analyze')}
              >
                Analyze Inscription
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-start"
                icon={<HistoryIcon className="w-4 h-4" />}
                onClick={() => navigate('/history')}
              >
                View Archival History
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                icon={<BookOpenCheck className="w-4 h-4" />}
                onClick={() => navigate('/verification')}
              >
                Continue Verification
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECENT PROCESSING ACTIVITY STREAM */}
      {/* ========================================================================= */}
      <Card variant="archival" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-zinc-300" />
            <h3 className="font-serif text-xl font-medium text-white">Live Processing Activity Stream</h3>
          </div>
          <span className="text-xs font-mono text-zinc-400">Research Telemetry Logs</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          {recentActivityLogs.map((log) => (
            <div key={log.id} className="p-3 bg-zinc-950 rounded border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-zinc-200 shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{log.title}</span>
                    <Badge variant="neutral">{log.script}</Badge>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-sans mt-0.5">
                    Target: {log.target} ({log.catalogId})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 text-zinc-400">
                <span>Confidence: {log.confidence}%</span>
                <span>{log.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
