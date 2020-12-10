import Close from "./shared/Close";
import Open from "./shared/Open";
import { Window } from "./Window";

export interface Workspace extends Open, Close {
    // Workspace's identifier
    name: string;
    // Abbreviation of `name`
    symbol: string;
    // Windows belonging to Workspace
    windows: Array<Window>;
    // Adds the given Window to Workspace.
    addWindow(window: Window): void;
    // Remove the Window with the specified id from the Workspace, if any.
    removeWindow(id: number): void;
}

export class WorkspaceImpl implements Workspace {
    name: string;
    windows: Array<Window> = [];
    symbol: string;

    constructor(name: string) {
        this.name = name;
        this.symbol = this.makeSymbol(name);
    }

    addWindow(window: Window): void {
        this.windows.push(window);
    }

    removeWindow(id: number): void {
        const index = this.windows.findIndex(value => { value.id === id });
        if (index == -1) return;
        this.windows.splice(index, 1);
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