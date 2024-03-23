import { MockMapDatabase } from "./impl";
import { MapDatabase } from "./types";

export function getDatabase(): MapDatabase {
  return new MockMapDatabase();
}
