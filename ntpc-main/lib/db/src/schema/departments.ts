import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const departmentsTable = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  groupPhotoUrl: text("group_photo_url"),
  members: text("members").array(),
  activities: text("activities"),
  meetingTime: text("meeting_time"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertDepartment = InferModel<typeof departmentsTable, "insert">;
export type Department = typeof departmentsTable.$inferSelect;
