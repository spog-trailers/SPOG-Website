/**
 * Run-time math for the product page Power section. Same math as SPOG's runtime guide:
 * hours = battery kWh / device kW, one device at a time, full battery, no solar counted.
 * Shared by the server render and the browser so the first paint matches.
 */
export function runHours(kwh: number, kw: number) {
  return kwh / kw;
}

export function formatHours(h: number) {
  const value = h < 100 ? (Math.round(h * 10) / 10).toString() : Math.round(h).toString();
  const days = h >= 48 ? `About ${(Math.round((h / 24) * 10) / 10).toString()} days` : '';
  return { value, days };
}
