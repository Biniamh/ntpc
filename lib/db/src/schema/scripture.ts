import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const scriptureTable = pgTable("scripture", {
  id: serial("id").primaryKey(),
  verse: text("verse").notNull(),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertScripture = InferModel<typeof scriptureTable, "insert">;
export type Scripture = typeof scriptureTable.$inferSelect;
