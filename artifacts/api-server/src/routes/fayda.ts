import { Router } from "express";
import { initializeFaydaVerificationService } from "../lib/fayda-verification";

const router = Router();
const faydaVerificationService = initializeFaydaVerificationService();

router.get("/fayda/authorization-url", async (req, res) => {
  const faydaId = typeof req.query.faydaId === "string" ? req.query.faydaId : undefined;

  // In mock mode, return verification directly instead of redirect URL
  if (process.env.FAYDA_MOCK_ENABLED === "true") {
    try {
      const result = await faydaVerificationService.verifyFaydaId(faydaId || "");
      return res.json(result);
    } catch (err) {
      console.error({ err }, "Failed to verify Fayda ID");
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  const auth = faydaVerificationService.createAuthorizationRequest(faydaId);
  res.json(auth);
});

router.post("/fayda/auth-url", async (req, res) => {
  // In mock mode, return verification directly instead of redirect URL
  if (process.env.FAYDA_MOCK_ENABLED === "true") {
    try {
      const result = await faydaVerificationService.verifyFaydaId("");
      return res.json(result);
    } catch (err) {
      console.error({ err }, "Failed to verify Fayda ID");
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  const auth = faydaVerificationService.createAuthorizationRequest();
  res.json(auth);
});

router.post("/fayda/verify", async (req, res) => {
  const body = req.body as {
    faydaId?: unknown;
    code?: unknown;
    codeVerifier?: unknown;
  };

  const faydaId = typeof body.faydaId === "string" ? body.faydaId.trim() : undefined;
  const hasCode = typeof body.code === "string" && typeof body.codeVerifier === "string";

  if (!faydaId && !hasCode) {
    res.status(400).json({ error: "Fayda ID or authorization code is required" });
    return;
  }

  try {
    const result = await faydaVerificationService.verifyFaydaId(faydaId || "", {
      code: typeof body.code === "string" ? body.code : undefined,
      codeVerifier: typeof body.codeVerifier === "string" ? body.codeVerifier : undefined,
    });

    res.json(result);
  } catch (err) {
    console.error({ err }, "Failed to verify Fayda ID");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
