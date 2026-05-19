import { Router } from "express";
import { db } from "@workspace/db";
import { departmentsTable } from "@workspace/db";
import { GetDepartmentParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

type DepartmentBody = {
  name?: string;
  description?: string;
  groupPhotoUrl?: string;
  members?: string[];
  activities?: string;
  meetingTime?: string;
};

function parseDepartmentBody(body: unknown, partial = false): DepartmentBody | null {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;

  const data = body as Record<string, unknown>;
  const parsed: DepartmentBody = {};

  if (typeof data.name === "string" && data.name.trim()) parsed.name = data.name.trim();
  else if (!partial) return null;

  if (typeof data.description === "string" && data.description.trim()) parsed.description = data.description.trim();
  else if (!partial) return null;

  if (data.groupPhotoUrl !== undefined || !partial) {
    if (data.groupPhotoUrl === undefined || data.groupPhotoUrl === null || data.groupPhotoUrl === "") {
      parsed.groupPhotoUrl = undefined;
    } else if (typeof data.groupPhotoUrl === "string") {
      parsed.groupPhotoUrl = data.groupPhotoUrl;
    } else {
      return null;
    }
  }

  if (data.members !== undefined || !partial) {
    if (data.members === undefined || data.members === null) {
      parsed.members = [];
    } else if (Array.isArray(data.members) && data.members.every((member) => typeof member === "string")) {
      parsed.members = data.members.map((member) => member.trim()).filter(Boolean);
    } else {
      return null;
    }
  }

  if (data.activities !== undefined || !partial) {
    if (data.activities === undefined || data.activities === null || data.activities === "") {
      parsed.activities = undefined;
    } else if (typeof data.activities === "string") {
      parsed.activities = data.activities;
    } else {
      return null;
    }
  }

  if (data.meetingTime !== undefined || !partial) {
    if (data.meetingTime === undefined || data.meetingTime === null || data.meetingTime === "") {
      parsed.meetingTime = undefined;
    } else if (typeof data.meetingTime === "string") {
      parsed.meetingTime = data.meetingTime;
    } else {
      return null;
    }
  }

  if (partial && Object.keys(parsed).length === 0) return null;
  return parsed;
}

router.get("/departments", async (req, res) => {
  try {
    const departments = await db
      .select()
      .from(departmentsTable)
      .orderBy(departmentsTable.id);
    res.json(
      departments.map((d) => ({
        ...d,
        members: d.members ?? [],
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list departments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/departments", async (req, res) => {
  const parsed = parseDepartmentBody(req.body);
  if (!parsed) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  try {
    const [department] = await db
      .insert(departmentsTable)
      .values({
        ...parsed,
        name: parsed.name!,
        description: parsed.description!,
      })
      .returning();

    res.status(201).json({
      ...department,
      members: department.members ?? [],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create department");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/departments/:id", async (req, res) => {
  const idParsed = GetDepartmentParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid department ID" });
    return;
  }

  const parsed = parseDepartmentBody(req.body, true);
  if (!parsed) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [department] = await db
      .update(departmentsTable)
      .set(parsed)
      .where(eq(departmentsTable.id, idParsed.data.id))
      .returning();

    if (!department) {
      res.status(404).json({ error: "Department not found" });
      return;
    }

    res.json({
      ...department,
      members: department.members ?? [],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update department");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/departments/:id", async (req, res) => {
  const parsed = GetDepartmentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid department ID" });
    return;
  }
  try {
    const [department] = await db
      .select()
      .from(departmentsTable)
      .where(eq(departmentsTable.id, parsed.data.id));
    if (!department) {
      res.status(404).json({ error: "Department not found" });
      return;
    }
    res.json({ ...department, members: department.members ?? [] });
  } catch (err) {
    req.log.error({ err }, "Failed to get department");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
