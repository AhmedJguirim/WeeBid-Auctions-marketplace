import { io } from "socket.io-client";
import { SOCKET_URL } from "../../../config/env";

// SOCKET_URL undefined => same origin (socket.io is proxied by nginx).
// The login token lets the server verify who we are before it gives access to our personal notification room.
export default io(SOCKET_URL, {
  auth: (cb) => cb({ token: localStorage.getItem("token") }),
});
