import React, { useCallback, useEffect, useState } from "react";
import { browser } from "webextension-polyfill-ts";
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
    fetchManager(async (manager) => {
      const workspaces = manager.workspaces();
      const active = manager.active();
      setWorkspaces([...workspaces]);
      setActive(active);
    });
  }, []);

  const handleSelection = useCallback(
    async (workspace: Workspace): Promise<void> => {
      if (workspace === activeWorkspace) {
        return;
      }
      console.debug("[POPUP] Sending message to extension:", workspace);
      await browser.runtime.sendMessage(undefined, workspace.name);
    },
    [activeWorkspace]
  );

  const handleCreation = (input: FormInput) => {
    fetchManager(async (manager) => {
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
