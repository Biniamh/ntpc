import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable } from "@workspace/db";
import { CreateEventBody, DeleteEventParams } from "@workspace/api-zod";
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

router.get("/events", async (req, res) => {
  const search = getSearch(req.query.search);

  try {
    let query = db.select().from(eventsTable);

    if (search) {
      query = query.where(
        or(
          like(eventsTable.title, `%${search}%`),
          like(eventsTable.description, `%${search}%`),
        ),
      );
    }

    const events = await query.orderBy(desc(eventsTable.date));

    res.json(
      events.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list events");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/events", async (req, res) => {
  const parsed = CreateEventBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [event] = await db
      .insert(eventsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...event,
      createdAt: event.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }

  const parsed = CreateEventBody.partial().safeParse(req.body);
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
      .update(eventsTable)
      .set(parsed.data)
      .where(eq(eventsTable.id, id))
      .returning();

    if (!event) {
      res.status(404).json({ error: "Event not found" });
      return;
    }

    res.json({ ...event, createdAt: event.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update event");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/events/:id", async (req, res) => {
  const parsed = DeleteEventParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid event ID" });
    return;
  }
  try {
    await db.delete(eventsTable).where(eq(eventsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete event");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
