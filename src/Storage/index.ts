import { WorkspaceManager } from "../WorkspaceManager";

export default interface Storage {
    save(ws: WorkspaceManager): void;
    load(): Promise<WorkspaceManager | null>;
}

export class StorageImpl implements Storage {
    storage_key: string = "workspace-extension";

    save(ws: WorkspaceManager): void {
        chrome.storage.sync.set({ [this.storage_key]: ws }, () => {
            console.log("Workspace information stored.");
        })
    }

    load(): Promise<WorkspaceManager | null> {
        return new Promise((resolve, _) => {
            chrome.storage.sync.get(this.storage_key, result => {
                const workspace_manager: WorkspaceManager | null = result[this.storage_key];
                resolve(workspace_manager)
            })
        });
    }
}
