import axios from "axios";
import i18n from "../i18n";

// Tells the user (through the Toaster) when the server refuses a request for being too frequent / too large.
let lastShown = { key: "", at: 0 };

export const notify = (message, type = "error") => {
  const now = Date.now();
  if (lastShown.key === message && now - lastShown.at < 5000) return; // no stack of identical toasts
  lastShown = { key: message, at: now };
  window.dispatchEvent(new CustomEvent("weebid:toast", { detail: { message, type } }));
};

export const reportHttpError = (error) => {
  const status = error && error.response && error.response.status;
  if (status === 429) notify(i18n.t("errors.tooMany"));
  else if (status === 413) notify(i18n.t("errors.tooLarge"));
  else if (!error.response && error.request) notify(i18n.t("errors.network"));
};

// attach to an axios instance (the global one and the authenticated one)
export const watchHttpErrors = (instance) =>
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      reportHttpError(error);
      return Promise.reject(error);
    }
  );

watchHttpErrors(axios);
