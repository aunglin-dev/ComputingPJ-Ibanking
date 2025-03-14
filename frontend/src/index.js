import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Storage/store";

// Material Dashboard 2 React Context Provider
import { MaterialUIControllerProvider } from "context";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <MaterialUIControllerProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </MaterialUIControllerProvider>
  </BrowserRouter>
);
