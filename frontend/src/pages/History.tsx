import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Search,
  Filter,
  Eye,
  BookOpenCheck,
  Trash2,
  Download,
  FileText,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  ShieldCheck,
  Globe,
  Layers,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ConfidenceBadge } from '../components/ui/ConfidenceBadge';
import { Modal } from '../components/ui/Modal';
import { usePipelineContext } from '../layouts/MainLayout';
import { FullInscriptionRecord, InscriptionMetadata } from '../types/inscription';
import { exportService } from '../services/exportService';
import { MOCK_INSCRIPTIONS } from '../data/mockInscriptions';

export const ArchivalHistory: React.FC = () => {
  const { allInscriptions, record, setActiveId } = usePipelineContext();
  const navigate = useNavigate();

  // Local state for list items & deletion
  const [historyItems, setHistoryItems] = useState<InscriptionMetadata[]>(allInscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScript, setSelectedScript] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Detailed Result View Modal State
  const [detailRecord, setDetailRecord] = useState<FullInscriptionRecord | null>(null);

  // Delete Confirmation Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Export Modal State
  const [exportTargetRecord, setExportTargetRecord] = useState<FullInscriptionRecord | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'json' | 'txt' | 'tei-xml'>('pdf');

  // Filter Items
  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.provenance.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.corpusCatalogId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesScript = selectedScript === 'All' || item.script === selectedScript;
    return matchesSearch && matchesScript;
  });

  // Action Handlers
  const handleView = (id: string) => {
    setActiveId(id);
    const targetRec = MOCK_INSCRIPTIONS.find((i) => i.metadata.id === id) || MOCK_INSCRIPTIONS[0];
    setDetailRecord(targetRec);
  };

  const handleContinueVerification = (id: string) => {
    setActiveId(id);
    navigate('/verification');
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
    <div className="space-y-8 py-2">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">Corpus Inscriptionum Indicarum</Badge>
            <span className="text-xs font-mono text-zinc-400">Archival Record Repository</span>
          </div>
          <h1 className="font-serif text-3xl font-medium text-white flex items-center gap-3 mt-1">
            <HistoryIcon className="w-7 h-7 text-zinc-300" />
            Analysis History & Archival Catalog
          </h1>
        </div>

        <Button
          variant="primary"
          icon={<FileText className="w-4 h-4" />}
          onClick={() => handleOpenExportModal(allInscriptions[0])}
        >
          Export Active Record
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900/60 p-3 border border-zinc-800 rounded-lg">
        <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-3 py-2 flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-300 shrink-0" />
          <input
            type="text"
            placeholder="Search catalog by title, site location, or Corpus ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs font-mono text-white placeholder:text-zinc-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Script:</span>
          </div>
          <select
            value={selectedScript}
            onChange={(e) => setSelectedScript(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
          >
            <option value="All">All Script Variants</option>
            <option value="Ashokan Brahmi">Ashokan Brahmi</option>
            <option value="Kalinga Brahmi">Kalinga Brahmi</option>
            <option value="Late Mauryan / Shunga Brahmi">Late Mauryan / Shunga Brahmi</option>
          </select>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HISTORY ITEMS CATALOG GRID */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400">
            Showing {filteredItems.length} Index Records
          </span>
        </div>

        {filteredItems.length === 0 ? (
          <Card variant="default" className="p-12 text-center text-zinc-400 font-mono text-xs">
            No history records match the filter criteria.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const rec = MOCK_INSCRIPTIONS.find((i) => i.metadata.id === item.id) || MOCK_INSCRIPTIONS[0];
              const conf = rec.ocr.averageConfidence;
              const isVerified = rec.verification.isVerified;

              return (
                <Card key={item.id} variant="archival" className="flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-white font-bold">{item.corpusCatalogId}</span>
                      <Badge variant="neutral">{item.script}</Badge>
                    </div>

                    {/* Image Thumbnail */}
                    <div className="relative group overflow-hidden rounded border border-zinc-800 h-40">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-2 right-2">
                        <ConfidenceBadge confidence={conf} size="sm" />
                      </div>
                    </div>

                    {/* Metadata Content */}
                    <div className="space-y-1">
                      <h3 className="font-serif text-lg font-medium text-white">{item.title}</h3>
                      <p className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400" />
                        {item.siteLocation}
                      </p>
                      <p className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {item.uploadTimestamp} • {item.period}
                      </p>
                    </div>

                    {/* Verification Status */}
                    <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
                      <span className="text-zinc-400">Language: {item.language}</span>
                      <Badge variant={isVerified ? 'solid' : 'outline'}>
                        {isVerified ? 'Human Verified' : 'Pending Review'}
                      </Badge>
                    </div>
                  </div>

                  {/* ITEM ACTIONS: VIEW | CONTINUE VERIFICATION | DELETE */}
                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Eye className="w-3.5 h-3.5" />}
                        onClick={() => handleView(item.id)}
                      >
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={<BookOpenCheck className="w-3.5 h-3.5" />}
                        onClick={() => handleContinueVerification(item.id)}
                      >
                        Verify
                      </Button>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Download className="w-3.5 h-3.5 text-zinc-300 hover:text-white" />}
                        onClick={() => handleOpenExportModal(item)}
                        aria-label="Export Record"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-white" />}
                        onClick={() => setDeleteTargetId(item.id)}
                        aria-label="Delete History Item"
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DETAILED RESULT VIEW MODAL */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        title={detailRecord?.metadata.title || 'Inscription Record Detail'}
        subtitle={detailRecord?.metadata.provenance}
        maxWidth="2xl"
      >
        {detailRecord && (
          <div className="space-y-6 font-mono text-xs">
            {/* Header Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Catalog ID</span>
                <span className="text-white font-bold">{detailRecord.metadata.corpusCatalogId}</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Script</span>
                <span className="text-white font-bold">{detailRecord.metadata.script}</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Period</span>
                <span className="text-zinc-300">{detailRecord.metadata.period}</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800">
                <span className="text-zinc-400 block text-[10px] uppercase">Confidence</span>
                <span className="text-white font-bold">{detailRecord.ocr.averageConfidence.toFixed(1)}%</span>
              </div>
            </div>

            {/* Inscription Image & Raw Brahmi Stream */}
            <div className="space-y-2">
              <span className="text-zinc-400 uppercase text-[10px] font-semibold">Raw Brahmi OCR Stream</span>
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-white font-serif text-2xl tracking-widest">
                {detailRecord.ocr.rawBrahmiLine}
              </div>
            </div>

            {/* Transliteration & Translations */}
            <div className="space-y-3">
              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-zinc-400 text-[10px] uppercase">IAST Transliteration:</span>
                <p className="text-white font-semibold">{detailRecord.transliteration.iastText}</p>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-zinc-400 text-[10px] uppercase">English Translation:</span>
                <p className="text-zinc-200 font-serif text-sm">"{detailRecord.translation.englishTranslation}"</p>
              </div>

              <div className="p-3 bg-zinc-950 rounded border border-zinc-800 space-y-1">
                <span className="text-zinc-400 text-[10px] uppercase">Hindi Translation (हिंदी):</span>
                <p className="text-zinc-100 font-serif text-sm">"{detailRecord.translation.hindiTranslation}"</p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-zinc-800">
              <Button
                variant="outline"
                icon={<Download className="w-4 h-4" />}
                onClick={() => {
                  const rec = detailRecord;
                  setDetailRecord(null);
                  handleOpenExportModal(rec.metadata);
                }}
              >
                Export Options
              </Button>
              <Button
                variant="primary"
                icon={<BookOpenCheck className="w-4 h-4" />}
                onClick={() => {
                  setActiveId(detailRecord.metadata.id);
                  setDetailRecord(null);
                  navigate('/verification');
                }}
              >
                Open Verification
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* EXPORT OPTIONS MODAL (PDF / JSON / TXT / TEI-XML) */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!exportTargetRecord}
        onClose={() => setExportTargetRecord(null)}
        title="Export Publication-Ready Epigraphical Data"
        subtitle={`Export options for ${exportTargetRecord?.metadata.corpusCatalogId}`}
      >
        {exportTargetRecord && (
          <div className="space-y-5 font-mono text-xs">
            <div className="space-y-2">
              <label className="text-zinc-300 block font-semibold">Select Export Format:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setExportFormat('pdf')}
                  className={`p-3 rounded border text-center transition-all ${
                    exportFormat === 'pdf'
                      ? 'bg-white text-black border-zinc-300 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <FileText className="w-5 h-5 mx-auto mb-1" />
                  PDF Report
                </button>

                <button
                  onClick={() => setExportFormat('json')}
                  className={`p-3 rounded border text-center transition-all ${
                    exportFormat === 'json'
                      ? 'bg-white text-black border-zinc-300 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-base block font-mono">JSON</span>
                  JSON Schema
                </button>

                <button
                  onClick={() => setExportFormat('txt')}
                  className={`p-3 rounded border text-center transition-all ${
                    exportFormat === 'txt'
                      ? 'bg-white text-black border-zinc-300 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-base block font-mono">TXT</span>
                  Plain Text
                </button>

                <button
                  onClick={() => setExportFormat('tei-xml')}
                  className={`p-3 rounded border text-center transition-all ${
                    exportFormat === 'tei-xml'
                      ? 'bg-white text-black border-zinc-300 font-bold'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  <span className="font-bold text-base block font-mono">XML</span>
                  TEI-EpiDoc
                </button>
              </div>
            </div>

            <div className="p-3 bg-zinc-950 rounded border border-zinc-800 text-zinc-300 space-y-1">
              <p className="font-semibold text-white">Export Payload Content:</p>
              <p>• Original Image Metadata & Catalog Ref</p>
              <p>• Recognized Characters & Softmax Confidence</p>
              <p>• Human Verification Corrections & Audit Sign-off</p>
              <p>• IAST Transliteration & Dual Translations (Hindi/English)</p>
              <p>• Contextual Historical Explanation & Reign Notes</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button variant="ghost" onClick={() => setExportTargetRecord(null)}>
                Cancel
              </Button>
              <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleExecuteExport}>
                Download File
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION DIALOG */}
      {/* ========================================================================= */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Confirm Catalog Item Deletion"
        subtitle="Remove this analysis record from session history?"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 bg-zinc-900 border border-zinc-700 rounded text-zinc-200">
            <p className="font-bold mb-1 text-white">Warning: Permanent Removal</p>
            <p className="text-zinc-300 font-sans text-xs">
              This action will remove the selected record from your session history catalog.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" icon={<Trash2 className="w-4 h-4" />} onClick={handleConfirmDelete}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export { ArchivalHistory as History };
