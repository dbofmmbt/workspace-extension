import React, { useCallback, useEffect, useState } from "react";
import { Workspace } from "../Workspace";
import { fetchManager } from "../WorkspaceManager/setup";
import { Icon } from "./Icon";
import "./Popup.css";
import { FormInput, WorkspaceForm } from "./WorkspaceForm";

export default function Popup() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActive] = useState<Workspace | undefined>(
    undefined
  );
  const [isCreating, setIsCreating] = useState<boolean>(false);
  useEffect(() => {
    fetchManager((manager) => {
      const workspaces = manager.workspaces();
      const active = manager.active();
      setWorkspaces(workspaces);
      setActive(active);
    });
  }, []);

  const handleSelection = useCallback(
    (workspace: Workspace): void => {
      if (workspace === activeWorkspace) {
        return;
      }

      fetchManager((manager) => {
        let previouslyActive = manager.active();
        let newActive = workspace;
        setActive(newActive);
        manager.turn_active(newActive);

        // Perform Open and Close operations after the manager
        // being updated on the storage
        return () => {
          newActive.open();
          previouslyActive.close();
        };
      });
    },
    [activeWorkspace]
  );

  const handleCreation = (input: FormInput) => {
    fetchManager((manager) => {
      let newWorkspace = manager.addWorkspace(input.workspaceName);
      setWorkspaces([...workspaces, newWorkspace]);
      setIsCreating(false);
    });
  };

  return (
    <div className="popupContainer">
      {workspaces.map((workspace, i) => (
        <Icon
          key={i}
          onClick={() => handleSelection(workspace)}
          isActive={workspace === activeWorkspace}
          symbol={workspace.symbol}
        />
      ))}
      {isCreating ? (
        <WorkspaceForm submitHandler={handleCreation} />
      ) : (
        <div className="plus-icon" onClick={() => setIsCreating(true)} />
      )}
    </div>
  );
}
