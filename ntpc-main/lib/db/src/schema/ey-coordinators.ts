import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const eyCoordinatorsTable = pgTable("ey_coordinators", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertEyCoordinatorSchema = createInsertSchema(eyCoordinatorsTable).omit({ id: true, createdAt: true });
export type InsertEyCoordinator = z.infer<typeof insertEyCoordinatorSchema>;
export type EyCoordinator = typeof eyCoordinatorsTable.$inferSelect;