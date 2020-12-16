import React, { useCallback, useEffect, useState } from "react";
import { Workspace } from "../Workspace";
import { fetchManager } from "../WorkspaceManager/setup";
import { Icon } from "./Icon";
import "./Popup.css";

export default function Popup() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActive] = useState<Workspace | undefined>(
    undefined
  );

  const handleClick = useCallback(
    (workspace: Workspace): void => {
      if (workspace === activeWorkspace) {
        return;
      }

      fetchManager((manager) => {
        manager.turn_active(workspace);
        setActive(workspace);
      });
    },
    [activeWorkspace]
  );

  useEffect(() => {
    fetchManager((manager) => {
      const workspaces = manager.workspaces();
      const active = manager.active();
      setWorkspaces(workspaces);
      setActive(active);
    });
  }, []);

  return (
    <div className="popupContainer">
      <div>
        {workspaces.map((workspace, i) => (
          <Icon
            key={i}
            onClick={() => handleClick(workspace)}
            isActive={workspace === activeWorkspace}
            symbol={workspace.symbol}
          />
        ))}
      </div>
    </div>
  );
}
