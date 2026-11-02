import React, { useState, useMemo } from 'react';
import {
  DvbSPolarization,
  LNB_BAND_THRESHOLD,
  LNB_CONFIGS,
  POLARITY_MAPPING,
  POLARITY_VOLTAGE,
} from '../types/rf';
import { isIfInRange, lnbBandLabel, LNB_IF_MAX_MHZ, LNB_IF_MIN_MHZ } from '../lib/rf';

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


  const bandLabel = lnbBandLabel(results.freq);
  const ifOutOfRange = results.fi > 0 && !isIfInRange(results.fi);

  return (
    <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl p-6 shadow-md transition-all duration-200 hover:border-[var(--color-flux-wine)]">
      {/* Header */}
      <div className="border-b border-[var(--theme-border)] pb-4 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[var(--theme-text-primary)] font-sans">
          DVB-S/S2 LNB & Coaxial IF Utility
        </h2>
        <span className="bg-[var(--color-flux-slate)] text-[var(--theme-text-on-brand)] text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
          Universal Ku LNB
        </span>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
            Satellite Frequency (MHz)
          </label>
          <input
            type="number"
            value={frequency || ''}
            onChange={(e) => setFrequency(parseFloat(e.target.value))}
            placeholder="e.g. 11780"
            className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
          />
          <span className="text-[10px] text-[var(--theme-text-secondary)] mt-1 block">
            Ku threshold: {LNB_BAND_THRESHOLD} MHz{bandLabel ? ` (${bandLabel})` : ''}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
            LNB Polarization
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setPolarization('V')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                polarization === 'V'
                  ? 'bg-[var(--color-flux-wine)] text-[var(--theme-text-on-brand)] border-[var(--color-flux-wine)] shadow-md shadow-[var(--color-flux-wine)]/25'
                  : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border-[var(--theme-border)] hover:border-[var(--color-flux-accent)] hover:text-[var(--color-flux-accent)]'
              }`}
            >
              Vertical (V)
            </button>
            <button
              onClick={() => setPolarization('H')}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 border ${
                polarization === 'H'
                  ? 'bg-[var(--color-flux-wine)] text-[var(--theme-text-on-brand)] border-[var(--color-flux-wine)] shadow-md shadow-[var(--color-flux-wine)]/25'
                  : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border-[var(--theme-border)] hover:border-[var(--color-flux-accent)] hover:text-[var(--color-flux-accent)]'
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
        <div className="bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-4 transition-all duration-200 hover:border-[var(--color-flux-wine)]/30">
          <div className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
            Cable Coaxial (FI)
          </div>
          <div className="text-2xl font-bold text-[var(--theme-text-primary)] font-mono select-all mt-2">
            {results.fi > 0 ? `${results.fi.toFixed(1)}` : '0.0'}{' '}
            <span className="text-sm font-sans font-normal text-[var(--theme-text-secondary)]">MHz</span>
          </div>
          <div className="text-[10px] text-[var(--theme-text-secondary)] font-sans mt-2 border-t border-[var(--theme-border)]/50 pt-2">
            LO: {results.lo} MHz | F - LO
          </div>
        </div>

        {/* Metric 2: Quad Matrix */}
        <div className="bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-4 transition-all duration-200 hover:border-[var(--color-flux-wine)]/30">
          <div className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
            Matrix Quadrant
          </div>
          <div className="text-2xl font-bold text-[var(--color-flux-success)] font-mono select-all mt-2">
            {results.quadrant}
          </div>
          <div className="text-[10px] text-[var(--theme-text-secondary)] font-sans mt-2 border-t border-[var(--theme-border)]/50 pt-2 truncate">
            {results.quadrantName}
          </div>
        </div>

        {/* Metric 3: pilot tone */}
        <div className="bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-4 transition-all duration-200 hover:border-[var(--color-flux-wine)]/30">
          <div className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
            LNB Pilot Tone
          </div>
          <div className="text-2xl font-bold text-[var(--color-flux-terracotta)] font-mono select-all mt-2">
            {results.tone}
          </div>
          <div className="text-[10px] text-[var(--theme-text-secondary)] font-sans mt-2 border-t border-[var(--theme-border)]/50 pt-2">
            Band: {bandLabel ?? '\u2014'}
          </div>
        </div>

        {/* Metric 4: switching voltage */}
        <div className="bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-4 transition-all duration-200 hover:border-[var(--color-flux-wine)]/30">
          <div className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
            Switching Voltage
          </div>
          <div className="text-2xl font-bold text-[var(--color-flux-accent)] font-mono select-all mt-2">
            {results.voltage}
          </div>
          <div className="text-[10px] text-[var(--theme-text-secondary)] font-sans mt-2 border-t border-[var(--theme-border)]/50 pt-2">
            Mapped polarity: {POLARITY_MAPPING[polarization]}
          </div>
        </div>
      </div>

      {ifOutOfRange && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-[var(--color-flux-warning)]/40 bg-[var(--color-flux-warning)]/10 px-4 py-3 text-xs font-sans text-[var(--color-flux-warning)]"
        >
          Intermediate frequency of {results.fi.toFixed(1)} MHz falls outside the{' '}
          {LNB_IF_MIN_MHZ}-{LNB_IF_MAX_MHZ} MHz LNB output window.
        </div>
      )}
    </div>
  );
};
