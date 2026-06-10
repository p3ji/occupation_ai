import React, { useState, useMemo } from 'react';
import canadaMapData from '@svg-maps/canada';

export default function CanadaMap({ selectedNoc, provinceData, occupations }) {
  const [hoveredProv, setHoveredProv] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Get active occupation details
  const activeOcc = useMemo(() => {
    return occupations?.find(o => o.noc === selectedNoc);
  }, [selectedNoc, occupations]);

  // Extract min and max salaries across all provinces for the color scale
  const salaryRange = useMemo(() => {
    if (!selectedNoc || !provinceData) return { min: 0, max: 0 };
    
    let salaries = [];
    Object.keys(provinceData).forEach(provCode => {
      const occData = provinceData[provCode]?.occupations?.[selectedNoc];
      if (occData && occData.medianSalary) {
        salaries.push(occData.medianSalary);
      }
    });

    if (salaries.length === 0) return { min: 40000, max: 120000 };
    return {
      min: Math.min(...salaries),
      max: Math.max(...salaries)
    };
  }, [selectedNoc, provinceData]);

  // Color interpolation: Map salary to a sleek gradient (from dark slate to bright cyan/accent)
  const getFillColor = (provCode) => {
    if (!selectedNoc || !provinceData) return 'rgba(39, 39, 42, 0.4)'; // zinc-800/40

    const provOcc = provinceData[provCode]?.occupations?.[selectedNoc];
    if (!provOcc || !provOcc.medianSalary) return 'rgba(39, 39, 42, 0.4)';

    const salary = provOcc.medianSalary;
    const { min, max } = salaryRange;
    
    if (max === min) return '#14b8a6'; // teal-500 default

    const ratio = (salary - min) / (max - min);
    
    // We want a premium gradient from a dark blue-slate to a vibrant cyan-teal
    // HSL: 200 (slate/blue) to 170 (teal) or 180 (cyan)
    // S: 60% to 90%, L: 20% to 50%
    const hue = 195 + ratio * 35; // 195 (blue) to 230 (indigo) or 180 (cyan)
    const sat = 55 + ratio * 35;  // 55% to 90%
    const light = 25 + ratio * 30; // 25% (dark) to 55% (bright)
    
    return `hsl(${hue}, ${sat}%, ${light}%)`;
  };

  const handleMouseMove = (e) => {
    // Offset for the tooltip
    setTooltipPos({
      x: e.clientX + 15,
      y: e.clientY + 15
    });
  };

  const hoveredData = useMemo(() => {
    if (!hoveredProv || !provinceData || !selectedNoc) return null;
    const provCode = hoveredProv.id.toUpperCase();
    const provDetails = provinceData[provCode];
    const occDetails = provDetails?.occupations?.[selectedNoc];

    return {
      provName: provDetails?.name || hoveredProv.name,
      employment: occDetails?.employment ?? 0,
      salary: occDetails?.medianSalary ?? 0
    };
  }, [hoveredProv, provinceData, selectedNoc]);

  return (
    <div className="relative w-full h-[380px] sm:h-[450px] bg-surface/30 rounded-xl border border-border overflow-hidden p-4 flex flex-col items-center justify-center">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-sm font-semibold text-white">Provincial Labor Distribution</h4>
        {activeOcc && (
          <p className="text-xs text-muted mt-0.5 truncate max-w-[250px]">
            {activeOcc.title}
          </p>
        )}
      </div>

      {/* Map SVG container */}
      <svg
        viewBox={canadaMapData.viewBox}
        className="w-full h-full max-h-[350px] sm:max-h-[380px] select-none mt-4"
        style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
      >
        {canadaMapData.locations.map(loc => {
          const provCode = loc.id.toUpperCase();
          const isHovered = hoveredProv?.id === loc.id;
          
          return (
            <path
              key={loc.id}
              d={loc.path}
              id={loc.id}
              name={loc.name}
              fill={getFillColor(provCode)}
              stroke={isHovered ? 'var(--color-primary-bright)' : '#18181b'}
              strokeWidth={isHovered ? '2.5' : '1'}
              className="cursor-pointer transition-colors duration-200"
              style={{
                transition: 'fill 0.3s ease, stroke 0.2s ease, stroke-width 0.2s ease',
              }}
              onMouseEnter={() => setHoveredProv(loc)}
              onMouseLeave={() => setHoveredProv(null)}
              onMouseMove={handleMouseMove}
            />
          );
        })}
      </svg>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-800/60 pt-3">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-surface border border-border" />
          No Data
        </span>
        <div className="flex items-center gap-2">
          <span>Min CAD</span>
          <div className="w-24 h-2 rounded bg-gradient-to-r from-[hsl(195,55%,25%)] to-[hsl(230,90%,55%)]" />
          <span>Max CAD</span>
        </div>
      </div>

      {/* Floating Tooltip */}
      {hoveredProv && hoveredData && (
        <div
          className="fixed pointer-events-none z-50 bg-zinc-950/95 border border-border-bright rounded-lg p-3 shadow-xl backdrop-blur-md text-xs min-w-[150px] animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`
          }}
        >
          <div className="font-bold text-white mb-1">{hoveredData.provName}</div>
          <div className="space-y-0.5">
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Median Salary:</span>
              <span className="font-semibold text-accent tabular-nums">
                {hoveredData.salary 
                  ? `$${hoveredData.salary.toLocaleString()}` 
                  : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-zinc-500">Employment:</span>
              <span className="font-semibold text-white tabular-nums">
                {hoveredData.employment 
                  ? hoveredData.employment.toLocaleString() 
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
