import { Workspace, WorkspaceImpl } from "../Workspace";
import { WindowImpl } from "../Workspace/Window";

export interface WorkspaceManager {
  turn_active(workspace: Workspace): void;
  active(): Workspace;
  workspaces(): Array<Workspace>;
  addWorkspace(name: string): Workspace;
  removeWorkspace(workspace: Workspace): void;
}

export class WorkspaceManagerImpl implements WorkspaceManager {
  _active: Workspace;
  _workspaces: Array<Workspace>;

  constructor(workspaces: Array<Workspace>, active: Workspace) {
    this._active = active;
    this._workspaces = workspaces;
  }
  addWorkspace(name: string): Workspace {
    const workspace = new WorkspaceImpl(name);
    const window = new WindowImpl();
    workspace.addWindow(window);
    this._workspaces.push(workspace);
    return workspace;
  }

  removeWorkspace(workspace: Workspace): void {
    let index = this._workspaces.findIndex((ws) => ws === workspace);
    if (index === -1) {
      return;
    }

    this._workspaces.splice(index, 1);
  }

  turn_active(workspace: Workspace): void {
    this._active = workspace;
  }

  active(): Workspace {
    return this._active;
  }

  workspaces(): Array<Workspace> {
    return this._workspaces;
  }
}
