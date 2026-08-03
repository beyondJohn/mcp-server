import { OAuth2Client, Credentials } from "google-auth-library";

import type { AppConfig } from "../../config/config.js";
import { Logger } from "../../logger/index.js";

export class GoogleAuthProvider {
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

    this.logger.info(
      "GoogleAuthProvider",
      "OAuth2 client initialized."
    );
  }

  public getAuthorizationUrl(
    scopes: readonly string[]
  ): string {
    this.logger.debug(
      "GoogleAuthProvider",
      "Generating authorization URL."
    );

    return this.oauthClient.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: [...scopes],
    });
  }

  public async exchangeCodeForTokens(
    code: string
  ): Promise<Credentials> {
    this.logger.info(
      "GoogleAuthProvider",
      "Exchanging authorization code."
    );

    const { tokens } =
      await this.oauthClient.getToken(code);

    this.oauthClient.setCredentials(tokens);

    return tokens;
  }

  public getClient(): OAuth2Client {
    return this.oauthClient;
  }
}