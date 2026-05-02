export const formatPKR = (n: number | string | null | undefined) => {
  const v = typeof n === "string" ? Number(n) : n ?? 0;
  if (!Number.isFinite(v as number)) return "₨ 0";
  try {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      maximumFractionDigits: 0,
    }).format(v as number);
  } catch {
    return `₨ ${(v as number).toLocaleString("en-PK")}`;
  }
};

export const formatWeightShort = (tola?: number | null, grams?: number | null) => {
  const t = Number(tola ?? 0);
  if (t > 0) return `${t} tola`;
  const g = Number(grams ?? 0);
  if (g > 0) return `${g} g`;
  return "";
};