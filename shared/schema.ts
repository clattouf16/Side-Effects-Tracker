import { pgTable, text, timestamp, integer, uuid } from 'drizzle-orm/pg-core';

export const logs = pgTable('logs', {
  id: uuid('id').primaryKey(),
  type: text('type').notNull(),
  timestamp: timestamp('timestamp').notNull(),
  notes: text('notes'),
  medicationName: text('medication_name'),
  dosage: text('dosage'),
  severity: integer('severity'),
  description: text('description'),
});

export type Log = typeof logs.$inferSelect;
export type InsertLog = typeof logs.$inferInsert;
