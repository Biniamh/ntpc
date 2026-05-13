import { Router } from "express";
import { db } from "@workspace/db";
import { eyCoordinatorsTable } from "@workspace/db";
import { CreateEyCoordinatorBody, DeleteEyCoordinatorParams } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router = Router();

router.get("/ey-coordinators", async (req, res) => {
  try {
    const coordinators = await db.select().from(eyCoordinatorsTable).orderBy(desc(eyCoordinatorsTable.createdAt));

    res.json(
      coordinators.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list EY coordinators");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ey-coordinators", async (req, res) => {
  const parsed = CreateEyCoordinatorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [coordinator] = await db
      .insert(eyCoordinatorsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...coordinator,
      createdAt: coordinator.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create EY coordinator");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/ey-coordinators/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid coordinator ID" });
    return;
  }

  const parsed = CreateEyCoordinatorBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [coordinator] = await db
      .update(eyCoordinatorsTable)
      .set(parsed.data)
      .where(eq(eyCoordinatorsTable.id, id))
      .returning();

    if (!coordinator) {
      res.status(404).json({ error: "Coordinator not found" });
      return;
    }

    res.json({ ...coordinator, createdAt: coordinator.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update EY coordinator");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ey-coordinators/:id", async (req, res) => {
  const parsed = DeleteEyCoordinatorParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid coordinator ID" });
    return;
  }
  try {
    await db.delete(eyCoordinatorsTable).where(eq(eyCoordinatorsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete EY coordinator");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;