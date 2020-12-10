import { WorkspaceManager } from "../WorkspaceManager";

export default interface Storage {
    save(ws: WorkspaceManager): void;
    load(): Promise<WorkspaceManager | undefined>;
}

export class StorageImpl implements Storage {
    storage_key: string = "workspace-extension";

    // TODO Rewrite `save` and `load`.
    // We can't save the Manager object in the storage because the object
    // loses its methods. It'll be simpler to just separate the needed
    // information on `save` and recreate the objects with that data
    // later, on `load`.
    save(ws: WorkspaceManager): void {
        chrome.storage.sync.set({ [this.storage_key]: ws }, () => {
            console.log("Workspace information stored: ", ws);
        })
    }

    load(): Promise<WorkspaceManager | undefined> {
        return new Promise((resolve, _) => {
            chrome.storage.sync.get(this.storage_key, result => {
                const workspace_manager: WorkspaceManager | undefined = result[this.storage_key];
                resolve(workspace_manager)
            })
        });
    }
}
