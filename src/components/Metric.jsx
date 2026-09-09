function formatMetricValue(value) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  // Direct numeric values
  if (typeof value === "number" && Number.isFinite(value)) {
    return Number.isInteger(value)
      ? String(value)
      : value.toFixed(2).replace(/\.?0+$/, "");
  }

  const text = String(value);

  // Format numbers inside strings as well.
  // Example:
  // "-21.700000 / 31.700000"
  // becomes:
  // "-21.7 / 31.7"
  return text.replace(
    /-?\d+(?:\.\d+)?/g,
    (match) => {
      const number = Number(match);

      if (!Number.isFinite(number)) {
        return match;
      }

      return Number.isInteger(number)
        ? String(number)
        : number.toFixed(2).replace(/\.?0+$/, "");
    }
  );
}

export default function Metric({ label, value, unit = "" }) {
  return (
    <div className="metric">
      <span>{label}</span>

      <strong>
        {formatMetricValue(value)}
        {unit}
      </strong>
    </div>
  );
}