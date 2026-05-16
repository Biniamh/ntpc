import { Router } from "express";
import { TelebirrPaymentService } from "../lib/telebirr-payment";

const router = Router();
const telebirrPaymentService = new TelebirrPaymentService();

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

  try {
    const result = await telebirrPaymentService.initiatePayment({
      amount: Number(amount),
      orderTitle,
      merchOrderId,
      callbackInfo,
    });

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to initiate Telebirr payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * Verify Telebirr payment status
 * GET /api/telebirr/verify/:transactionId
 */
router.get("/telebirr/verify/:transactionId", async (req, res) => {
  const { transactionId } = req.params;

  if (!transactionId) {
    res.status(400).json({ error: "Transaction ID required" });
    return;
  }

  try {
    const result = await telebirrPaymentService.verifyPayment(transactionId);
    res.json(result);
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
  const { merch_order_id, status, total_amount } = req.body;

  req.log.info({
    merchOrderId: merch_order_id,
    status,
    amount: total_amount,
  }, "Telebirr payment callback received");

  // TODO: Update payment status in database based on merch_order_id
  // Example: await db.update(eyParticipantsTable).set({ paymentStatus: true }).where(...)

  res.status(200).json({ received: true });
});

export default router;