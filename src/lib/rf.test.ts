import { describe, expect, it } from 'vitest';
import {
  centerToUhfChannel,
  isIfInRange,
  isValidUhfCenter,
  isValidUhfChannel,
  lnbBandLabel,
  uhfChannelToCenter,
} from './rf';

describe('UHF channel conversion', () => {
  it('converts a channel to its center frequency and back', () => {
    // Existing behaviour that must keep working.
    expect(uhfChannelToCenter(46)).toBe(674);
    expect(centerToUhfChannel(674)).toBe(46);
    // Band edges declared in the README.
    expect(uhfChannelToCenter(21)).toBe(474);
    expect(uhfChannelToCenter(48)).toBe(690);
  });

  it('rejects anything that is not a whole channel between 21 and 48', () => {
    expect(isValidUhfChannel(21)).toBe(true);
    expect(isValidUhfChannel(48)).toBe(true);
    expect(isValidUhfChannel(20)).toBe(false);
    expect(isValidUhfChannel(49)).toBe(false);
    expect(isValidUhfChannel(21.5)).toBe(false);
  });

  it('rejects center frequencies outside 474-690 MHz', () => {
    expect(isValidUhfCenter(474)).toBe(true);
    expect(isValidUhfCenter(690)).toBe(true);
    expect(isValidUhfCenter(473)).toBe(false);
    expect(isValidUhfCenter(691)).toBe(false);
    expect(isValidUhfCenter(1106)).toBe(false);
  });
});

describe('LNB intermediate frequency', () => {
  it('accepts only the 950-2150 MHz output window', () => {
    expect(isIfInRange(950)).toBe(true);
    expect(isIfInRange(2150)).toBe(true);
    expect(isIfInRange(250)).toBe(false);
    expect(isIfInRange(2200)).toBe(false);
  });

  it('reports no band instead of Low Band when there is no frequency', () => {
    expect(lnbBandLabel(0)).toBeNull();
    expect(lnbBandLabel(10750)).toBe('Low Band');
    expect(lnbBandLabel(12000)).toBe('High Band');
  });
});
