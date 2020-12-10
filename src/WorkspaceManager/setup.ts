import Storage, { StorageImpl } from "../Storage";
import { WorkspaceImpl } from "../Workspace";
import { WindowImpl, Window } from "../Workspace/Window";
import { Tab, TabImpl } from "../Workspace/Window/Tab";
import { WorkspaceManager, WorkspaceManagerImpl } from "../WorkspaceManager";

// Gets the Manager from storage.
// In case there isn't a Manager, it'll return a newly created one.
// The Manager will be automatically saved locally.
export const fetchManager = async (): Promise<WorkspaceManager> => {
    let storage = new StorageImpl();
    let manager = await storage.load();
    if (manager === undefined) {
        manager = await initManager();
    }
    return ensureManagerIsSaved(storage, manager);
}

const ensureManagerIsSaved = (storage: Storage, manager: WorkspaceManager): Promise<WorkspaceManager> => {
    return new Promise((resolve, _) => {
        resolve(manager);
        storage.save(manager);
    });
}

const initManager = async (): Promise<WorkspaceManager> => {
    return new Promise((resolve, _) => {
        chrome.windows.getAll({ populate: true }, chromeWindows => {
            let windows = mapWindows(chromeWindows);
            let workspace = new WorkspaceImpl("Default");
            workspace.windows = windows;
            let manager = new WorkspaceManagerImpl([workspace], workspace);
            resolve(manager);
        })
    });
};

const mapWindows = (windows: chrome.windows.Window[]): Window[] => {
    return windows.map(chromeWindow => {
        let window = new WindowImpl();
        window.id = chromeWindow.id;
        if (chromeWindow.tabs !== undefined) {

            window.tabs = mapTabs(chromeWindow.tabs);
            return window;
        } else {
            throw new Error("Couldn't get tabs from a Window");
        }
    });
}

const mapTabs = (tabs: chrome.tabs.Tab[]): Tab[] => {
    return tabs.map(chromeTab => {
        if (chromeTab.url !== undefined) {
            let tab = new TabImpl(chromeTab.url, chromeTab.id);
            tab.id = chromeTab.id;
            return tab;
        } else {
            throw new Error("Couldn't get url from a Tab");
        }
    });
}
