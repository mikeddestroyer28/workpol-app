export function estMonthlyNet(payU26, isU26 = true) {
  return Math.round(payU26 * 40 * 4.33 * (isU26 ? 0.87 : 0.7));
}
export function calcPay({ rate, hours, isU26 }) {
  const d = isU26 ? 0.8693 : 0.7;
  const weeklyNet = Math.round(rate * hours * d);
  const monthlyNet = Math.round(weeklyNet * 4.33);
  const annualNet = monthlyNet * 12;
  const note = isU26
    ? "⚡ Under-26 rate — PIT-0 income tax waived. ~13% ZUS applies on umowa zlecenie."
    : "📊 Standard rate — 12% PIT + ~23% ZUS estimated. Consult a tax advisor for exact figures.";
  return { weeklyNet, monthlyNet, annualNet, note };
}
export const formatZl = (n) => `${Math.round(n).toLocaleString()} zł`;
