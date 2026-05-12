import { Router } from "express";
import { db } from "@workspace/db";
import { supportSubmissionsTable } from "@workspace/db";
import { CreateSupportSubmissionBody } from "@workspace/api-zod";
import { desc, eq, like, or } from "drizzle-orm";
import { z } from "zod";

const router = Router();

const getPage = (value: unknown, defaultValue: number) => {
  const page = Number(Array.isArray(value) ? value[0] : value);
  return Number.isNaN(page) || page < 1 ? defaultValue : Math.floor(page);
};

const getSearch = (value: unknown) => {
  const search = Array.isArray(value) ? value[0] : value;
  return typeof search === "string" ? search.trim() : "";
};

router.get("/support", async (req, res) => {
  const search = getSearch(req.query.search);

  try {
    let query = db.select().from(supportSubmissionsTable);

    if (search) {
      query = query.where(
        or(
          like(supportSubmissionsTable.firstName, `%${search}%`),
          like(supportSubmissionsTable.middleName, `%${search}%`),
          like(supportSubmissionsTable.lastName, `%${search}%`),
          like(supportSubmissionsTable.phone, `%${search}%`),
          like(supportSubmissionsTable.email, `%${search}%`),
          like(supportSubmissionsTable.occupation, `%${search}%`),
          like(supportSubmissionsTable.reason, `%${search}%`),
        ),
      );
    }

    const submissions = await query.orderBy(desc(supportSubmissionsTable.createdAt));

    res.json(
      submissions.map((s) => ({
        ...s,
        amountPerMonth: Number(s.amountPerMonth),
        amountPerYear: Number(s.amountPerYear),
        createdAt: s.createdAt.toISOString(),
      })),
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

router.put("/support/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid support ID" });
    return;
  }

  const parsed = CreateSupportSubmissionBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  if (typeof parsed.data.amountPerMonth === "number") {
    parsed.data.amountPerMonth = String(parsed.data.amountPerMonth);
  }

  if (typeof parsed.data.amountPerYear === "number") {
    parsed.data.amountPerYear = String(parsed.data.amountPerYear);
  }

  try {
    const [submission] = await db
      .update(supportSubmissionsTable)
      .set(parsed.data)
      .where(eq(supportSubmissionsTable.id, id))
      .returning();

    if (!submission) {
      res.status(404).json({ error: "Support submission not found" });
      return;
    }

    res.json({
      ...submission,
      amountPerMonth: Number(submission.amountPerMonth),
      amountPerYear: Number(submission.amountPerYear),
      createdAt: submission.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update support submission");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
