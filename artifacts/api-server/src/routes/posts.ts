import { Router } from "express";
import { db } from "@workspace/db";
import { postsTable } from "@workspace/db";
import { CreatePostBody, GetPostParams, DeletePostParams } from "@workspace/api-zod";
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

router.get("/posts", async (req, res) => {
  const search = getSearch(req.query.search);

  try {
    let query = db.select().from(postsTable);

    if (search) {
      query = query.where(
        or(
          like(postsTable.title, `%${search}%`),
          like(postsTable.highlights, `%${search}%`),
        ),
      );
    }

    const posts = await query.orderBy(desc(postsTable.createdAt));

    res.json(
      posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
      })),
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list posts");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/posts", async (req, res) => {
  const parsed = CreatePostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }
  try {
    const [post] = await db
      .insert(postsTable)
      .values(parsed.data)
      .returning();
    res.status(201).json({
      ...post,
      createdAt: post.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/posts/:id", async (req, res) => {
  const idParsed = GetPostParams.safeParse({ id: Number(req.params.id) });
  if (!idParsed.success) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }

  const parsed = CreatePostBody.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  if (Object.keys(parsed.data).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  try {
    const [post] = await db
      .update(postsTable)
      .set(parsed.data)
      .where(eq(postsTable.id, idParsed.data.id))
      .returning();

    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }

    res.json({ ...post, createdAt: post.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to update post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/posts/:id", async (req, res) => {
  const parsed = GetPostParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }
  try {
    const [post] = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.id, parsed.data.id));
    if (!post) {
      res.status(404).json({ error: "Post not found" });
      return;
    }
    res.json({ ...post, createdAt: post.createdAt.toISOString() });
  } catch (err) {
    req.log.error({ err }, "Failed to get post");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  const parsed = DeletePostParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid post ID" });
    return;
  }
  try {
    await db.delete(postsTable).where(eq(postsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete post");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
