import React from "react";
import ReactDOM from "react-dom";
import { VoteProvider } from "./store"; 
import App from "./App";


ReactDOM.render(
  <React.StrictMode>
    <VoteProvider> 
      <App />
    </VoteProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
