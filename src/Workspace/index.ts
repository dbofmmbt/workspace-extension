import Close from "./shared/Close";
import Open from "./shared/Open";
import { Window, WindowImpl } from "./Window";

export interface Workspace extends Open, Close {
  // Workspace's identifier
  name: string;
  // Abbreviation of `name`
  symbol: string;
  // Windows belonging to Workspace
  windows: Array<Window>;

  findWindow(id: number): Window | undefined;
  // Adds the given Window to Workspace.
  addWindow(window: Window): void;
  // Remove the Window with the specified id from the Workspace, if any.
  removeWindow(id: number): void;

  createWindow(id: number): Window;
}

export class WorkspaceImpl implements Workspace {
  name: string;
  windows: Array<Window> = [];
  symbol: string;

  constructor(name: string) {
    this.name = name;
    this.symbol = this.makeSymbol();
  }
  createWindow(id: number): Window {
    let window = new WindowImpl();
    window.id = id;
    this.addWindow(window);
    return window;
  }

  findWindow(id: number): Window | undefined {
    return this.windows.find((window) => window.id === id);
  }

  addWindow(window: Window): void {
    this.windows.push(window);
  }

  removeWindow(id: number): void {
    const index = this.windows.findIndex((value) => value.id === id);
    if (index == -1) return;
    this.windows.splice(index, 1);
  }

  async open(): Promise<void> {
    let promises = this.windows.map((window) => window.open());
    await Promise.all(promises);
  }

  async close(): Promise<void> {
    let promises = this.windows.map((window) => window.close());
    await Promise.all(promises);
  }

  private makeSymbol(): string {
    let letters = this.name.match(/\b[a-zA-Z]/g);
    if (letters !== null) {
      return letters.join("");
    } else {
      return "";
    }
  }
}
