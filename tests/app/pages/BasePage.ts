import {PageManager} from '../../tools/manager/PageManager';
import {SessionContext, SessionContextStorage} from '../../tools/SessionContext';

export class BasePage {
    protected readonly pageManager: PageManager;
    protected sessionContext: SessionContext | null = null;

    constructor(manager: PageManager) {
        this.pageManager = manager;
    }

    async restoreSessionByEmail(username: string): Promise<SessionContext> {
        if (SessionContextStorage.hasUserSession(username)) {
            const sessionContext: SessionContext = SessionContextStorage.getUserSession(username);
            await this.pageManager.restoreBrowserContext(sessionContext);
            return sessionContext;
        } else {
            throw new Error('No user session found');
        }
    }
}