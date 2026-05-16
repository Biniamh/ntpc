import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  highlights: text("highlights").notNull(),
  photoUrl: text("photo_url"),
  facebookUrl: text("facebook_url"),
  youtubeUrl: text("youtube_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertPost = InferModel<typeof postsTable, "insert">;
export type Post = typeof postsTable.$inferSelect;
