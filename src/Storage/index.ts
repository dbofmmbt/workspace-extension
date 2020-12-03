import { WorkspaceManager } from "../WorkspaceManager";

export default interface Storage {
    save(ws: WorkspaceManager): void;
    load(): WorkspaceManager;
}
