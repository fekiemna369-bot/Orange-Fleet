import { pgTable, serial, text, real, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const statusEnum = pgEnum("delivery_status", [
  "en_livraison",
  "livree",
  "retournee",
  "annulee",
]);

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  senderName: text("sender_name").notNull(),
  senderPhone: text("sender_phone"),
  recipientName: text("recipient_name").notNull(),
  recipientPhone: text("recipient_phone"),
  recipientCity: text("recipient_city").notNull(),
  description: text("description"),
  weight: real("weight").notNull(),
  price: real("price").notNull(),
  status: statusEnum("status").notNull().default("en_livraison"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
  status: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;
