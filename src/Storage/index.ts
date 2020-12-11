import { Workspace, WorkspaceImpl } from "../Workspace";
import { WindowImpl } from "../Workspace/Window";
import { TabImpl } from "../Workspace/Window/Tab";
import { WorkspaceManager, WorkspaceManagerImpl } from "../WorkspaceManager";

export default interface Storage {
    save(ws: WorkspaceManager): void;
    load(): Promise<WorkspaceManager | undefined>;
}

export class StorageImpl implements Storage {
    storage_key: string = "workspace-extension";

    save(ws: WorkspaceManager): void {
        console.debug("Manager before being stored:", ws);
        let activeWorkspace = ws
            .workspaces()
            .findIndex((workspace) => workspace === ws.active());

        if (activeWorkspace === -1) {
            throw new Error("Active workspace must be present.");
        }

        let data: ManagerData = {
            activeWorkspace: activeWorkspace,
            workspaces: ws.workspaces().map(to_storage_data),
        };

        chrome.storage.sync.set({ [this.storage_key]: data }, () => {
            console.debug("Workspace information stored: ", data);
        });
    }

    load(): Promise<WorkspaceManager | undefined> {
        return new Promise((resolve, _) => {
            chrome.storage.sync.get(this.storage_key, result => {
                const manager_data: ManagerData | undefined = result[this.storage_key];
                console.debug("Data from storage:", manager_data);
                if (manager_data) {
                    let manager = from_storage_data(manager_data);
                    resolve(manager);
                } else {
                    resolve(undefined);
                }
            })
        });
    }
}

type ManagerData = {
    activeWorkspace: number;
    workspaces: WorkspaceData[];
};

type WorkspaceData = { name: string, windows: WindowData[] };

type WindowData = { id: number | undefined, tabs: TabData[] };

type TabData = { id: number | undefined, url: string };

function to_storage_data(ws: Workspace): WorkspaceData {
    return {
        name: ws.name,
        windows: ws.windows.map(window => (
            {
                id: window.id,
                tabs: window.tabs.map(tab => ({ id: tab.id, url: tab.url }))
            }
        ))
    };
}

function from_storage_data(data: ManagerData): WorkspaceManager {
    let workspaces = data.workspaces.map(workspace_data => {
        let workspace = new WorkspaceImpl(workspace_data.name);

        workspace.windows = workspace_data.windows.map(window_data => {
            let window = new WindowImpl();
            window.id = window_data.id;
            window.tabs = window_data.tabs.map(tab_data => {
                return new TabImpl(tab_data.url, tab_data.id);
            });

            return window;
        });

        return workspace;
    });

    let active = workspaces[data.activeWorkspace];
    return new WorkspaceManagerImpl(workspaces, active);
}
