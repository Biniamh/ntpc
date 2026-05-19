import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const membershipRequestsTable = pgTable("membership_requests", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  occupation: text("occupation").notNull(),
  previousChurch: text("previous_church").notNull(),
  servingAs: text("serving_as").notNull(),
  baptized: boolean("baptized").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertMembershipRequest = InferModel<typeof membershipRequestsTable, "insert">;
export type MembershipRequest = typeof membershipRequestsTable.$inferSelect;
