// Strict TS Types and Constants for RF Engineering Calculator

// ==========================================
// DVB-T TYPES & CONSTANTS
// ==========================================

export type DvbTMode = '2k' | '8k';
export type DvbTModulation = 'QPSK' | '16-QAM' | '64-QAM';
export type DvbTFec = '1/2' | '2/3' | '3/4' | '5/6' | '7/8';
export type DvbTGuardInterval = '1/4' | '1/8' | '1/16' | '1/32';

export interface DvbTParams {
  mode: DvbTMode;
  modulation: DvbTModulation;
  fec: DvbTFec;
  guardInterval: DvbTGuardInterval;
}

export const DVB_T_CARRIERS: Record<DvbTMode, number> = {
  '2k': 1512,
  '8k': 6048,
};

export const DVB_T_MOD_BITS: Record<DvbTModulation, number> = {
  'QPSK': 2,
  '16-QAM': 4,
  '64-QAM': 6,
};

export const DVB_T_TU: Record<DvbTMode, number> = {
  '2k': 224, // µs
  '8k': 896, // µs
};

export const DVB_T_FEC_VALUES: Record<DvbTFec, number> = {
  '1/2': 1 / 2,
  '2/3': 2 / 3,
  '3/4': 3 / 4,
  '5/6': 5 / 6,
  '7/8': 7 / 8,
};

export const DVB_T_GI_VALUES: Record<DvbTGuardInterval, number> = {
  '1/4': 1 / 4,
  '1/8': 1 / 8,
  '1/16': 1 / 16,
  '1/32': 1 / 32,
};

export const RS_RATE = 188 / 204;

// Capacity thresholds in Mbps
export interface CapacityProfile {
  name: string;
  bitrateNeeded: number;
  type: 'HD' | 'UHD';
}

export const CAPACITY_PROFILES: CapacityProfile[] = [
  { name: 'HD Standard (6 Mbps)', bitrateNeeded: 6, type: 'HD' },
  { name: 'HD High Quality (8 Mbps)', bitrateNeeded: 8, type: 'HD' },
  { name: 'UHD Standard (18 Mbps)', bitrateNeeded: 18, type: 'UHD' },
  { name: 'UHD High Quality (24 Mbps)', bitrateNeeded: 24, type: 'UHD' },
];

// ==========================================
// DVB-S/S2 TYPES & CONSTANTS
// ==========================================

export type DvbSPolarization = 'V' | 'H' | 'R' | 'L';

export interface DvbSParams {
  frequency: number; // MHz
  polarization: DvbSPolarization;
}

export const LNB_BAND_THRESHOLD = 11700; // MHz

export const LNB_CONFIGS = {
  LOW: {
    name: 'Low Band (L)',
    lo: 9750, // MHz
    tone: '0 kHz',
    code: 'L',
  },
  HIGH: {
    name: 'High Band (H)',
    lo: 10600, // MHz
    tone: '22 kHz',
    code: 'H',
  },
} as const;

export const POLARITY_MAPPING: Record<DvbSPolarization, 'V' | 'H'> = {
  'V': 'V',
  'H': 'H',
  'R': 'V',
  'L': 'H',
};

export const POLARITY_VOLTAGE: Record<'V' | 'H', '13V' | '18V'> = {
  'V': '13V',
  'H': '18V',
};
