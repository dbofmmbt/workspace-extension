import Close from "../../shared/Close";
import Open from "../../shared/Open";

export interface Tab extends Open, Close {
    url: string;
}

export class TabImpl implements Tab {
    url: string;
    id: number | undefined;

    constructor(url: string) {
        this.url = url;
    }

    open(): void {
        chrome.tabs.create({ url: this.url }, tab => { this.id = tab.id });
    }

    close(): void {
        if (this.id === undefined) {
            return;
        }
        chrome.tabs.remove(this.id, () => this.id = undefined);
    }
}