// Range rules and conversions for the RF calculators.
// Kept as pure functions so the UI rules can be pinned by tests.

import { LNB_BAND_THRESHOLD } from '../types/rf';

// UHF band as declared in the README: channels 21-48, 8 MHz wide, from 474 MHz.
export const UHF_FIRST_CHANNEL = 21;
export const UHF_LAST_CHANNEL = 48;
export const UHF_CHANNEL_WIDTH_MHZ = 8;
export const UHF_FIRST_CENTER_MHZ = 474;
export const UHF_LAST_CENTER_MHZ =
  UHF_FIRST_CENTER_MHZ + (UHF_LAST_CHANNEL - UHF_FIRST_CHANNEL) * UHF_CHANNEL_WIDTH_MHZ;

// Universal Ku-band LNB output window.
export const LNB_IF_MIN_MHZ = 950;
export const LNB_IF_MAX_MHZ = 2150;

export const uhfChannelToCenter = (channel: number): number =>
  UHF_FIRST_CENTER_MHZ + (channel - UHF_FIRST_CHANNEL) * UHF_CHANNEL_WIDTH_MHZ;

export const centerToUhfChannel = (centerMhz: number): number =>
  Math.round((centerMhz - UHF_FIRST_CENTER_MHZ) / UHF_CHANNEL_WIDTH_MHZ) + UHF_FIRST_CHANNEL;

export const isValidUhfChannel = (channel: number): boolean =>
  Number.isInteger(channel) && channel >= UHF_FIRST_CHANNEL && channel <= UHF_LAST_CHANNEL;

export const isValidUhfCenter = (centerMhz: number): boolean =>
  Number.isFinite(centerMhz) &&
  centerMhz >= UHF_FIRST_CENTER_MHZ &&
  centerMhz <= UHF_LAST_CENTER_MHZ;

export const isIfInRange = (fiMhz: number): boolean =>
  Number.isFinite(fiMhz) && fiMhz >= LNB_IF_MIN_MHZ && fiMhz <= LNB_IF_MAX_MHZ;

/**
 * Which universal-LNB band a downlink frequency selects.
 * Returns null when there is no frequency, so an empty input never claims a band.
 */
export const lnbBandLabel = (freqMhz: number): 'Low Band' | 'High Band' | null => {
  if (!Number.isFinite(freqMhz) || freqMhz <= 0) return null;
  return freqMhz >= LNB_BAND_THRESHOLD ? 'High Band' : 'Low Band';
};
