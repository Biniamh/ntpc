import { Router } from "express";
import { db } from "@workspace/db";
import { membershipRequestsTable } from "@workspace/db";
import { CreateMembershipRequestBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/membership", async (req, res) => {
  try {
    const requests = await db
      .select()
      .from(membershipRequestsTable)
      .orderBy(desc(membershipRequestsTable.createdAt));
    res.json(
      requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list membership requests");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/membership", async (req, res) => {
  const parsed = CreateMembershipRequestBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [request] = await db
      .insert(membershipRequestsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...request,
      createdAt: request.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create membership request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
