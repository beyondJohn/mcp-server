import type { GoogleAuthProvider } from "../providers/google/google-auth.provider.js";

export class GmailService {
    constructor(
        private readonly googleProvider: GoogleAuthProvider
    ) {}
}