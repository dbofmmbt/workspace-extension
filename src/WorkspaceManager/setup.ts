import { browser, Windows, Tabs } from "webextension-polyfill-ts";
import { StorageImpl } from "../Storage";
import { WorkspaceImpl } from "../Workspace";
import { WindowImpl, Window } from "../Workspace/Window";
import { Tab, TabImpl } from "../Workspace/Window/Tab";
import { WorkspaceManager, WorkspaceManagerImpl } from "../WorkspaceManager";

// Gets the Manager from storage.
// In case there isn't a Manager, it'll return a newly created one.
// The Manager will be automatically saved locally.
// You may optionally return a callback which will be executed
// after the manager is saved on the storage.
export const fetchManager = async (
  managerCallback: (
    manager: WorkspaceManager
  ) => Promise<(() => Promise<void | undefined>) | void>
) => {
  let storage = new StorageImpl();
  let manager = await storage.load();
  if (!manager) {
    manager = await initManager();
  }
  let afterStorageCallback = await managerCallback(manager);
  await storage.save(manager);
  if (afterStorageCallback) {
    await afterStorageCallback();
  }
};

const initManager = async (): Promise<WorkspaceManager> => {
  let chromeWindows = await browser.windows.getAll({ populate: true });
  let windows = mapWindows(chromeWindows);
  let workspace = new WorkspaceImpl("Default");
  workspace.windows = windows;
  let manager = new WorkspaceManagerImpl([workspace], workspace);
  return manager;
};

const mapWindows = (windows: Windows.Window[]): Window[] => {
  return windows.map((chromeWindow) => {
    let window = new WindowImpl();
    window.id = chromeWindow.id;
    if (chromeWindow.tabs !== undefined) {
      window.tabs = mapTabs(chromeWindow.tabs);
      return window;
    } else {
      throw new Error("Couldn't get tabs from a Window");
    }
  });
};

const mapTabs = (tabs: Tabs.Tab[]): Tab[] => {
  return tabs.map((chromeTab) => {
    if (chromeTab.url !== undefined) {
      let tab = new TabImpl(chromeTab.url, chromeTab.id);
      tab.id = chromeTab.id;
      return tab;
    } else {
      throw new Error("Couldn't get url from a Tab");
    }
  });
};
