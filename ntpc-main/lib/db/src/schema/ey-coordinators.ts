import { InferModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const eyCoordinatorsTable = pgTable("ey_coordinators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type InsertEyCoordinator = InferModel<typeof eyCoordinatorsTable, "insert">;
export type EyCoordinator = typeof eyCoordinatorsTable.$inferSelect;