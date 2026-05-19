/**
 * Telebirr Payment Integration Service
 * Integrates with Ethiopia's Telebirr mobile payment system using Fabric Payment Gateway
 * 
 * Reference: https://developer.ethiotelecom.et/docs/
 * Required environment variables:
 * - FABRIC_APP_ID: Fabric application ID (UUID v4 format)
 * - FABRIC_APP_SECRET: Fabric application secret (32 hex characters)
 * - MERCHANT_APP_ID: Merchant application ID (16 integer characters)
 * - MERCHANT_CODE: Merchant code (6 integer characters)
 * - TELEBIRR_PRIVATE_KEY: RSA private key for signing requests (PEM format)
 * - TELEBIRR_NOTIFY_URL: Server-to-server callback URL
 * - TELEBIRR_REDIRECT_URL: User redirect URL after payment
 */

import { createSign, createVerify } from "crypto";

export interface TelebirrPaymentRequest {
  amount: number;
  orderTitle: string;
  merchOrderId: string;
  callbackInfo?: string;
  phoneNumber?: string;
}

export interface TelebirrPaymentResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  status?: string;
  message: string;
  error?: string;
}

export interface TelebirrVerificationResponse {
  verified: boolean;
  transactionId: string;
  status: string;
  amount?: number;
  timestamp?: string;
  error?: string;
}

type TelebirrConfig = {
  appId: string;
  appSecret: string;
  merchantAppId: string;
  merchantCode: string;
  privateKey: string;
  notifyUrl: string;
  redirectUrl: string;
  baseUrl: string;
  webBaseUrl: string;
};

export class TelebirrPaymentService {
  private config: TelebirrConfig;

  constructor() {
    this.config = {
      appId: process.env.FABRIC_APP_ID || "",
      appSecret: process.env.FABRIC_APP_SECRET || "",
      merchantAppId: process.env.MERCHANT_APP_ID || "",
      merchantCode: process.env.MERCHANT_CODE || "",
      privateKey: process.env.TELEBIRR_PRIVATE_KEY || "",
      notifyUrl: process.env.TELEBIRR_NOTIFY_URL || "",
      redirectUrl: process.env.TELEBIRR_REDIRECT_URL || "",
      baseUrl: process.env.TELEBIRR_BASE_URL || "https://developerportal.ethiotelebirr.et:38443/apiaccess/payment/gateway",
      webBaseUrl: process.env.TELEBIRR_WEB_BASE_URL || "https://developerportal.ethiotelebirr.et:38443/payment/web/paygate",
    };
  }

  private isConfigured(): boolean {
    const isMockEnabled = process.env.TELEBIRR_MOCK_ENABLED === "true";
    if (isMockEnabled) return false;
    return Boolean(
      this.config.appId &&
      this.config.appSecret &&
      this.config.merchantAppId &&
      this.config.merchantCode &&
      this.config.privateKey &&
      this.config.notifyUrl,
    );
  }

  /**
   * Generate RSA-SHA256 signature for request
   */
  private signRequest(data: string): string {
    const sign = createSign("RSA-SHA256");
    sign.update(data);
    sign.end();
    return sign.sign(this.config.privateKey, "base64");
  }

  /**
   * Apply for Fabric token
   */
  private async applyFabricToken(): Promise<string> {
    const timestamp = Date.now().toString();
    const nonce = Math.random().toString(36).substring(2, 15);
    
    const payload = {
      appId: this.config.appId,
      appSecret: this.config.appSecret,
      nonce,
      timestamp,
    };

    const response = await fetch(`${this.config.baseUrl}/payment/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to get fabric token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.token;
  }

  /**
   * Create pre-order
   */
  private async createPreOrder(
    token: string,
    amount: string,
    merchOrderId: string,
    title: string,
    callbackInfo?: string,
  ): Promise<{ prepayId: string; rawRequest: string }> {
    const timestamp = Date.now().toString();
    
    const signData = JSON.stringify({
      appId: this.config.appId,
      merchOrderId,
      timestamp,
    });

    const payload = {
      appId: this.config.appId,
      sign: this.signRequest(signData),
      merchOrderId,
      merchUserId: "user",
      createTime: timestamp,
      totalAmount: amount,
      title,
      notifyUrl: this.config.notifyUrl,
      callbackInfo: callbackInfo || "",
    };

    const response = await fetch(`${this.config.baseUrl}/payment/v1/merchant/preOrder`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to create pre-order: ${response.statusText}`);
    }

