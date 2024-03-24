import { createContext, useContext } from "react";
import { IRoot } from "./types";
import { Root } from "./stores/Root.store";

export const RootInstance = Root.create();

const RootContext = createContext<null | IRoot>(RootInstance);

export const RootProvider = RootContext.Provider;

export function useRoot() {
  const store = useContext(RootContext);
  if (store === null) {
    throw new Error("Store cannot be null, please add a context provider");
  }
  return store;
}
