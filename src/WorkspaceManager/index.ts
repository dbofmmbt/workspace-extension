import { Workspace } from "../Workspace";

export interface WorkspaceManager {
    turn_active(workspace: Workspace): void;
    save_state(): void;
    active(): Workspace;
    workspaces(): Iterable<Workspace>;
}