"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessSocket = void 0;
const ws_1 = __importDefault(require("ws"));
class ChessSocket {
    constructor(wss, database) {
        this.connected = false;
        this.wss = wss;
        this.database = database;
    }
    broadcastOthers(ws, data) {
        this.wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
    broadcast(data) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
    send(ws, data) {
        ws.send(JSON.stringify(data));
    }
    startGame(ws) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.database.createSession();
            const head = { action: 'gameStart', sessionId: res._id };
            this.send(ws, Object.assign({ isPlayer: true, playerId: res._player_id }, head));
            this.broadcastOthers(ws, Object.assign({ isPlayer: false }, head));
        });
    }
    joinGame(ws, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.database.joinSession(sessionId);
            const head = { action: 'gameJoin', sessionId: res._id };
            this.send(ws, Object.assign({ isPlayer: true, playerId: res._player_id }, head));
            this.broadcastOthers(ws, Object.assign({ isPlayer: false }, head));
        });
    }
    quitGame(ws, sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.database.closeSession(sessionId);
            this.broadcast({ action: 'gameQuit', sessionId: res._id });
            console.log(ws.toString());
        });
    }
    pieceMove(ws, sessionId, playerId, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.database.chessMove(sessionId, playerId, from, to);
            this.broadcastOthers(ws, { action: 'pieceMove', sessionId: res._id, from, to });
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.wss.on('connection', (ws) => {
                this.connected = true;
                ws.on('message', (message) => __awaiter(this, void 0, void 0, function* () {
                    const data = JSON.parse(message);
                    switch (data.request) {
                        case 'startGame':
                            yield this.startGame(ws);
                            break;
                        case 'joinGame':
                            yield this.joinGame(ws, data.sessionId);
                            break;
                        case 'quitGame':
                            yield this.quitGame(ws, data.sessionId);
                            break;
                        case 'pieceMove':
                            yield this.pieceMove(ws, data.sessionId, data.playerId, data.data.from, data.data.to);
                            break;
                    }
                }));
            });
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise(resolve => {
                if (this.connected) {
                    this.broadcast({ action: 'serverShutdown' });
                    setTimeout(() => resolve(), 5000);
                }
            });
        });
    }
}
exports.ChessSocket = ChessSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hlc3NTb2NrZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL0NoZXNzU29ja2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEwQjtBQUUxQixNQUFhLFdBQVc7SUFLdEIsWUFBb0IsR0FBUSxFQUFFLFFBQWlCO1FBSnZDLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFLaEMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtJQUMxQixDQUFDO0lBRU8sZUFBZSxDQUFFLEVBQU8sRUFBRSxJQUFTO1FBQ3pDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQ3ZDLElBQUksTUFBTSxLQUFLLEVBQUUsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLFlBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3pELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU8sU0FBUyxDQUFFLElBQVM7UUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBVyxFQUFFLEVBQUU7WUFDdkMsSUFBSSxNQUFNLENBQUMsVUFBVSxLQUFLLFlBQVMsQ0FBQyxJQUFJLEVBQUU7Z0JBQ3hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU8sSUFBSSxDQUFFLEVBQU8sRUFBRSxJQUFTO1FBQzlCLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxD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