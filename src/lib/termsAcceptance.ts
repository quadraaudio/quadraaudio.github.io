import { TERMS_VERSION } from "@/data/terms.eula";

const STORAGE_KEY = "quadra.termsAccepted";

export type TermsAcceptanceRecord = {
  version: string;
  acceptedAt: string;
};

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getCurrentTermsVersion(): string {
  return TERMS_VERSION;
}

export function readTermsAcceptance(): TermsAcceptanceRecord | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TermsAcceptanceRecord;
    if (!parsed?.version || !parsed?.acceptedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function hasAcceptedCurrentTerms(): boolean {
  const record = readTermsAcceptance();
  return record?.version === TERMS_VERSION;
}

export function acceptCurrentTerms(): TermsAcceptanceRecord {
  const record: TermsAcceptanceRecord = {
    version: TERMS_VERSION,
    acceptedAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  }
  return record;
}
