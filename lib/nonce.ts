// lib/nonce.ts
export function generateNonce() {
  const nonceBytes = new Uint8Array(16);
  crypto.getRandomValues(nonceBytes);
  return btoa(String.fromCharCode(...nonceBytes));
}
