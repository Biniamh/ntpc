import { Router } from "express";
import { db } from "@workspace/db";
import { supportSubmissionsTable } from "@workspace/db";
import { CreateSupportSubmissionBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/support", async (req, res) => {
  try {
    const submissions = await db
      .select()
      .from(supportSubmissionsTable)
      .orderBy(desc(supportSubmissionsTable.createdAt));
    res.json(
      submissions.map((s) => ({
        ...s,
        amountPerMonth: Number(s.amountPerMonth),
        amountPerYear: Number(s.amountPerYear),
        createdAt: s.createdAt.toISOString(),
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list support submissions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/support", async (req, res) => {
  const parsed = CreateSupportSubmissionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [submission] = await db
      .insert(supportSubmissionsTable)
      .values({
        firstName: parsed.data.firstName,
        middleName: parsed.data.middleName,
        lastName: parsed.data.lastName,
        phone: parsed.data.phone,
        email: parsed.data.email,
        address: parsed.data.address,
        occupation: parsed.data.occupation,
        amountPerMonth: String(parsed.data.amountPerMonth),
        amountPerYear: String(parsed.data.amountPerYear),
        reason: parsed.data.reason,
      })
      .returning();
    res.status(201).json({
      ...submission,
      amountPerMonth: Number(submission.amountPerMonth),
      amountPerYear: Number(submission.amountPerYear),
      createdAt: submission.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create support submission");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
