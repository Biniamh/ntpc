import { Router } from "express";
import { AdminLoginBody } from "@workspace/api-zod";

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";
const MEMBERS_USERNAME = process.env.MEMBERS_USERNAME ?? "members";
const MEMBERS_PASSWORD = process.env.MEMBERS_PASSWORD ?? "members";

router.post("/auth/login", (req, res) => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  const { username, password } = parsed.data;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ role: "admin", token: "admin-token" });
    return;
  }
  if (username === MEMBERS_USERNAME && password === MEMBERS_PASSWORD) {
    res.json({ role: "members", token: "members-token" });
    return;
  }
  res.status(401).json({ error: "Invalid username or password" });
});

export default router;
