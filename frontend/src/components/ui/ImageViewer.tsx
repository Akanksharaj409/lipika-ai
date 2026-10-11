import React, { useState, useRef } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2, Minimize2, Crop, Layers, Sliders } from 'lucide-react';
import { CharacterSegment, EnhancementConfig } from '../../types/inscription';
import { Button } from './Button';

export interface ImageViewerProps {
  imageUrl: string;
  segments?: CharacterSegment[];
  selectedGlyphId?: string;
  onGlyphSelect?: (segment: CharacterSegment) => void;
  enhancementConfig?: EnhancementConfig;
  showBoundingBoxes?: boolean;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  segments = [],
  selectedGlyphId,
  onGlyphSelect,
  enhancementConfig,
  showBoundingBoxes = true,
}) => {
  const [zoom, setZoom] = useState(100);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  const [showBoxes, setShowBoxes] = useState(showBoundingBoxes);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCropMode, setIsCropMode] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Pan Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 100) {
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleReset = () => {
    setZoom(100);
    setPanOffset({ x: 0, y: 0 });
    setIsCropMode(false);
  };

  const filterStyle = isEnhanced && enhancementConfig
    ? {
        filter: `brightness(${100 + enhancementConfig.brightness}%) contrast(${enhancementConfig.contrast}%) ${
          enhancementConfig.invertColors ? 'invert(100%)' : ''
        } ${enhancementConfig.colorFilter === 'grayscale' ? 'grayscale(100%)' : ''}`,
      }
    : {};

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden flex flex-col group transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen border-none' : 'h-[460px]'
      }`}
    >
      {/* Canvas Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-zinc-900/95 border-b border-zinc-800 text-xs font-mono text-zinc-300 z-20 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="font-semibold text-white">Multispectral Canvas</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300 font-semibold">{segments.length} Glyphs Indexed</span>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Enhancement Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEnhanced(!isEnhanced)}
            className={`text-xs h-7 px-2 ${
              isEnhanced ? 'text-white bg-zinc-800 border border-zinc-600' : 'text-zinc-400'
            }`}
            icon={<Sliders className="w-3.5 h-3.5" />}
          >
            Enhance {isEnhanced ? 'ON' : 'OFF'}
          </Button>

          {/* Crop Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCropMode(!isCropMode)}
            className={`text-xs h-7 px-2 ${
              isCropMode ? 'text-white bg-zinc-800 border border-zinc-600' : 'text-zinc-400'
            }`}
            icon={<Crop className="w-3.5 h-3.5" />}
          >
            Crop {isCropMode ? 'Active' : 'Off'}
          </Button>

          {/* Bounding Boxes Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBoxes(!showBoxes)}
            className={`text-xs h-7 px-2 ${
              showBoxes ? 'text-white bg-zinc-800 border border-zinc-600' : 'text-zinc-400'
            }`}
            icon={<Layers className="w-3.5 h-3.5" />}
          >
            Boxes {showBoxes ? 'ON' : 'OFF'}
          </Button>

          <div className="h-4 w-[1px] bg-zinc-800 mx-1 hidden sm:block" />

          {/* Zoom In / Out / Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.min(300, z + 25))}
            className="text-xs h-7 w-7 p-0"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <span className="text-[11px] font-mono w-10 text-center">{zoom}%</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setZoom((z) => Math.max(75, z - 25))}
            className="text-xs h-7 w-7 p-0"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-xs h-7 w-7 p-0 text-zinc-400"
            aria-label="Reset Zoom & Pan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-xs h-7 w-7 p-0 text-zinc-300 hover:text-white"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`relative flex-1 overflow-hidden bg-grid-pattern p-6 flex items-center justify-center select-none ${
          zoom > 100 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        <div
          className="relative transition-transform duration-75 shadow-2xl border border-zinc-800 rounded"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom / 100})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Base Inscription Image */}
          <img
            src={imageUrl}
            alt="Inscription Surface"
            className="max-h-[360px] object-contain rounded select-none pointer-events-none"
            style={filterStyle}
          />

          {/* Crop Selection Overlay Box */}
          {isCropMode && (
            <div className="absolute inset-8 border-2 border-dashed border-white bg-white/10 pointer-events-none flex items-start justify-end p-2">
              <span className="font-mono text-[9px] bg-zinc-800 text-white px-1.5 py-0.5 rounded">
                Interactive Crop Preview Box
              </span>
            </div>
          )}

          {/* Bounding Boxes Layer */}
          {showBoxes &&
            segments.map((seg) => {
              const isSelected = selectedGlyphId === seg.id;
              const isLowConf = seg.confidence < 70;
              const isMedConf = seg.confidence >= 70 && seg.confidence < 90;

              return (
                <div
                  key={seg.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGlyphSelect && onGlyphSelect(seg);
                  }}
                  className={`absolute border-2 transition-all duration-150 cursor-pointer rounded-xs flex flex-col justify-between p-0.5 ${
                    isSelected
                      ? 'border-white bg-white/30 ring-2 ring-white z-30'
                      : isLowConf
                      ? 'border-zinc-500 bg-black/40 hover:bg-black/60 z-20 border-dashed'
                      : isMedConf
                      ? 'border-zinc-400 bg-zinc-800/40 hover:bg-zinc-800/60 z-10'
                      : 'border-zinc-200 bg-zinc-700/30 hover:bg-zinc-700/50 z-10'
                  }`}
                  style={{
                    left: `${seg.x}%`,
                    top: `${seg.y}%`,
                    width: `${seg.width}%`,
                    height: `${seg.height}%`,
                  }}
                >
                  <span
                    className={`font-mono text-[9px] font-bold px-1 rounded-xs leading-none self-start ${
                      isSelected
                        ? 'bg-white text-black'
                        : isLowConf
                        ? 'bg-black text-zinc-400 border border-zinc-700'
                        : 'bg-zinc-900 text-zinc-200 border border-zinc-700'
                    }`}
                  >
                    {seg.correctedChar || seg.brahmiChar || seg.phoneticIAST}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Footer Legend */}
      <div className="px-4 py-1.5 bg-zinc-950 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white" /> High (&gt;90%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-400" /> Medium (70-89%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-700" /> Low (&lt;70%)
          </span>
        </div>
        <span>{zoom > 100 ? 'Drag to Pan' : 'Click glyph box to inspect'}</span>
      </div>
    </div>
  );
};
