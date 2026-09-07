import {
  computeSettleYears,
  coveredMonths,
  diffMonths,
  lastPaidYear,
  resolveEndDate,
  resolveStartDate
} from './settlePeriod';
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
  describe('resolveStartDate / resolveEndDate', () => {
    it('returns the full year when the establishment dates fall outside it', () => {
      const source = { startDate: '2013-07-05T00:00:00Z', endDate: null };
      expect(resolveStartDate(source, 2024)).toBe('2024-01-01');
      expect(resolveEndDate(source, 2024)).toBe('2024-12-31');
    });

    it('returns the establishment dates when they fall inside the year', () => {
      const source = { startDate: '2024-03-15T00:00:00Z', endDate: '2024-10-01T00:00:00Z' };
      expect(resolveStartDate(source, 2024)).toBe('2024-03-15');
      expect(resolveEndDate(source, 2024)).toBe('2024-10-01');
    });
  });

  describe('diffMonths', () => {
    it('returns 12 for a full year', () => {
      expect(diffMonths('2024-01-01', '2024-12-31')).toBe(12);
    });

    it('counts partial months inclusively', () => {
      expect(diffMonths('2024-03-15', '2024-10-01')).toBe(8);
    });

    it('returns 0 when a date is missing', () => {
      expect(diffMonths('', '2024-10-01')).toBe(0);
    });
  });

  describe('coveredMonths', () => {
    it('marks every month for a full year', () => {
      expect(coveredMonths('2024-01-01', '2024-12-31', 2024)).toEqual(Array(12).fill(true));
    });

    it('marks only the months touched by a partial period', () => {
      const covered = coveredMonths('2024-03-15', '2024-05-02', 2024);
      expect(covered.filter(Boolean)).toHaveLength(3);
      expect(covered[1]).toBe(false);
      expect(covered[2]).toBe(true);
      expect(covered[4]).toBe(true);
      expect(covered[5]).toBe(false);
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
