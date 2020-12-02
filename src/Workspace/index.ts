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
    // Persist workspace to be retrieved later
    save(): void;
}

// TODO implement interface
