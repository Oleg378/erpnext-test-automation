import {ProfileRole} from './ProfileRoles';

export class SessionContext {
    constructor(
        public readonly profileRole: ProfileRole,
        public readonly storageState: { cookies: Array<{ name: string; value: string; domain: string; path: string; expires: number; httpOnly: boolean; secure: boolean; sameSite: "Strict" | "Lax" | "None"; }>; origins: Array<{ origin: string; localStorage: Array<{ name: string; value: string; }>; }>; } // This should be more specific
    ) {}
}

export abstract class SessionContextStorage {
    protected static storage: Map<string, SessionContext> = new Map();

    static putUserSession(username: string, sessionContext: SessionContext): void {
        if (!SessionContextStorage.hasUserSession(username)) {
            SessionContextStorage.storage.set(username, sessionContext);
        }
    }

    static getUserSession(username: string): SessionContext {
        const session = SessionContextStorage.storage.get(username);

        if (!session) {
            throw new Error(`Session not found for user: ${username}`);
        }
        return session;
    }

    static hasUserSession(username: string): boolean {
        return SessionContextStorage.storage.has(username);
    }
}