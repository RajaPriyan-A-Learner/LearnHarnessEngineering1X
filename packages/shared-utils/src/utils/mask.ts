// packages/shared-utils/src/utils/mask.ts

/**
 * Masks a sensitive value, leaving the last 4 characters visible.
 * Default pattern replaces each preceding character with '*'.
 * Example: "123-45-6789" => "***-**-6789"
 */
export function maskValue(value: string, visibleChars: number = 4): string {
  if (value.length <= visibleChars) return value;
  const maskedLength = value.length - visibleChars;
  const masked = "*".repeat(maskedLength);
  return `${masked}${value.slice(-visibleChars)}`;
}
