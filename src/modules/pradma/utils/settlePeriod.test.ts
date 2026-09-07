import { computeSettleYears, lastPaidYear, settlePeriod } from './settlePeriod';
import type { Invoice } from '../models/invoice.interface';

const invoice = (year: number, status: string): Invoice => ({
  id: year,
  establishmentId: 1,
  year,
  status,
  presentationDate: null,
  expirationDate: null,
  total: 0,
  details: [],
  createdAt: '',
  updatedAt: ''
});

describe('settlePeriod', () => {
  describe('settlePeriod', () => {
    it('returns the full calendar year for the given year', () => {
      expect(settlePeriod(2024)).toEqual({ startDate: '2024-01-01', endDate: '2024-12-31' });
    });
  });

  describe('lastPaidYear', () => {
    it('returns the highest paid year', () => {
      expect(
        lastPaidYear([invoice(2021, 'paid'), invoice(2023, 'paid'), invoice(2024, 'pending')])
      ).toBe(2023);
    });

    it('returns null when nothing is paid', () => {
      expect(lastPaidYear([invoice(2024, 'pending')])).toBeNull();
    });
  });

  describe('computeSettleYears', () => {
    it('returns the years after the last paid one up to the previous year', () => {
      expect(computeSettleYears([invoice(2022, 'paid')], 2026)).toEqual([2023, 2024, 2025]);
    });

    it('returns only the previous year when nothing is paid', () => {
      expect(computeSettleYears([], 2026)).toEqual([2025]);
    });

    it('returns an empty list when the previous year is already paid', () => {
      expect(computeSettleYears([invoice(2025, 'paid')], 2026)).toEqual([]);
    });
  });
});
