import { Router } from "express";
import { db } from "@workspace/db";
import { eyRoundsTable } from "@workspace/db";
import { CreateEyRoundBody, DeleteEyRoundParams } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/ey-rounds", async (req, res) => {
  try {
    const rounds = await db
      .select()
      .from(eyRoundsTable)
      .orderBy(desc(eyRoundsTable.createdAt));

    res.json(
      rounds.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list EY rounds");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ey-rounds", async (req, res) => {
  const parsed = CreateEyRoundBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [round] = await db
      .insert(eyRoundsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...round,
      createdAt: round.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create EY round");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/ey-rounds/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid round ID" });
    return;
  }

  const parsed = CreateEyRoundBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [round] = await db
      .update(eyRoundsTable)
      .set(parsed.data)
      .where(eq(eyRoundsTable.id, id))
      .returning();

    if (!round) {
      res.status(404).json({ error: "Round not found" });
      return;
    }

    res.json({ ...round, createdAt: round.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update EY round");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ey-rounds/:id", async (req, res) => {
  const parsed = DeleteEyRoundParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid round ID" });
    return;
  }
  try {
    await db.delete(eyRoundsTable).where(eq(eyRoundsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete EY round");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;