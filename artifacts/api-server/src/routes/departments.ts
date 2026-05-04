import { Router } from "express";
import { db } from "@workspace/db";
import { departmentsTable } from "@workspace/db";
import { GetDepartmentParams } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router = Router();

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
