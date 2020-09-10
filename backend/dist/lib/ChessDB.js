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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChessDB = void 0;
const mongodb_1 = require("mongodb");
class ChessDB {
    constructor(client) {
        this.connected = false;
        this.client = client;
    }
    createObjectID() {
        return String(new mongodb_1.ObjectID());
    }
    createSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const id = this.createObjectID();
            const playerId = this.createObjectID();
            yield this.db.collection('sessions').insertOne({
                _id: id,
                started: true,
                pending: true,
                players: [{ _player_id: playerId, timestamp: Date.now(), color: 'w' }],
                moves: [],
                started_at: Date.now()
            });
            return { _id: id, _player_id: playerId };
        });
    }
    joinSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const playerId = this.createObjectID();
            yield this.db.collection('sessions').updateOne({ _id: id }, {
                $addToSet: {
                    players: { _player_id: playerId, TimeStamp: Date.now(), color: 'b' }
                },
                $set: {
                    pending: false,
                    updated_at: Date.now()
                }
            });
            return { _id: id, _player_id: playerId };
        });
    }
    chessMove(id, playerId, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.collection('sessions').updateOne({ _id: id }, {
                $addToSet: {
                    moves: { _player_id: playerId, from, to, timestamp: Date.now() }
                },
                $set: {
                    updated_at: Date.now()
                }
            });
            return { _id: id };
        });
    }
    closeSession(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.collection('sessions').updateOne({ _id: id }, {
                $set: {
                    started: false,
                    pending: false,
                    closed_at: Date.now()
                }
            });
            return { _id: id };
        });
    }
    findSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.collection('sessions').find({ started: true }).sort([['started_at', -1]]).limit(1).toArray();
            return result[0];
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.client.connect();
                this.connected = true;
                this.db = this.client.db('chess_db');
                const hasSessionCollection = yield this.db.listCollections({ name: 'sessions' }).toArray();
                if (hasSessionCollection.length < 1) {
                    yield this.db.createCollection('sessions');
                }
            }
            catch (ex) {
                this.connected = false;
                throw ex;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connected) {
                const openSessions = yield this.db.collection('sessions').find({ started: true }).sort([['started_at', -1]]).limit(1).toArray();
                for (const session of openSessions) {
                    yield this.closeSession(session._id);
                }
                yield this.client.close();
            }
        });
    }
}
exports.ChessDB = ChessDB;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ2hlc3NEQi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvQ2hlc3NEQi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBK0M7QUFFL0MsTUFBYSxPQUFPO0lBS2xCLFlBQW9CLE1BQW1CO1FBSC9CLGNBQVMsR0FBWSxLQUFLLENBQUE7UUFJaEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7SUFDdEIsQ0FBQztJQUVPLGNBQWM7UUFDcEIsT0FBTyxNQUFNLENBQUMsSUFBSSxrQkFBUSxFQUFFLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRVksYUFBYTs7WUFDeEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFBO1lBQ2hDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUV0QyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDN0MsR0FBRyxFQUFFLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsT0FBTyxFQUFFLElBQUk7Z0JBQ2IsT0FBTyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDO2dCQUN0RSxLQUFLLEVBQUUsRUFBRTtnQkFDVCxVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTthQUN2QixDQUFDLENBQUE7WUFFRixPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLENBQUE7UUFDMUMsQ0FBQztLQUFBO0lBRVksV0FBVyxDQUFFLEVBQVU7O1lBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQTtZQUV0QyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUMsVUFB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