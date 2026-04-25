/**
 * QR Code Utility Functions
 * Generate unique QR codes for bookings
 */

/**
 * Generate unique QR code token
 * Format: SUNEST-YYYYMMDD-XXXX
 * Example: SUNEST-20260207-A1B2
 */
export function generateQRCodeToken(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // Generate random 4-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomCode = '';
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `SUNEST-${dateStr}-${randomCode}`;
}

/**
 * Validate QR code token format
 */
export function validateQRCodeToken(token: string): boolean {
  const pattern = /^SUNEST-\d{8}-[A-Z0-9]{4}$/;
  return pattern.test(token);
}

/**
 * Get QR Code image URL from API
 * Using public QR code API: https://api.qrserver.com
 */
export function getQRCodeImageURL(token: string, size: number = 200): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(token)}`;
}

/**
 * Generate QR code data for booking
 */
export interface QRCodeData {
  token: string;
  imageURL: string;
  generated_at: string;
  booking_id?: string;
}

export function generateQRCodeData(bookingId?: string): QRCodeData {
  const token = generateQRCodeToken();
  return {
    token,
    imageURL: getQRCodeImageURL(token, 300),
    generated_at: new Date().toISOString(),
    booking_id: bookingId
  };
}
