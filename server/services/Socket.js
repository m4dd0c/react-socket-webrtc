import { Server } from "socket.io";

class SocketService {
  _io;
  constructor(server) {
    this._io = new Server(server, {
      cors: { origin: true },
    });
  }

  get io() {
    return this._io;
  }

  nameToId = new Map();
  idToName = new Map();

  connection = (socket) => {
    console.log("connected", socket.id);
    socket.on("join:room", ({ name, roomId }) => {
      socket.emit("me", { name, socketId: socket.id });
      this._io.to(roomId).emit("rc:joined", { name, socketId: socket.id });
      socket.join(roomId);

      this.nameToId.set(name, socket.id);
      this.idToName.set(socket.id, name);
    });

    socket.on("msg:send", ({ msg, id }) => {
      const name = this.idToName.get(id);
      this._io.emit("msg:recv", { msg, name });
    });

    socket.on("create:call", ({ offer, to }) => {
      this._io.to(to).emit("incoming:call", { from: socket.id, offer });
    });

    socket.on("call:accepted", ({ to, answer }) => {
      this._io.to(to).emit("call:accepted", { from: socket.id, answer });
    });
  };
}
export default SocketService;
