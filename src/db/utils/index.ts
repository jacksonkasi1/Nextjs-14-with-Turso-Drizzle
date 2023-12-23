import { sql } from "drizzle-orm";

export function createUpdateTrigger(tableName: string) {
  const triggerName = `${tableName}_update_updated_at_trigger`;
  const updateTrigger = sql`
    CREATE TRIGGER ${triggerName}
    AFTER UPDATE ON ${tableName}
    BEGIN
      UPDATE ${tableName} SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
  `;
  return updateTrigger;
}
