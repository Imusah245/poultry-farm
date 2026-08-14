/**
 * Calculate percentage trend between current and previous values.
 * @param {number} current - Current period value
 * @param {number} previous - Previous period value
 * @returns {number} Percentage change
 */
const calculateTrend = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

module.exports = { calculateTrend };
