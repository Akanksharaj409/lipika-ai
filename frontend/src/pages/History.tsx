import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Download,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { Modal } from '../components/ui/Modal';
import { usePipelineContext } from '../layouts/MainLayout';
import { FullInscriptionRecord, InscriptionMetadata } from '../types/inscription';
import { exportService } from '../services/exportService';
import { MOCK_INSCRIPTIONS } from '../data/mockInscriptions';

export const ArchivalHistory: React.FC = () => {
  const { allInscriptions, setActiveId } = usePipelineContext();
  const navigate = useNavigate();

  const [historyItems, setHistoryItems] = useState<InscriptionMetadata[]>(allInscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScript, setSelectedScript] = useState<string>('All');

  const [detailRecord, setDetailRecord] = useState<FullInscriptionRecord | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [exportTargetRecord, setExportTargetRecord] = useState<FullInscriptionRecord | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'txt' | 'tei-xml'>('pdf');

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.corpusCatalogId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScript = selectedScript === 'All' || item.script === selectedScript;
    return matchesSearch && matchesScript;
  });

  const handleView = (id: string) => {
    setActiveId(id);
    const targetRec = MOCK_INSCRIPTIONS.find((i) => i.metadata.id === id) || MOCK_INSCRIPTIONS[0];
    setDetailRecord(targetRec);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      setHistoryItems((prev) => prev.filter((item) => item.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const handleOpenExportModal = (item: InscriptionMetadata) => {
    const rec = MOCK_INSCRIPTIONS.find((i) => i.metadata.id === item.id) || MOCK_INSCRIPTIONS[0];
    setExportTargetRecord(rec);
  };

  const handleExecuteExport = () => {
    if (!exportTargetRecord) return;
    const baseName = `${exportTargetRecord.metadata.corpusCatalogId}_export`;
    if (exportFormat === 'json') {
      const content = exportService.exportToJSON(exportTargetRecord);
      exportService.downloadFile(`${baseName}.json`, content, 'application/json');
    } else if (exportFormat === 'txt') {
      const content = exportService.exportToTXT(exportTargetRecord);
      exportService.downloadFile(`${baseName}.txt`, content, 'text/plain');
    } else if (exportFormat === 'tei-xml') {
      const content = exportService.exportToTEIXML(exportTargetRecord);
      exportService.downloadFile(`${baseName}.xml`, content, 'application/xml');
    } else {
      const content = exportService.exportToPDFReport(exportTargetRecord);
      exportService.downloadFile(`${baseName}_report.txt`, content, 'text/plain');
    }
  };

  return (
    <div className="space-y-6 py-2">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-5">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-medium text-white tracking-tight">
            Corpus Catalog
          </h1>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Archival records and previously analyzed Brahmi inscriptions.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => handleOpenExportModal(allInscriptions[0])}
        >
          Export Active Record
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-1.5 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title or catalog ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-500" />
          <select
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="All">All Scripts</option>
            <option value="Ashokan Brahmi">Ashokan Brahmi</option>
            <option value="Kalinga Brahmi">Kalinga Brahmi</option>
            <option value="Late Mauryan / Shunga Brahmi">Late Mauryan / Shunga</option>
          </select>
        </div>
      </div>

      {/* Clean Records List */}
      <div className="space-y-2">
        {filteredItems.map((item) => {
          const rec = MOCK_INSCRIPTIONS.find((i) => i.metadata.id === item.id) || MOCK_INSCRIPTIONS[0];
          const conf = rec.ocr.averageConfidence;
          const isVerified = rec.verification.isVerified;

          return (
            <div
              key={item.id}
              className="p-3 bg-zinc-950 hover:bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors"
            >
              <div
                onClick={() => handleView(item.id)}
                className="flex items-center gap-3.5 min-w-0 cursor-pointer flex-1"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover border border-zinc-800 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-zinc-400 font-semibold">
                      {item.corpusCatalogId}
                    </span>
                    <span className="text-[11px] text-zinc-500">• {item.script}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white truncate mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 truncate">
                    {item.siteLocation} ({item.period})
                  </p>
                </div>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                <div className="text-right">
                  <ConfidenceBadge confidence={conf} size="sm" />
                  <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">
                    {isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Eye className="w-3.5 h-3.5" />}
                    onClick={() => handleView(item.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Download className="w-3.5 h-3.5 text-zinc-400" />}
                    onClick={() => handleOpenExportModal(item)}
                    aria-label="Export"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Trash2 className="w-3.5 h-3.5 text-zinc-500 hover:text-white" />}
                    onClick={() => setDeleteTargetId(item.id)}
                    aria-label="Delete"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Record Detail Modal */}
      <Modal
        isOpen={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        title={detailRecord?.metadata.title || 'Inscription Detail'}
        subtitle={detailRecord?.metadata.provenance}
        maxWidth="lg"
      >
        {detailRecord && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
              <p className="text-zinc-400">Catalog ID: <span className="text-white font-bold">{detailRecord.metadata.corpusCatalogId}</span></p>
              <p className="text-zinc-400">Confidence: <span className="text-white font-bold">{detailRecord.ocr.averageConfidence.toFixed(1)}%</span></p>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[11px] block">Decoded Brahmi:</span>
              <p className="font-serif text-2xl text-white tracking-widest p-2.5 bg-zinc-950 rounded border border-zinc-800">
                {detailRecord.ocr.rawBrahmiLine}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-zinc-500 text-[11px] block">English Translation:</span>
              <p className="text-zinc-200 font-sans text-xs italic p-2.5 bg-zinc-950 rounded border border-zinc-800">
                "{detailRecord.translation.englishTranslation}"
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const rec = detailRecord;
                  setDetailRecord(null);
                  handleOpenExportModal(rec.metadata);
                }}
              >
                Export
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setActiveId(detailRecord.metadata.id);
                  setDetailRecord(null);
                  navigate('/verification');
                }}
              >
                Verify
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Export Modal */}
      <Modal
        isOpen={!!exportTargetRecord}
        onClose={() => setExportTargetRecord(null)}
        title="Export Inscription Data"
        subtitle={`Export options for ${exportTargetRecord?.metadata.corpusCatalogId}`}
      >
        {exportTargetRecord && (
          <div className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['pdf', 'json', 'txt', 'tei-xml'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setExportFormat(fmt)}
                  className={`p-2.5 rounded border text-center uppercase font-mono text-xs transition-colors ${
                    exportFormat === fmt
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button variant="ghost" size="sm" onClick={() => setExportTargetRecord(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" icon={<Download className="w-4 h-4" />} onClick={handleExecuteExport}>
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Record"
        subtitle="Remove this analysis from local history?"
      >
        <div className="space-y-4 font-mono text-xs">
          <p className="text-zinc-300 font-sans">
            This will remove the selected record from your active catalog session.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { ArchivalHistory as History };
