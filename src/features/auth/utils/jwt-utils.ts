/**
 * JWT Utilities
 * Functions to decode and extract information from JWT tokens
 */

interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat: number; // Issued at
  exp: number; // Expiration
}

/**
 * Decode JWT token (simple base64 decode, no verification)
 * Note: This does NOT verify the signature. It's only used to extract data from the payload.
 * The backend should always verify the token.
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    // JWT structure: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode payload (second part)
    const payload = parts[1];

    // Replace URL-safe characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64
    const decoded = atob(base64);

    // Parse JSON
    const parsed = JSON.parse(decoded) as JWTPayload;

    return parsed;
  } catch (error) {
    console.error('❌ [JWT] Error decoding token:', error);
    throw new Error('Failed to decode JWT token');
  }
}

/**
 * Check if JWT token is expired (client-side check only)
 */
export function isJWTExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    const now = Math.floor(Date.now() / 1000); // Current time in seconds

    return now >= payload.exp;
  } catch (error) {
    console.error('❌ [JWT] Error checking expiration:', error);
    return true; // Assume expired if we can't decode
  }
}

/**
 * Get user ID from JWT token
 */
export function getUserIdFromToken(token: string): string {
  try {
    const payload = decodeJWT(token);
    return payload.sub;
  } catch (error) {
    console.error('❌ [JWT] Error getting user ID from token:', error);
    throw error;
  }
}

/**
 * Get email from JWT token
 */
export function getEmailFromToken(token: string): string {
  try {
    const payload = decodeJWT(token);
    return payload.email;
  } catch (error) {
    console.error('❌ [JWT] Error getting email from token:', error);
    throw error;
  }
}
