import Close from "../../shared/Close";
import Open from "../../shared/Open";

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

  open(): void {
    chrome.tabs.create({ url: this.url }, (tab) => {
      this.id = tab.id;
    });
  }

  close(): void {
    if (this.id === undefined) {
      return;
    }
    chrome.tabs.remove(this.id, () => (this.id = undefined));
  }
}

export const defaultTab: () => Tab = () => {
  let tab = new TabImpl(NEW_TAB_URL, undefined);
  return tab;
}