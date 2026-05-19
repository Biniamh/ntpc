import { Router } from "express";
import { db } from "@workspace/db";
import { scriptureTable } from "@workspace/db";
import { CreateScriptureBody } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/scripture", async (req, res) => {
  try {
    const [scripture] = await db
      .select()
      .from(scriptureTable)
      .orderBy(desc(scriptureTable.createdAt))
      .limit(1);
    if (!scripture) {
      res.status(404).json({ error: "No scripture found" });
      return;
    }
    res.json({ ...scripture, createdAt: scripture.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get scripture");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/scripture", async (req, res) => {
  const parsed = CreateScriptureBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [scripture] = await db
      .insert(scriptureTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...scripture,
      createdAt: scripture.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create scripture");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
