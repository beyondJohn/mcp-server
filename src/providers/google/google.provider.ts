import { OAuth2Client } from "google-auth-library";

import { AppConfig } from "../../config/config.js";
import { Logger } from "../../logger/index.js";

export class GoogleProvider {
  private readonly oauthClient: OAuth2Client;

  constructor(
    private readonly config: AppConfig,
    private readonly logger: typeof Logger
  ) {
    this.oauthClient = new OAuth2Client(
      this.config.google.clientId,
      this.config.google.clientSecret,
      this.config.google.redirectUri
    );

    this.logger.info("GoogleProvider", "OAuth2 client initialized.");
  }

  public getOAuthClient(): OAuth2Client {
    return this.oauthClient;
  }

  public getAuthorizationUrl(scopes: ReadonlyArray<string>): string {
    this.logger.debug(
      "GoogleProvider",
      "Generating Google authorization URL."
    );

    return this.oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [...scopes],
    });
  }
}