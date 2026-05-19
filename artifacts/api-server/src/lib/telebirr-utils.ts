/**
 * Utility functions for Telebirr payment integration
 * Ported from the Python telebirr library
 */

import { createHash, createSign, createVerify } from "crypto";

/**
 * Sign data using SHA256 with RSA private key
 */
export function signSha256(data: Record<string, unknown>, privateKey: string): string {
  // Convert data to string format for signing
  // Exclude certain fields as per the Python library
  const excludeFields = [
    "sign",
    "sign_type",
    "header",
    "refund_info",
    "openType",
    "raw_request",
    "biz_cont"
  ];
  
  const flatData: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      for (const [k, v] of Object.entries(value)) {
        if (!excludeFields.includes(k)) {
          flatData[k] = v;
        }
      }
    } else if (!excludeFields.includes(key)) {
      flatData[key] = value;
    }
  }
  
  // Sort keys and create query string
  const sortedKeys = Object.keys(flatData).sort();
  const queryString = sortedKeys
    .map(key => `${key}=${flatData[key]}`)
    .join("&");
  
  // Create signature
  const sign = createSign("RSA-SHA256");
  sign.update(queryString);
  sign.end();
  
  // Note: In the Python library, they use the private key for signing
  // But typically for signing you'd use the private key, and for verification you'd use the public key
  // However, looking at the Python code, it seems they're using the private key for both encryption and signing
  // This is unusual but let's follow their approach for compatibility
  return sign.sign(privateKey, "base64").toString().toUpperCase();
}

/**
 * Verify signature using SHA256 with RSA public key
 */
export function verifySha256(
  data: Record<string, unknown>,
  signature: string,
  publicKey: string
): boolean {
  // Convert data to string format for verification (same as signing)
  const excludeFields = [
    "sign",
    "sign_type",
    "header",
    "refund_info",
    "openType",
    "raw_request",
    "biz_cont"
  ];
  
  const flatData: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      for (const [k, v] of Object.entries(value)) {
        if (!excludeFields.includes(k)) {
          flatData[k] = v;
        }
      }
    } else if (!excludeFields.includes(key)) {
      flatData[key] = value;
    }
  }
  
  // Sort keys and create query string
  const sortedKeys = Object.keys(flatData).sort();
  const queryString = sortedKeys
    .map(key => `${key}=${flatData[key]}`)
    .join("&");
  
  // Verify signature
  const verify = createVerify("RSA-SHA256");
  verify.update(queryString);
  verify.end();
  
  return verify.verify(publicKey, signature, "base64");
}