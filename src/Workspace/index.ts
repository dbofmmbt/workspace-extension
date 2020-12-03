import Close from "./shared/Close";
import Open from "./shared/Open";
import { Window } from "./Window";

export interface Workspace extends Open, Close {
    // Workspace's identifier
    name: string;
    // Abbreviation of `name`
    symbol: string;
    // Windows belonging to Workspace
    windows: Iterable<Window>;
}

export class WorkspaceImpl implements Workspace {
    name: string;
    windows: Array<Window> = [];
    symbol: string;

    constructor(name: string) {
        this.name = name;
        this.symbol = this.makeSymbol(name);
    }

    open(): void {
        for (const window of this.windows) {
            window.open();
        }
    }

    close(): void {
        for (const window of this.windows) {
            window.close();
        }
    }

    private makeSymbol(name: string): string {
        let letters = this.name.match(/\b[a-zA-Z]/g);
        if (letters !== null) {
            return letters.join('');
        } else {
            return "";
        }
    }
}