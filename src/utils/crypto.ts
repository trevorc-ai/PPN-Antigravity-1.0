/**
 * Cryptographic utility functions for client-side hashing
 * Used for privacy-preserving operations like blind vetting
 */

/**
 * Hash a phone number using SHA-256 with salt
 * @param phoneNumber - Phone number to hash (will be normalized)
 * @returns Hex-encoded SHA-256 hash
 */
export async function hashPhoneNumber(phoneNumber: string): Promise<string> {
    // Get salt from environment variable or use default
    const salt = import.meta.env.VITE_HASH_SALT || 'ppn-default-salt-2026';

    // Normalize phone number (remove all non-digits)
    const normalized = phoneNumber.replace(/\D/g, '');

    // Combine normalized number with salt
    const data = normalized + salt;

    // Encode as UTF-8
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    // Hash using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

/**
 * Format phone number with mask: (XXX) XXX-XXXX
 * @param value - Raw input value
 * @returns Formatted phone number or original value if not valid
 */
export function formatPhoneNumber(value: string): string {
    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 0) return '';

    if (cleaned.length <= 3) {
        return cleaned;
    } else if (cleaned.length <= 6) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    } else if (cleaned.length <= 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    } else {
        // Limit to 10 digits
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    }
}
