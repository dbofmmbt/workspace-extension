import { WorkspaceManager } from "../WorkspaceManager";

export default interface Storage {
    save(ws: WorkspaceManager): void;
    load(): WorkspaceManager | null;
}

export class StorageImpl implements Storage {
    storage_key: string = "workspace-extension";
    _workspace_manager: WorkspaceManager | null = null;

    save(ws: WorkspaceManager): void {
        chrome.storage.sync.set({ [this.storage_key]: ws }, () => {
            console.log("Workspace information stored.");
        })
    }

    load(): WorkspaceManager | null {
        chrome.storage.sync.get(this.storage_key, result => {
            this._workspace_manager = result[this.storage_key];
        })

        return this._workspace_manager;
    }
}
