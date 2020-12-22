import { browser } from "webextension-polyfill-ts";
import { TabImpl } from "./Workspace/Window/Tab";
import { fetchManager } from "./WorkspaceManager/setup";

chrome.runtime.onInstalled.addListener(async (details) => {
  console.debug("[EVENT] runtime.onInstalled:", details);

  await browser.storage.sync.clear();
  console.log("Storage cleared.");

  fetchManager((_manager) => {
    // Nothing to do. `fetchManager` will automatically
    // set the initial Workspace and saved it locally.
  });
});

chrome.runtime.onStartup.addListener(() => {
  // In principle, there's nothing to do in this event, actually.
  // Let's see if it remains that way in the test phase.
});

chrome.tabs.onCreated.addListener((chromeTab) => {
  console.debug("[EVENT] tabs.onCreated:", chromeTab);
  const url = chromeTab.pendingUrl;
  if (!url) return;

  fetchManager((manager) => {
    let workspace = manager.active();

    let window = workspace.findWindow(chromeTab.windowId);
    if (!window) {
      window = workspace.createWindow(chromeTab.windowId);
    }
    const id = chromeTab.id;
    if (id && window.findTab(id)) {
      return;
    }

    const tab = new TabImpl(url, chromeTab.id);
    window.addTab(tab);
  });
});

chrome.tabs.onUpdated.addListener((tabId, { url }, chromeTab) => {
  if (!url) {
    return;
  }

  console.debug("[EVENT] tabs.onUpdated:", tabId, url, chromeTab);

  fetchManager((manager) => {
    let window = manager.active().findWindow(chromeTab.windowId);
    if (!window) {
      throw new Error(
        `Couldn't find window to update tab: ${chromeTab.windowId}`
      );
    }

    if (!chromeTab.id) {
      return;
    }
    let tab = window.findTab(chromeTab.id);
    if (tab) {
      tab.url = url;
    } else {
      tab = new TabImpl(url, chromeTab.id);
      window.addTab(tab);
    }
  });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.debug("[EVENT] tabs.onRemoved:", tabId, removeInfo);
  let { windowId } = removeInfo;

  fetchManager((manager) => {
    let workspace = manager.active();
    let window = workspace.findWindow(windowId);
    if (!window) {
      throw new Error("Couldn't find window to remove tab.");
    }

    let removalSucceeded = window.removeTab(tabId);
    if (!removalSucceeded) {
      console.warn(
        `Tab with id ${tabId} was not found on window while removing it.`
      );
    }

    if (window.tabs.length === 0) {
      workspace.removeWindow(windowId);
    }
  });
});

chrome.windows.onCreated.addListener((chromeWindow) => {
  console.debug("[EVENT] windows.onCreated:", chromeWindow);

  fetchManager((manager) => {
    let workspace = manager.active();
    let windowExists = workspace.findWindow(chromeWindow.id);
    if (windowExists) {
      return;
    }
    workspace.createWindow(chromeWindow.id);
  });
});

chrome.windows.onRemoved.addListener((windowId) => {
  console.debug("[EVENT] windows.onRemoved:", windowId);

  fetchManager((manager) => {
    let workspace = manager.active();
    workspace.removeWindow(windowId);
  });
});
