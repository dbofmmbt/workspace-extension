import { Workspace } from "../Workspace";

export interface WorkspaceManager {
  turn_active(workspace: Workspace): void;
  active(): Workspace;
  workspaces(): Array<Workspace>;
}

export class WorkspaceManagerImpl implements WorkspaceManager {
  _active: Workspace;
  _workspaces: Array<Workspace>;

  constructor(workspaces: Array<Workspace>, active: Workspace) {
    this._active = active;
    this._workspaces = workspaces;
  }

  turn_active(workspace: Workspace): void {
    this._active.close();
    this._active = workspace;
    this._active.open();
  }

  active(): Workspace {
    return this._active;
  }

  workspaces(): Array<Workspace> {
    return this._workspaces;
  }
}
