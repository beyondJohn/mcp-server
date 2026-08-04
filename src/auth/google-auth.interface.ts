import type { OAuth2Client } from "google-auth-library";

export interface IGoogleAuthProvider {
  /**
   * Attempts to restore a previously authenticated session.
   * Returns true if credentials were restored.
   */
  initialize(): Promise<boolean>;

  /**
   * Generates the Google OAuth authorization URL.
   */
  getAuthorizationUrl(
    scopes: readonly string[]
  ): string;

  /**
   * Exchanges an authorization code for tokens and
   * persists them to the configured TokenStore.
   */
  authenticate(code: string): Promise<void>;

  /**
   * Removes all stored credentials.
   */
  logout(): Promise<void>;

  /**
   * Returns the authenticated OAuth client.
   */
  getClient(): OAuth2Client;

  /**
   * Returns true if the OAuth client currently has credentials.
   */
  isAuthenticated(): boolean;
}