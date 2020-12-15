import React, { useEffect, useState } from "react";
import { Workspace } from "../Workspace";
import { fetchManager } from "../WorkspaceManager/setup";
import "./Popup.css";

export default function Popup() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  useEffect(() => {
    fetchManager(manager => {
      const workspaces = manager.workspaces();
      setWorkspaces(workspaces);
    });
  }, []);

  return (<div className="popupContainer">
    <ul>
      {workspaces.map(workspace => <li>{workspace.name}</li>)}
    </ul>
  </div>);
}
