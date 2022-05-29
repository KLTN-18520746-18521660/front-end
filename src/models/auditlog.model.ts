import { Admin } from "./admin.model";

export interface AuditLog {
  id?: number;
  table?: string;
  table_key?: string;
  action?: string;
  old_value?: string;
  new_value?: string;

  user_id?: string;
  timestamp?: string;
  admin?: Admin;
}