import { Server, ServerOptions } from "socket.io";
import { Server as HttpServer } from "http";

export class SocketIOService {
  private static _instance: SocketIOService | undefined;
  private static server: Server | undefined;

  private constructor() {}

  static instance(): SocketIOService {
    if (!this._instance) {
      this._instance = new SocketIOService();
    }

    return this._instance;
  }

  initialize(httpServer: HttpServer, opts?: Partial<ServerOptions>) {
    SocketIOService.server = new Server(httpServer, opts);
    return SocketIOService.server;
  }

  ready() {
    return SocketIOService.server !== undefined;
  }

  getServer(): Server {
    if (!SocketIOService.server) {
      throw new Error("IO server requested before initialization");
    }

    return SocketIOService.server;
  }

  sendMessage(roomId: string | string[], key: string, message: any) {
    this.getServer().to(roomId).emit(key, message);
  }

  emitAll(key: string, message: any) {
    this.getServer().emit(key, message);
  }

  getRooms() {
    return this.getServer().sockets.adapter.rooms;
  }
}
