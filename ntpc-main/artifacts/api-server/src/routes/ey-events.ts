import { Router } from "express";
import { db } from "@workspace/db";
import { eyEventsTable } from "@workspace/db";
import { CreateEyEventBody, DeleteEyEventParams } from "@workspace/api-zod";
import { desc, eq, like, or } from "drizzle-orm";

const router = Router();

router.get("/ey-events", async (req, res) => {
  try {
    const events = await db.select().from(eyEventsTable).orderBy(desc(eyEventsTable.createdAt));

    res.json(
      events.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list EY events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/ey-events", async (req, res) => {
  const parsed = CreateEyEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [event] = await db
      .insert(eyEventsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...event,
      createdAt: event.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create EY event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/ey-events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  try {
    const [event] = await db
      .select()
      .from(eyEventsTable)
      .where(eq(eyEventsTable.id, id));

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ ...event, createdAt: event.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get EY event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/ey-events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  const parsed = CreateEyEventBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [event] = await db
      .update(eyEventsTable)
      .set(parsed.data)
      .where(eq(eyEventsTable.id, id))
      .returning();

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ ...event, createdAt: event.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update EY event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/ey-events/:id", async (req, res) => {
  const parsed = DeleteEyEventParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }
  try {
    await db.delete(eyEventsTable).where(eq(eyEventsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete EY event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;