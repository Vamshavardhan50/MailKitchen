export function phoneHref(phone: string) {
  // German numbers sometimes display the domestic trunk prefix, e.g. +49 (030).
  const dialable = phone.trim().replace(/^(\+49)\s*\(0/, '$1(');
  return 'tel:' + dialable.replace(/[^+\d]/g, '');
}
