import type { IGoogleAuthProvider } from "../auth/google-auth.interface.js";

export class GmailService {
    constructor(
        private readonly googleProvider: IGoogleAuthProvider
    ) {}
}