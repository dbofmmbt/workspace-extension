import { TabImpl } from "./Workspace/Window/Tab";
import { fetchManager } from "./WorkspaceManager/setup";

chrome.runtime.onInstalled.addListener(details => {
    console.debug("runtime.onInstalled:", details);

    chrome.storage.sync.clear(function () {
        console.log("Storage cleared.");
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });

    fetchManager(_manager => {
        // Nothing to do. `fetchManager` will automatically
        // set the initial Workspace and saved it locally.
    });
});

chrome.runtime.onStartup.addListener(() => {
    // In principle, there's nothing to do in this event, actually.
    // Let's see if it remains that way in the test phase.
});

chrome.tabs.onCreated.addListener(chromeTab => {
    console.debug("tabs.onCreated:", chromeTab);
    const url = chromeTab.pendingUrl;
    if (!url) return;

    fetchManager(manager => {
        let windows = manager.active().windows;

        let window = windows.find(window => window.id === chromeTab.windowId);
        if (!window) {
            throw new Error("Couldn't find window to add tab.");
        }

        const tab = new TabImpl(url, chromeTab.id);
        window.addTab(tab);
    });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    console.debug("tabs.onRemoved:", tabId, removeInfo);
});

chrome.windows.onCreated.addListener(tab => {
    console.debug("windows.onCreated:", tab);
});

chrome.windows.onRemoved.addListener(windowId => {
    console.debug("windows.onRemoved:", windowId);
});
