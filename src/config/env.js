// Base URLs of the backend and the socket server.
// Empty string = same origin (production Docker setup, everything behind nginx).
// For `npm start` they are set in .env.development.
export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "";
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || undefined;
