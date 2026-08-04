import {
  OAuth2Client,
  type Credentials,
} from "google-auth-library";

import type { AppConfig } from "../config/config.js";
import { Logger } from "../logger/index.js";

import type { TokenStore } from "./token-store.js";
import type { IGoogleAuthProvider } from "./google-auth.interface.js";

export class GoogleAuthProvider implements IGoogleAuthProvider {
  private readonly oauthClient: OAuth2Client;

  constructor(
    private readonly config: AppConfig,
    private readonly tokenStore: TokenStore,
    private readonly logger: typeof Logger
  ) {
    this.oauthClient = new OAuth2Client(
      config.google.clientId,
      config.google.clientSecret,
      config.google.redirectUri
    );

    this.logger.info(
      "GoogleAuthProvider",
      "OAuth client initialized."
    );
  }

  public async initialize(): Promise<boolean> {
    const tokens = await this.tokenStore.load();

    if (!tokens) {
      this.logger.info(
        "GoogleAuthProvider",
        "No stored credentials found."
      );

      return false;
    }

    this.oauthClient.setCredentials(tokens);

    this.logger.info(
      "GoogleAuthProvider",
      "Stored credentials restored."
    );

    return true;
  }

  public getAuthorizationUrl(
    scopes: readonly string[]
  ): string {
    return this.oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [...scopes],
    });
  }

  public async authenticate(
    code: string
  ): Promise<void> {
    const { tokens } =
      await this.oauthClient.getToken(code);

    this.oauthClient.setCredentials(tokens);

    await this.tokenStore.save(tokens);

    this.logger.info(
      "GoogleAuthProvider",
      "Authentication successful."
    );
  }

  public async logout(): Promise<void> {
    this.oauthClient.setCredentials({});

    await this.tokenStore.clear();

    this.logger.info(
      "GoogleAuthProvider",
      "Logged out."
    );
  }

  public getClient(): OAuth2Client {
    return this.oauthClient;
  }

  public isAuthenticated(): boolean {
    return !!this.oauthClient.credentials.refresh_token;
  }
}