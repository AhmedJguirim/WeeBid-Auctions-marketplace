import reportWebVitals from "./reportWebVitals";
import ReactDOM from "react-dom";
import React from "react";
import { Provider } from "react-redux";
import "@fontsource-variable/inter";
import "./index.css";
import "./i18n";
import "./utils/httpErrors";
import Base from "./components/base/Base.js";
import { store } from "./redux/store";

ReactDOM.render(
  <Provider store={store}>
    <Base />
  </Provider>,
  document.getElementById("root")
);

reportWebVitals();
