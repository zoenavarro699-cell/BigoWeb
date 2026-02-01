export function sanitizeKeyForTag(input: string): string {
  let k = (input || "").trim();
  if (k.startsWith("@")) k = k.slice(1);
  k = k.replace(/\./g, "");
  k = k.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!k) return "unknown";
  if (/^[0-9]/.test(k)) k = `ID${k}`;
  return k;
}

export function makeHashtag(modelKey: string): string {
  return `#id${sanitizeKeyForTag(modelKey)}`;
}
