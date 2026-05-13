import { Router } from "express";
import { db } from "@workspace/db";
import { membershipRequestsTable } from "@workspace/db";
import { CreateMembershipRequestBody } from "@workspace/api-zod";
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

router.get("/membership", async (req, res) => {
  const search = getSearch(req.query.search);

  try {
    let query = db.select().from(membershipRequestsTable);

    if (search) {
      query = query.where(
        or(
          like(membershipRequestsTable.firstName, `%${search}%`),
          like(membershipRequestsTable.middleName, `%${search}%`),
          like(membershipRequestsTable.lastName, `%${search}%`),
          like(membershipRequestsTable.phone, `%${search}%`),
          like(membershipRequestsTable.email, `%${search}%`),
          like(membershipRequestsTable.occupation, `%${search}%`),
          like(membershipRequestsTable.previousChurch, `%${search}%`),
          like(membershipRequestsTable.servingAs, `%${search}%`),
        ),
      );
    }

    const requests = await query.orderBy(desc(membershipRequestsTable.createdAt));

    res.json(
      requests.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
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

router.put("/membership/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid membership request ID" });
    return;
  }

  const parsed = CreateMembershipRequestBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [request] = await db
      .update(membershipRequestsTable)
      .set(parsed.data)
      .where(eq(membershipRequestsTable.id, id))
      .returning();

    if (!request) {
      res.status(404).json({ error: "Membership request not found" });
      return;
    }

    res.json({ ...request, createdAt: request.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update membership request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
