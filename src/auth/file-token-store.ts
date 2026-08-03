import { promises as fs } from "node:fs";
import path from "node:path";

import type { Credentials } from "google-auth-library";

import { Logger } from "../logger/index.js";
import type { TokenStore } from "./token-store.js";

export class FileTokenStore implements TokenStore {
    constructor(
        private readonly filePath = path.resolve("tokens.json")
    ) { }

    public async load(): Promise<Credentials | null> {
        try {
            const json = await fs.readFile(this.filePath, "utf8");

            Logger.debug(
                "FileTokenStore",
                "Loaded OAuth tokens."
            );

            return JSON.parse(json) as Credentials;
        } catch {
            Logger.debug(
                "FileTokenStore",
                "No saved OAuth tokens found."
            );

            return null;
        }
    }

    public async save(tokens: Credentials): Promise<void> {
        await fs.writeFile(
            this.filePath,
            JSON.stringify(tokens, null, 2),
            "utf8"
        );

        Logger.info(
            "FileTokenStore",
            "OAuth tokens saved."
        );
    }

    public async clear(): Promise<void> {
        try {
            await fs.unlink(this.filePath);

            Logger.info(
                "FileTokenStore",
                "OAuth tokens removed."
            );
        } catch {
            // File doesn't exist.
        }
    }
}