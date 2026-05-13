import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const eyEventsTable = pgTable("ey_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  imageUrl: text("image_url"),
  type: text("type").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEyEventSchema = createInsertSchema(eyEventsTable).omit({ id: true, createdAt: true });
export type InsertEyEvent = z.infer<typeof insertEyEventSchema>;
export type EyEvent = typeof eyEventsTable.$inferSelect;