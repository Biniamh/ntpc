import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { eyEventsTable } from "./ey-events";

export const eyRoundsTable = pgTable("ey_rounds", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => eyEventsTable.id).notNull(),
  roundNumber: integer("round_number").notNull(),
  capacity: integer("capacity").notNull(),
  fromDate: text("from_date"),
  toDate: text("to_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertEyRound = InferModel<typeof eyRoundsTable, "insert">;
export type EyRound = typeof eyRoundsTable.$inferSelect;