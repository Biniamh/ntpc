import { Router } from "express";
import { createTelebirrServiceFromEnv } from "../lib/telebirr-service";
import { db } from "@workspace/db";
import { eyParticipantsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();
const telebirrService = createTelebirrServiceFromEnv();

/**
 * Initiate Telebirr payment
 * POST /api/telebirr/initiate
 * Body: { amount, orderTitle, merchOrderId, callbackInfo? }
 */
router.post("/telebirr/initiate", async (req, res) => {
  const { amount, orderTitle, merchOrderId, callbackInfo } = req.body;

  if (!amount || !orderTitle || !merchOrderId) {
    res.status(400).json({ error: "Missing required fields: amount, orderTitle, merchOrderId" });
    return;
  }

  // In mock mode, always return a simulated successful response
  if (process.env.TELEBIRR_MOCK_ENABLED === "true") {
    return res.json({
      code: "0",
      msg: "success",
      data: {
        toPayUrl: "" // Empty URL indicates mock mode - no redirect needed
      }
    });
  }

  // If not in mock mode, we need to check if the service is configured
  if (!telebirrService.isConfigured()) {
    return res.status(500).json({ 
      error: "Telebirr service not properly configured. Missing required credentials." 
    });
  }

  try {
    const result = await telebirrService.initiatePayment(
      merchOrderId,
      amount.toString(),
      callbackInfo || "Excellent Youth Registration Payment"
    );
    
    // Check if the result indicates an error
    if (result.code === "1") {
      return res.status(500).json({ error: result.msg });
    }
    
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to initiate Telebirr payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Verify Telebirr payment status
 * GET /api/telebirr/verify/:transactionId
 * Note: With the new integration, verification is typically done via callback
 */
router.get("/telebirr/verify/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    res.status(400).json({ error: "Transaction ID required" });
    return;
  }

  try {
    // In mock mode, simulate verification
    if (process.env.TELEBIRR_MOCK_ENABLED === "true") {
      const isValid = transactionId && transactionId.trim().length > 0;
      return res.json({
        verified: isValid,
        transactionId,
        status: isValid ? "COMPLETED" : "FAILED",
        amount: isValid ? 100 : undefined,
        timestamp: isValid ? new Date().toISOString() : undefined,
        error: isValid ? undefined : "Transaction reference required"
      });
    }

    // For real mode, we would typically verify via the notification/callback
    // This endpoint is kept for compatibility but the real verification happens via callback
    return res.json({
      verified: false,
      transactionId,
      status: "PENDING",
      message: "Payment verification should be done via callback endpoint"
    });
  } catch (err) {
    req.log.error({ err }, "Failed to verify Telebirr payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Handle Telebirr callback/notification
 * POST /api/telebirr/callback
 */
router.post("/telebirr/callback", async (req, res) => {
  // This endpoint handles server-to-server notifications from Telebirr
  // Process the payment confirmation and update your database
  
  try {
    // In mock mode, simulate successful callback
    if (process.env.TELEBIRR_MOCK_ENABLED === "true") {
      // For mock mode, we'll expect a merch_order_id in the body
      const { merch_order_id } = req.body;
      
      if (merch_order_id) {
        // Update the participant with this merch_order_id as having paid
        await db
          .update(eyParticipantsTable)
          .set({ paymentStatus: true })
          .where(eq(eyParticipantsTable.bankReference, merch_order_id));
          
        req.log.info({
          merchOrderId: merch_order_id,
          status: "COMPLETED",
        }, "Telebirr payment callback received (mock mode)");
      }
    } else {
      // Real mode - verify the notification first
      const verificationResult = await telebirrService.verifyNotification(req.body);
      
      if (verificationResult.success) {
        const notification = verificationResult.data;
        const merchOrderId = notification.merch_order_id || notification.outTradeNo;
        
        if (merchOrderId) {
          // Update the participant with this merch_order_id as having paid
          await db
            .update(eyParticipantsTable)
            .set({ paymentStatus: true })
            .where(eq(eyParticipantsTable.bankReference, merchOrderId));
            
          req.log.info({
            merchOrderId: merchOrderId,
            status: notification.status || "COMPLETED",
          }, "Telebirr payment callback received");
        }
      } else {
        req.log.error({ error: verificationResult.error }, "Telebirr notification verification failed");
        return res.status(400).json({ error: "Invalid notification" });
      }
    }
    
    res.status(200).json({ received: true });
  } catch (err) {
    req.log.error({ err }, "Failed to process Telebirr callback");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;