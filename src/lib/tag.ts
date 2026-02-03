export function sanitizeKeyForTag(input: string): string {
  let k = (input || "").trim();
  if (k.startsWith("@")) k = k.slice(1);
  // User requested to keep dots and remove "ID" prefix rule.
  // k = k.replace(/\./g, ""); 
  k = k.replace(/[^a-zA-Z0-9_\-.]/g, ""); // Allow dots
  if (!k) return "unknown";
  // if (/^[0-9]/.test(k)) k = `ID${k}`;
  return k;
}

export function makeHashtag(modelKey: string): string {
  // User wants just "#" + key, no extra "id" text prefix? 
  // The user said: "en la parte de identificadores ahí ponemos el ID o los IDs o alias que tiene la modelo"
  // and "cuando tienen número al inicio pone un prefijo 'ID' hay que quitarlo".
  // Existing code was `#id${sanitized}`. I'll change to `#{sanitized}` to be cleaner.
  return `#${sanitizeKeyForTag(modelKey)}`;
}
