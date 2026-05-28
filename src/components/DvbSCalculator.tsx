import React, { useState, useMemo } from 'react';
import {
  DvbSPolarization,
  LNB_BAND_THRESHOLD,
  LNB_CONFIGS,
  POLARITY_MAPPING,
  POLARITY_VOLTAGE,
} from '../types/rf';

export const DvbSCalculator: React.FC = () => {
  // 1. Component State
  const [frequency, setFrequency] = useState<number>(10750); // Default low band frequency in MHz
  const [polarization, setPolarization] = useState<DvbSPolarization>('H');

  // 2. Strict Calculations using useMemo
  const results = useMemo(() => {
    // Basic range validation
    const freq = isNaN(frequency) || frequency <= 0 ? 0 : frequency;

    // LNB Rule Selector
    const isHighBand = freq >= LNB_BAND_THRESHOLD;
    const lnb = isHighBand ? LNB_CONFIGS.HIGH : LNB_CONFIGS.LOW;

    // Calculated Intermediate Frequency: FI = Sat_Freq - LO
    const fi = freq > 0 ? freq - lnb.lo : 0;

    // Polarization translation & voltage switching
    const mappedPolarity = POLARITY_MAPPING[polarization];
    const voltage = POLARITY_VOLTAGE[mappedPolarity];

    // Quadrant: Concatenate resulting polarity and band code (e.g. VL, HH)
    const quadrant = `${mappedPolarity}${lnb.code}`;

    // Quadrant verbose explanation
    const quadrantNames: Record<string, string> = {
      'VL': 'Vertical Low (VL)',
      'VH': 'Vertical High (VH)',
      'HL': 'Horizontal Low (HL)',
      'HH': 'Horizontal High (HH)',
    };

    return {
      freq,
      lnbName: lnb.name,
      lo: lnb.lo,
      tone: lnb.tone,
      fi,
      voltage,
      quadrant,
      quadrantName: quadrantNames[quadrant] || quadrant,
    };
  }, [frequency, polarization]);


  return (
    <div className="bg-theme-surface border border-theme-border rounded-xl p-6 shadow-md transition-all duration-200 hover:border-theme-card-hover-border">
      {/* Header */}
      <div className="border-b border-theme-border pb-4 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-theme-text-primary font-sans">
          DVB-S/S2 LNB & Coaxial IF Utility
        </h2>
        <span className="bg-flux-slate text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
          Universal Ku LNB
        </span>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">
            Satellite Frequency (MHz)
          </label>
          <input
            type="number"
            value={frequency || ''}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            placeholder="e.g. 11780"
            className="w-full bg-theme-input-bg text-theme-text-primary border border-theme-border rounded-lg px-3 py-2.5 text-sm focus:border-flux-accent focus:ring-2 focus:ring-flux-accent/10 focus:outline-none transition-all duration-200"
          />
          <span className="text-[10px] text-theme-text-secondary mt-1 block">
            Ku Threshold: 11,700 MHz ({results.freq < LNB_BAND_THRESHOLD ? 'Low Band' : 'High Band'})
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-theme-text-secondary uppercase tracking-wider mb-2">
            LNB Polarization
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPolarization('V')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                polarization === 'V'
                  ? 'bg-flux-wine text-white border-flux-wine shadow-md shadow-flux-wine/25'
                  : 'bg-theme-input-bg text-theme-text-secondary border-theme-border hover:border-flux-accent hover:text-flux-accent'
              }`}
            >
              Vertical (V)
            </button>
            <button
              onClick={() => setPolarization('H')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                polarization === 'H'
                  ? 'bg-flux-wine text-white border-flux-wine shadow-md shadow-flux-wine/25'
                  : 'bg-theme-input-bg text-theme-text-secondary border-theme-border hover:border-flux-accent hover:text-flux-accent'
              }`}
            >
              Horizontal (H)
            </button>
          </div>
        </div>
      </div>

      {/* Calculations Grid Output */}
      <div className="grid grid-cols-2 gap-4">
        {/* Metric 1: Intermediate Frequency */}
        <div className="bg-theme-bg border border-theme-border rounded-xl p-4 transition-all duration-200 hover:border-flux-wine/30">
          <div className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">
            Cable Coaxial (FI)
          </div>
          <div className="text-2xl font-bold text-theme-text-primary font-mono select-all mt-2">
            {results.fi > 0 ? `${results.fi.toFixed(1)}` : '0.0'}{' '}
            <span className="text-sm font-sans font-normal text-theme-text-secondary">MHz</span>
          </div>
          <div className="text-[10px] text-theme-text-secondary font-sans mt-2 border-t border-theme-border/50 pt-2">
            LO: {results.lo} MHz | F - LO
          </div>
        </div>

        {/* Metric 2: Quad Matrix */}
        <div className="bg-theme-bg border border-theme-border rounded-xl p-4 transition-all duration-200 hover:border-flux-wine/30">
          <div className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">
            Matrix Quadrant
          </div>
          <div className="text-2xl font-bold text-flux-success font-mono select-all mt-2">
            {results.quadrant}
          </div>
          <div className="text-[10px] text-theme-text-secondary font-sans mt-2 border-t border-theme-border/50 pt-2 truncate">
            {results.quadrantName}
          </div>
        </div>

        {/* Metric 3: pilot tone */}
        <div className="bg-theme-bg border border-theme-border rounded-xl p-4 transition-all duration-200 hover:border-flux-wine/30">
          <div className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">
            LNB Pilot Tone
          </div>
          <div className="text-2xl font-bold text-flux-terracotta font-mono select-all mt-2">
            {results.tone}
          </div>
          <div className="text-[10px] text-theme-text-secondary font-sans mt-2 border-t border-theme-border/50 pt-2">
            Band: {results.freq >= LNB_BAND_THRESHOLD ? 'High' : 'Low'}
          </div>
        </div>

        {/* Metric 4: switching voltage */}
        <div className="bg-theme-bg border border-theme-border rounded-xl p-4 transition-all duration-200 hover:border-flux-wine/30">
          <div className="text-xs font-semibold text-theme-text-secondary uppercase tracking-wider">
            Switching Voltage
          </div>
          <div className="text-2xl font-bold text-flux-accent font-mono select-all mt-2">
            {results.voltage}
          </div>
          <div className="text-[10px] text-theme-text-secondary font-sans mt-2 border-t border-theme-border/50 pt-2">
            Mapped polarity: {POLARITY_MAPPING[polarization]}
          </div>
        </div>
      </div>
    </div>
  );
};
