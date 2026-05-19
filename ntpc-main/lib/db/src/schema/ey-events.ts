import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

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

export type InsertEyEvent = InferModel<typeof eyEventsTable, "insert">;
export type EyEvent = typeof eyEventsTable.$inferSelect;