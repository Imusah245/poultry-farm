const { calculateTrend } = require('../../src/utils/trendCalculation');

describe('calculateTrend', () => {
  it('should return 100 when previous is 0 and current is positive', () => {
    expect(calculateTrend(50, 0)).toBe(100);
  });

  it('should return 0 when both current and previous are 0', () => {
    expect(calculateTrend(0, 0)).toBe(0);
  });

  it('should return positive percentage for increase', () => {
    // (150 - 100) / 100 * 100 = 50%
    expect(calculateTrend(150, 100)).toBe(50);
  });

  it('should return negative percentage for decrease', () => {
    // (50 - 100) / 100 * 100 = -50%
    expect(calculateTrend(50, 100)).toBe(-50);
  });

  it('should return 0 when current equals previous', () => {
    expect(calculateTrend(100, 100)).toBe(0);
  });

  it('should handle decimal values correctly', () => {
    // (3 - 2) / 2 * 100 = 50%
    expect(calculateTrend(3, 2)).toBe(50);
  });

  it('should return 100% for doubling', () => {
    // (200 - 100) / 100 * 100 = 100%
    expect(calculateTrend(200, 100)).toBe(100);
  });

  it('should return -100% when current is 0 and previous is positive', () => {
    // (0 - 100) / 100 * 100 = -100%
    expect(calculateTrend(0, 100)).toBe(-100);
  });
});