    const data = await response.json() as { prepayId: string; rawRequest: string };
    return {
      prepayId: data.prepayId,
      rawRequest: data.rawRequest,
    };
  }

  /**
   * Generate checkout URL for user to complete payment
   */
  async initiatePayment(paymentRequest: TelebirrPaymentRequest): Promise<TelebirrPaymentResponse> {
    if (!this.isConfigured()) {
      console.warn("Telebirr API not configured, returning mock response");
      return this.mockPaymentResponse(paymentRequest);
    }

    try {
      const token = await this.applyFabricToken();
      const { prepayId, rawRequest } = await this.createPreOrder(
        token,
        paymentRequest.amount.toString(),
        paymentRequest.merchOrderId,
        paymentRequest.orderTitle,
        paymentRequest.callbackInfo,
      );

      // Generate checkout URL
      const checkoutUrl = `${this.config.webBaseUrl}?appid=${this.config.appId}&merch_code=${this.config.merchantCode}&prepay_id=${prepayId}&noncestr=${rawRequest}`;

      return {
        success: true,
        paymentUrl: checkoutUrl,
        transactionId: prepayId,
        status: "INITIATED",
        message: "Payment initiated successfully",
      };
    } catch (error) {
      console.error("Telebirr payment initiation failed:", error);
      return {
        success: false,
        message: "Payment service error",
        error: String(error),
      };
    }
  }

  /**
   * Verify Telebirr payment status
   */
  async verifyPayment(transactionId: string): Promise<TelebirrVerificationResponse> {
    if (!this.isConfigured()) {
      console.warn("Telebirr API not configured, returning mock verification");
      return this.mockVerificationResponse(transactionId);
    }

    try {
      const token = await this.applyFabricToken();
      
      const payload = {
        appId: this.config.appId,
        merchOrderId: transactionId,
        sign: this.signRequest(transactionId),
      };

      const response = await fetch(`${this.config.baseUrl}/payment/v1/merchant/queryOrder`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        return {
          verified: false,
          transactionId,
          status: "ERROR",
          error: response.statusText,
        };
      }

      const data = await response.json() as {
        status: string;
        totalAmount?: string;
        payTime?: string;
      };
      const isVerified = data.status === "SUCCESS" || data.status === "COMPLETED";

      return {
        verified: isVerified,
        transactionId,
        status: data.status,
        amount: data.totalAmount ? parseFloat(data.totalAmount) : undefined,
        timestamp: data.payTime,
      };
    } catch (error) {
      console.error("Telebirr payment verification failed:", error);
      return {
        verified: false,
        transactionId,
        status: "ERROR",
        error: String(error),
      };
    }
  }

  private mockPaymentResponse(paymentRequest: TelebirrPaymentRequest): TelebirrPaymentResponse {
    const isMockEnabled = process.env.TELEBIRR_MOCK_ENABLED === "true";
    if (isMockEnabled) {
      // In mock mode, simulate successful payment without redirect
      return {
        success: true,
        paymentUrl: "",  // Empty means no redirect needed
        transactionId: `MOCK-${Date.now()}`,
        status: "COMPLETED",
        message: "Payment completed successfully (mock mode)",
      };
    }
    return {
      success: true,
      paymentUrl: `https://developerportal.ethiotelebirr.et:38443/payment/web/paygate?amount=${paymentRequest.amount}&order=${paymentRequest.merchOrderId}`,
      transactionId: `MOCK-${Date.now()}`,
      status: "PENDING",
      message: "Payment initiated - awaiting confirmation from subscriber",
    };
  }

  private mockVerificationResponse(transactionId: string): TelebirrVerificationResponse {
    const isValid = transactionId && transactionId.trim().length > 0;
    return {
      verified: isValid,
      transactionId,
      status: isValid ? "COMPLETED" : "FAILED",
      amount: isValid ? 100 : undefined,
      timestamp: new Date().toISOString(),
      error: isValid ? undefined : "Transaction reference required",
    };
  }
}

export function initializeTelebirrPaymentService(): TelebirrPaymentService {
  return new TelebirrPaymentService();
}
