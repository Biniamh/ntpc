import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scriptureTable = pgTable("scripture", {
  id: serial("id").primaryKey(),
  verse: text("verse").notNull(),
  reference: text("reference").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertScriptureSchema = createInsertSchema(scriptureTable).omit({ id: true, createdAt: true });
export type InsertScripture = z.infer<typeof insertScriptureSchema>;
export type Scripture = typeof scriptureTable.$inferSelect;
