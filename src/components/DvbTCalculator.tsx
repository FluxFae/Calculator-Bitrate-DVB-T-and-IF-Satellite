import React, { useState, useMemo } from 'react';
import {
  DvbTParams,
  DvbTMode,
  DvbTModulation,
  DvbTFec,
  DvbTGuardInterval,
  DVB_T_CARRIERS,
  DVB_T_MOD_BITS,
  DVB_T_TU,
  DVB_T_FEC_VALUES,
  DVB_T_GI_VALUES,
  RS_RATE,
} from '../types/rf';
import {
  centerToUhfChannel,
  isValidUhfCenter,
  isValidUhfChannel,
  uhfChannelToCenter,
  UHF_FIRST_CENTER_MHZ,
  UHF_FIRST_CHANNEL,
  UHF_LAST_CENTER_MHZ,
  UHF_LAST_CHANNEL,
} from '../lib/rf';

export const DvbTCalculator: React.FC = () => {
  // 1. Component State
  const [params, setParams] = useState<DvbTParams>({
    mode: '8k',
    modulation: '64-QAM',
    fec: '2/3',
    guardInterval: '1/32',
  });

  // UHF Converter State
  const [uhfChannel, setUhfChannel] = useState<number | ''>(46);
  const [centerFreq, setCenterFreq] = useState<number | ''>(674);

  const handleChannelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setUhfChannel('');
      setCenterFreq('');
      return;
    }
    const channel = Number(raw);
    setUhfChannel(channel);
    // An out-of-range channel keeps what was typed but stops deriving a center.
    setCenterFreq(isValidUhfChannel(channel) ? uhfChannelToCenter(channel) : '');
  };

  const handleFreqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setUhfChannel('');
      setCenterFreq('');
      return;
    }
    const center = Number(raw);
    setCenterFreq(center);
    setUhfChannel(isValidUhfCenter(center) ? centerToUhfChannel(center) : '');
  };

  const channelInvalid = uhfChannel !== '' && !isValidUhfChannel(uhfChannel);
  const centerInvalid = centerFreq !== '' && !isValidUhfCenter(centerFreq);

  // 2. State Setters with Strict Casting
  const handleChange = (key: keyof DvbTParams, value: string) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 3. Memoized Math Operations
  const calculations = useMemo(() => {
    const N_data = DVB_T_CARRIERS[params.mode];
    const ModBits = DVB_T_MOD_BITS[params.modulation];
    const Tu = DVB_T_TU[params.mode];
    
    const FEC_val = DVB_T_FEC_VALUES[params.fec];
    const GI_val = DVB_T_GI_VALUES[params.guardInterval];

    // Tg = Tu * GI
    const Tg = Tu * GI_val;
    // Ts = Tu + Tg
    const Ts = Tu + Tg;

    // Bitrate (Mbps) = (N_data * ModBits * FEC_value * RS_Rate) / Ts
    const bitrate = (N_data * ModBits * FEC_val * RS_RATE) / Ts;

    return {
      N_data,
      ModBits,
      Tu,
      Tg,
      Ts,
      bitrate,
    };
  }, [params]);

  // 4. Select Elements Options
  const modes: DvbTMode[] = ['2k', '8k'];
  const modulations: DvbTModulation[] = ['QPSK', '16-QAM', '64-QAM'];
  const fecs: DvbTFec[] = ['1/2', '2/3', '3/4', '5/6', '7/8'];
  const gis: DvbTGuardInterval[] = ['1/4', '1/8', '1/16', '1/32'];

  return (
    <div className="bg-[var(--theme-surface)] border border-[var(--theme-border)] rounded-xl p-6 shadow-md transition-all duration-200 hover:border-[var(--color-flux-wine)]">
      {/* Header */}
      <div className="border-b border-[var(--theme-border)] pb-4 mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-[var(--theme-text-primary)] font-sans">
          DVB-T Bitrate & Payload Calculator
        </h2>
        <span className="bg-[var(--color-flux-wine)] text-[var(--theme-text-on-brand)] text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider">
          DVB-T Standard
        </span>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
            Transmission Mode
          </label>
          <select
            value={params.mode}
            onChange={(e) => handleChange('mode', e.target.value as DvbTMode)}
            className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
          >
            {modes.map((m) => (
              <option key={m} value={m}>
                {m} carriers ({DVB_T_CARRIERS[m]} data)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
            Modulation Scheme
          </label>
          <select
            value={params.modulation}
            onChange={(e) => handleChange('modulation', e.target.value as DvbTModulation)}
            className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
          >
            {modulations.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
            Forward Error Correction (FEC)
          </label>
          <select
            value={params.fec}
            onChange={(e) => handleChange('fec', e.target.value as DvbTFec)}
            className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
          >
            {fecs.map((f) => (
              <option key={f} value={f}>
                {f} Code Rate
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
            Guard Interval (GI)
          </label>
          <select
            value={params.guardInterval}
            onChange={(e) => handleChange('guardInterval', e.target.value as DvbTGuardInterval)}
            className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
          >
            {gis.map((gi) => (
              <option key={gi} value={gi}>
                {gi}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Metric Display */}
      <div className="bg-[var(--theme-bg)] border border-[var(--theme-border)] rounded-xl p-5 mb-6">
        <div className="text-4xl font-bold text-[var(--theme-text-primary)] font-mono select-all">
          {calculations.bitrate.toFixed(3)} <span className="text-lg font-sans text-[var(--theme-text-secondary)]">Mbps</span>
        </div>
        <div className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mt-2">
          Calculated Total Payload Bitrate
        </div>
        
        {/* Micro specs */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[var(--theme-border)] text-center text-xs font-mono text-[var(--theme-text-secondary)]">
          <div>
            <div className="text-[var(--theme-text-primary)] font-bold">{calculations.Tu}µs</div>
            <div>Symbol ($T_u$)</div>
          </div>
          <div>
            <div className="text-[var(--theme-text-primary)] font-bold">{calculations.Tg.toFixed(2)}µs</div>
            <div>Guard ($T_g$)</div>
          </div>
          <div>
            <div className="text-[var(--theme-text-primary)] font-bold">{calculations.Ts.toFixed(2)}µs</div>
            <div>Total ($T_s$)</div>
          </div>
        </div>
      </div>

      {/* UHF Channel to Frequency Converter */}
      <div className="border border-[var(--theme-border)] rounded-xl overflow-hidden bg-[var(--theme-bg)]">
        <div className="border-b border-[var(--theme-border)] px-4 py-3">
          <h3 className="text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider">
            UHF Channel to Frequency Converter
          </h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
              UHF Channel (CH)
            </label>
            <input
              type="number"
              value={uhfChannel}
              onChange={handleChannelChange}
              aria-invalid={channelInvalid}
              placeholder="e.g. 46"
              className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[var(--theme-text-secondary)] uppercase tracking-wider mb-2">
              Center Frequency (MHz)
            </label>
            <input
              type="number"
              value={centerFreq}
              onChange={handleFreqChange}
              aria-invalid={centerInvalid}
              placeholder="e.g. 674"
              className="w-full bg-[var(--theme-input-bg)] text-[var(--theme-text-primary)] border border-[var(--theme-border)] rounded-lg px-3 py-2.5 text-sm focus:border-[var(--color-flux-accent)] focus:ring-2 focus:ring-[var(--color-flux-accent)]/10 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>
        {channelInvalid || centerInvalid ? (
          <div
            role="status"
            className="px-4 pb-3 text-xs font-sans text-[var(--color-flux-warning)]"
          >
            {channelInvalid
              ? `UHF channel must be a whole number between ${UHF_FIRST_CHANNEL} and ${UHF_LAST_CHANNEL}.`
              : `Center frequency must be between ${UHF_FIRST_CENTER_MHZ} and ${UHF_LAST_CENTER_MHZ} MHz.`}
          </div>
        ) : null}
        {typeof centerFreq === 'number' && isValidUhfCenter(centerFreq) && (
          <div className="px-4 py-3 bg-[var(--theme-surface)] border-t border-[var(--theme-border)] text-xs font-mono text-[var(--theme-text-secondary)]">
            Band edges: {(centerFreq - 4).toFixed(2)} MHz - {(centerFreq + 4).toFixed(2)} MHz
          </div>
        )}
      </div>
    </div>
  );
};
