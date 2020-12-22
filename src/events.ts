import { browser } from "webextension-polyfill-ts";
import { Workspace } from "./Workspace";
import { TabImpl } from "./Workspace/Window/Tab";
import { fetchManager } from "./WorkspaceManager/setup";

const EVENT_HANDLING_KEY = "EventHandling";

export const setEventHandling = async (
  shouldHandle: boolean
): Promise<void> => {
  console.debug("[SET_EVENT_HANDLING]:", shouldHandle);
  await browser.storage.local.set({ [EVENT_HANDLING_KEY]: shouldHandle });
};

export const shouldHandleEvents = async (): Promise<boolean> => {
  let generic_result = await browser.storage.local.get(EVENT_HANDLING_KEY);
  let result: boolean = generic_result[EVENT_HANDLING_KEY];
  return result;
};

chrome.runtime.onInstalled.addListener(async (details) => {
  console.debug("[EVENT] runtime.onInstalled:", details);

  await browser.storage.sync.clear();
  console.log("[STORAGE] cleared.");
  await setEventHandling(true);

  fetchManager(async (_manager) => {
    // Nothing to do. `fetchManager` will automatically
    // set the initial Workspace and saved it locally.
  });
});

chrome.runtime.onStartup.addListener(async () => {
  // In principle, there's nothing to do in this event, actually.
  // Let's see if it remains that way in the test phase.
});

chrome.tabs.onCreated.addListener(async (chromeTab) => {
  let shouldHandle = await shouldHandleEvents();
  if (!shouldHandle) return;

  console.debug("[EVENT] tabs.onCreated:", chromeTab);

  const url = chromeTab.pendingUrl;
  if (!url) return;

  fetchManager(async (manager) => {
    let workspace = manager.active();

    let window = workspace.findWindow(chromeTab.windowId);
    if (!window) {
      throw new Error(
        `Couldn't find window to create tab. windowId: ${chromeTab.windowId} tab.id: ${chromeTab.id}`
      );
    }
    const id = chromeTab.id;
    if (id && window.findTab(id)) {
      return;
    }

    const tab = new TabImpl(url, chromeTab.id);
    window.addTab(tab);
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, { url }, chromeTab) => {
  let shouldHandle = await shouldHandleEvents();
  if (!shouldHandle) return;
  if (!url) return;

  console.debug("[EVENT] tabs.onUpdated:", tabId, url, chromeTab);

  fetchManager(async (manager) => {
    let window;
    for (let workspace of manager.workspaces()) {
      window = workspace.findWindow(chromeTab.windowId);
      if (window) break;
    }

    if (!window) {
      throw new Error(
        `Couldn't find window to update tab. windowId: ${chromeTab.windowId} tabId: ${tabId}`
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

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  let shouldHandle = await shouldHandleEvents();
  if (!shouldHandle) return;

  console.debug("[EVENT] tabs.onRemoved:", tabId, removeInfo);

  let { windowId, isWindowClosing } = removeInfo;
  if (isWindowClosing) return;

  fetchManager(async (manager) => {
    let workspace: Workspace | undefined;
    let window;
    for (let ws of manager.workspaces()) {
      window = ws.findWindow(windowId);
      if (window) {
        workspace = ws;
        break;
      }
    }
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
      workspace!.removeWindow(windowId);
    }
  });
});

chrome.windows.onCreated.addListener(async (chromeWindow) => {
  let shouldHandle = await shouldHandleEvents();
  if (!shouldHandle) return;

  console.debug("[EVENT] windows.onCreated:", chromeWindow);

  fetchManager(async (manager) => {
    let windowExists;
    for (let ws of manager.workspaces()) {
      windowExists = ws.findWindow(chromeWindow.id);
      if (windowExists) {
        break;
      }
    }
    if (!windowExists) {
      manager.active().createWindow(chromeWindow.id);
    }
  });
});

chrome.windows.onRemoved.addListener(async (_windowId) => {
  // There's nothing to do on this event right now.
});

browser.runtime.onMessage.addListener(async (message) => {
  console.debug("[EVENT] Message Received:", message);
  let name: string = message;
  fetchManager(async (manager) => {
    let previouslyActive = manager.active();
    let newActive = manager.workspaces().find((ws) => ws.name === name);
    if (!newActive)
      throw new Error(`couldn't find workspace to activate. Name: ${name}`);

    manager.turnActive(newActive);

    await setEventHandling(false);
    await newActive.open();
    await previouslyActive.close();

    return async () => {
      await setEventHandling(true);
    };
  });
});
