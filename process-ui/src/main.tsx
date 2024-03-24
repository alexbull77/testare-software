import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RootInstance, RootProvider } from "./mst/provider.ts";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RootProvider value={RootInstance}>
      <App />
    </RootProvider>
  </React.StrictMode>
);
