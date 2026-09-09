export function requireFields(body, fields) {
  const missing = fields.filter((field) => body?.[field] === undefined || body[field] === "");
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(", ")}`);
    error.status = 400;
    throw error;
  }
}

export function positiveNumber(value, field) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    const error = new Error(`${field} must be a positive number`);
    error.status = 400;
    throw error;
  }
  return number;
}

export function normalizeBrief(body) {
  requireFields(body, ["siteLength", "siteWidth", "occupants", "shelterType", "budget"]);
  return {
    ...body,
    siteLength: positiveNumber(body.siteLength, "siteLength"),
    siteWidth: positiveNumber(body.siteWidth, "siteWidth"),
    occupants: Math.max(1, Math.round(positiveNumber(body.occupants, "occupants"))),
    budget: positiveNumber(body.budget, "budget"),
    siteArea: Number(body.siteLength) * Number(body.siteWidth)
  };
}
