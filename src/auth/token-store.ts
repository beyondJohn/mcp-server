import type { Credentials } from "google-auth-library";

export interface TokenStore {
  load(): Promise<Credentials | null>;

  save(tokens: Credentials): Promise<void>;

  clear(): Promise<void>;
}