import Close from "../../shared/Close";
import Open from "../../shared/Open";
import { browser } from "webextension-polyfill-ts";

const NEW_TAB_URL = "chrome://newtab";

export interface Tab extends Open, Close {
  url: string;
  id: number | undefined;
}

export class TabImpl implements Tab {
  url: string;
  id: number | undefined;

  constructor(url: string, id: number | undefined) {
    this.url = url;
    this.id = id;
  }

  async open(): Promise<void> {
    if (this.url === NEW_TAB_URL) {
      return;
    }

    let tab = await browser.tabs.create({ url: this.url });
    this.id = tab.id;
  }

  async close(): Promise<void> {
    if (!this.id) {
      return;
    }
    await browser.tabs.remove(this.id);
    this.id = undefined;
  }
}

export const defaultTab: () => Tab = () => {
  let tab = new TabImpl(NEW_TAB_URL, undefined);
  return tab;
};
