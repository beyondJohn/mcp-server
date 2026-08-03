import type { GoogleProvider } from "../providers/google/google.provider.js";

export class GmailService {
    constructor(
        private readonly googleProvider: GoogleProvider
    ) {}
}