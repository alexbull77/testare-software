import { IRoot } from "@/mst/types";
import { get, set } from "idb-keyval";
import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { useEffect, useState } from "react";

export const useUser = (root: IRoot) => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    get("user").then((res) => {
      if (!res) return;
      applySnapshot(root.user, res);
      setInitialized(true);
    });

    const save = () =>
      window.addEventListener("beforeunload", () => {
        set("user", getSnapshot(root.user));
      });

    return () => {
      // on page reload
      window.removeEventListener("beforeunload", save);

      save();
    };
  }, [
    root.user.userId,
    root.user.authenticated,
    root.user,
    root.user.authenticated,
  ]);

  return initialized;
};
