import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ScanLine,
  ArrowRight,
  Database,
  ShieldCheck,
  Cpu,
  BarChart2,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { AnimatedCounter } from '../components/reactbits/AnimatedCounter';
import { usePipelineContext } from '../layouts/MainLayout';

export const Dashboard: React.FC = () => {
  const { allInscriptions, setActiveId } = usePipelineContext();
  const navigate = useNavigate();

  const confidenceBreakdown = [
    { level: 'High (>90%)', count: 28, pct: 78, bar: 'bg-white' },
    { level: 'Medium (70–89%)', count: 6, pct: 17, bar: 'bg-zinc-400' },
    { level: 'Low (<70%)', count: 2, pct: 5, bar: 'bg-zinc-700' },
  ];

  return (
    <div className="space-y-6 py-2">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-1">
            Epigraphical workspace overview and recent inscription analyses.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<ScanLine className="w-4 h-4" />}
          onClick={() => navigate('/analyze')}
        >
          Scan Inscription
        </Button>
      </div>

      {/* Key Metrics Strip (3 essential stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card variant="default" className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Inscriptions Analyzed</p>
            <p className="text-2xl font-mono font-bold text-white mt-1">
              <AnimatedCounter value={24} />
            </p>
          </div>
          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Database className="w-4 h-4" />
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Verified Records</p>
            <p className="text-2xl font-mono font-bold text-white mt-1">
              <AnimatedCounter value={16} />
            </p>
          </div>
          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Average Confidence</p>
            <p className="text-2xl font-mono font-bold text-white mt-1">
              <AnimatedCounter value={93.4} decimals={1} suffix="%" />
            </p>
          </div>
          <div className="p-2.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
            <Cpu className="w-4 h-4" />
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Analyses + Confidence Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Inscriptions (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-medium text-white font-sans">
              Recent Inscriptions
            </h2>
            <Link
              to="/history"
              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              View catalog <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-2">
            {allInscriptions.map((item, idx) => {
              const conf = idx === 0 ? 94.6 : idx === 1 ? 87.2 : 96.1;
              const isVerified = idx !== 1;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveId(item.id);
                    navigate('/results');
                  }}
                  className="p-3 bg-zinc-950 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-lg flex items-center justify-between gap-4 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-zinc-400 font-medium">
                          {item.corpusCatalogId}
                        </span>
                        <span className="text-[11px] text-zinc-500">• {item.script}</span>
                      </div>
                      <h3 className="text-sm font-medium text-white truncate mt-0.5 group-hover:text-zinc-200">
                        {item.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 truncate">
                        {item.provenance}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right hidden sm:block">
                      <ConfidenceBadge confidence={conf} size="sm" />
                      <span className="text-[10px] text-zinc-500 block mt-0.5 font-mono">
                        {isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confidence Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="px-1">
            <h2 className="text-sm font-medium text-white font-sans flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-zinc-400" />
              Confidence Distribution
            </h2>
          </div>

          <Card variant="default" className="p-4 space-y-4">
            <div className="space-y-3 text-xs">
              {confidenceBreakdown.map((item) => (
                <div key={item.level} className="space-y-1">
                  <div className="flex justify-between text-zinc-400 text-[11px]">
                    <span>{item.level}</span>
                    <span className="text-white font-mono">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.bar}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500 leading-relaxed font-sans">
              36 total inscriptions classified across Ashokan & Post-Mauryan corpus.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
