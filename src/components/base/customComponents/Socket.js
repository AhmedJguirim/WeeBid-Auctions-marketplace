import { io } from "socket.io-client";
import { SOCKET_URL } from "../../../config/env";

// SOCKET_URL undefined => same origin (socket.io is proxied by nginx)
export default io(SOCKET_URL);
