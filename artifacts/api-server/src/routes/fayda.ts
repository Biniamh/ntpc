import { Router } from "express";
import { initializeFaydaVerificationService } from "../lib/fayda-verification";

const router = Router();
const faydaVerificationService = initializeFaydaVerificationService();

router.get("/fayda/authorization-url", (req, res) => {
  const faydaId = typeof req.query.faydaId === "string" ? req.query.faydaId : undefined;
  const auth = faydaVerificationService.createAuthorizationRequest(faydaId);

  if (!auth) {
    res.status(503).json({ error: "Fayda OIDC is not configured" });
    return;
  }

  res.json(auth);
});

router.post("/fayda/verify", async (req, res) => {
  const body = req.body as {
    faydaId?: unknown;
    code?: unknown;
    codeVerifier?: unknown;
  };

  if (typeof body.faydaId !== "string" || !body.faydaId.trim()) {
    res.status(400).json({ error: "Fayda ID is required" });
    return;
  }

  try {
    const result = await faydaVerificationService.verifyFaydaId(body.faydaId.trim(), {
      code: typeof body.code === "string" ? body.code : undefined,
      codeVerifier: typeof body.codeVerifier === "string" ? body.codeVerifier : undefined,
    });

    if (!result.verified && !result.authUrl) {
      res.status(400).json(result);
      return;
    }

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to verify Fayda ID");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
