import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { eyEventsTable } from "./ey-events";
import { eyRoundsTable } from "./ey-rounds";
import { eyCoordinatorsTable } from "./ey-coordinators";

export const eyParticipantsTable = pgTable("ey_participants", {
  id: serial("id").primaryKey(),
  faydaId: text("fayda_id").notNull(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  phoneNumber: text("phone_number").notNull(),
  email: text("email").notNull(),
  faydaVerified: boolean("fayda_verified").default(false).notNull(),
  eventId: integer("event_id").references(() => eyEventsTable.id).notNull(),
  roundId: integer("round_id").references(() => eyRoundsTable.id).notNull(),
  paymentStatus: boolean("payment_status").default(false).notNull(),
  registrationNumber: text("registration_number").notNull(),
  coordinatorId: integer("coordinator_id").references(() => eyCoordinatorsTable.id),
  badgeGenerated: boolean("badge_generated").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertEyParticipant = InferModel<typeof eyParticipantsTable, "insert">;
export type EyParticipant = typeof eyParticipantsTable.$inferSelect;