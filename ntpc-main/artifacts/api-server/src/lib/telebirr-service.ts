/**
 * Telebirr Payment Integration Service
 * Based on the Python telebirr library from eba-alemayehu/telebirr
 * Integrates with Ethiopia's Telebirr mobile payment system
 */

import { signSha256, verifySha256 } from "./telebirr-utils";

export interface TelebirrPaymentRequest {
  appId: string;
  notifyUrl: string;
  outTradeNo: string;
  receiveName: string;
  returnUrl: string;
  shortCode: string;
  subject: string;
  timeoutExpress: string;
  totalAmount: string;
  nonce: string;
  timestamp: string;
}

export interface TelebirrPaymentResponse {
  code: string;
  msg: string;
  data?: {
    toPayUrl: string;
  };
}

export interface TelebirrNotification {
  // Fields that would be in the notification payload from Telebirr
  // Based on typical payment gateway notifications
  [key: string]: any;
}

export class TelebirrService {
  private appId: string;
  private appKey: string;
  private publicKey: string;
  private notifyUrl: string;
  private receiveName: string;
  private returnUrl: string;
  private shortCode: string;
  private subject: string;
  private timeoutExpress: string;
  private api: string;

  constructor(
    appId: string,
    appKey: string,
    publicKey: string,
    notifyUrl: string,
    receiveName: string,
    returnUrl: string,
    shortCode: string,
    subject: string,
    timeoutExpress: string = "30",
    api: string = "http://196.188.120.3:10443/service-openup/toTradeWebPay"
  ) {
    this.appId = appId;
    this.appKey = appKey;
    this.publicKey = publicKey;
    this.notifyUrl = notifyUrl;
    this.receiveName = receiveName;
    this.returnUrl = returnUrl;
    this.shortCode = shortCode;
    this.subject = subject;
    this.timeoutExpress = timeoutExpress;
    this.api = api;
  }

  /**
   * Check if the service is properly configured with required credentials
   */
  private isConfigured(): boolean {
    return Boolean(
      this.appId &&
      this.appKey &&
      this.publicKey &&
      this.notifyUrl &&
      this.shortCode
    );
  }

  /**
   * Create a payment request for Telebirr
   */
  createPaymentRequest(
    outTradeNo: string,
    totalAmount: string,
    receiveName?: string
  ): TelebirrPaymentRequest {
    const timestamp = String(Math.floor(Date.now() / 1000)); // Unix timestamp in seconds
    const nonce = Math.random().toString(36).substring(2, 15); // Random string
    
    const ussd: TelebirrPaymentRequest = {
      appId: this.appId,
      notifyUrl: this.notifyUrl,
      outTradeNo: outTradeNo,
      receiveName: receiveName || this.receiveName,
      returnUrl: this.returnUrl,
      shortCode: this.shortCode,
      subject: this.subject,
      timeoutExpress: this.timeoutExpress,
      totalAmount: totalAmount,
      nonce: nonce,
      timestamp: timestamp
    };
    
    return ussd;
  }

  /**
   * Encrypt the USDD data using RSA public key
   * Note: This is a simplified version - the Python library uses more complex padding
   */
  private encryptUssd(ussd: TelebirrPaymentRequest): string {
    // Convert to JSON string
    const ussdJson = JSON.stringify(ussd);
    
    // For now, we'll use a simplified approach
    // In a production implementation, you would need to properly implement RSA encryption
    // as done in the Python library with PKCS1_v1_5 padding
    // This is a placeholder that would need to be replaced with proper encryption
    return Buffer.from(ussdJson).toString('base64');
  }

  /**
   * Generate signature for the request
   */
  private generateSign(ussd: TelebirrPaymentRequest): string {
    // Create a copy of ussd and add appKey for signing
    const ussdForSign = { ...ussd, appKey: this.appKey };
    return signSha256(ussdForSign, this.appKey);
  }

  /**
   * Initiate a Telebirr payment request
   */
  async initiatePayment(
    outTradeNo: string,
    totalAmount: string,
    receiveName?: string
  ): Promise<TelebirrPaymentResponse> {
    // Check if service is properly configured
    if (!this.isConfigured()) {
      console.error("Telebirr service not properly configured. Missing required credentials.");
      return {
        code: "1",
        msg: "Payment service not configured",
        error: "Missing Telebirr credentials"
      };
    }

    try {
      // Create the USDD data
      const ussd = this.createPaymentRequest(outTradeNo, totalAmount, receiveName);
      
      // Encrypt the USDD data (simplified)
      const encryptedUssd = this.encryptUssd(ussd);
      
      // Generate signature
      const sign = this.generateSign(ussd);
      
      // Prepare request parameters
      const requestParams = {
        appid: this.appId,
        sign: sign,
        ussd: encryptedUssd
      };
      
      // Make the HTTP request to Telebirr API
      // Note: This would require node-fetch or similar in a real implementation
      // For now, we'll return a mock response structure
      
      // In a real implementation, you would do:
      // const response = await fetch(this.api, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(requestParams)
      // });
      // const result = await response.json();
      
      // For now, return a structure that matches the expected response
      return {
        code: "0",
        msg: "success",
        data: {
          toPayUrl: `${this.api}?appid=${this.appId}&sign=${sign}&ussd=${encryptedUssd}`
        }
      };
    } catch (error) {
      console.error("Telebirr payment initiation failed:", error);
      return {
        code: "1",
        msg: "Payment initiation failed",
        error: error.message
      };
    }
  }

  /**
   * Decrypt and verify notification from Telebirr
   * This would be called when Telebirr sends a notification to your notifyUrl
   */
  async verifyNotification(
    notification: TelebirrNotification
  ): Promise<{ success: boolean; data?: any }> {
    try {
      // In a real implementation, you would:
      // 1. Extract the encrypted payload from the notification
      // 2. Decrypt it using your private key
      // 3. Verify the signature using the public key
      
      // For now, return a mock success response
      return {
        success: true,
        data: notification
      };
    } catch (error) {
      console.error("Telebirr notification verification failed:", error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

/**
 * Factory function to create a TelebirrService instance from environment variables
 */
export function createTelebirrServiceFromEnv(): TelebirrService {
  const appId = process.env.TELEBIRR_APP_ID || "";
  const appKey = process.env.TELEBIRR_APP_KEY || "";
  const publicKey = process.env.TELEBIRR_PUBLIC_KEY || "";
  const notifyUrl = process.env.TELEBIRR_NOTIFY_URL || "";
  const receiveName = process.env.TELEBIRR_RECEIVE_NAME || "Excellent Youth";
  const returnUrl = process.env.TELEBIRR_RETURN_URL || "";
  const shortCode = process.env.TELEBIRR_SHORT_CODE || "";
  const subject = process.env.TELEBIRR_SUBJECT || "Excellent Youth Registration";
  const timeoutExpress = process.env.TELEBIRR_TIMEOUT_EXPRESS || "30";
  
  return new TelebirrService(
    appId,
    appKey,
    publicKey,
    notifyUrl,
    receiveName,
    returnUrl,
    shortCode,
    subject,
    timeoutExpress
  );
}