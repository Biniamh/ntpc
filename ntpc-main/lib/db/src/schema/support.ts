import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";

export const supportSubmissionsTable = pgTable("support_submissions", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  middleName: text("middle_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  address: text("address").notNull(),
  occupation: text("occupation").notNull(),
  amountPerMonth: numeric("amount_per_month").notNull(),
  amountPerYear: numeric("amount_per_year").notNull(),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertSupportSubmission = InferModel<typeof supportSubmissionsTable, "insert">;
export type SupportSubmission = typeof supportSubmissionsTable.$inferSelect;
