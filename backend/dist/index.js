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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ws_1 = __importDefault(require("ws"));
const mongodb_1 = require("mongodb");
const ChessDB_1 = require("./lib/ChessDB");
const ChessService_1 = require("./lib/ChessService");
const ChessSocket_1 = require("./lib/ChessSocket");
const config_1 = require("./config");
process.stdin.resume();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new mongodb_1.MongoClient(config_1.MONGO_URI, {
        "useNewUrlParser": true,
        "useUnifiedTopology": true
    });
    const database = new ChessDB_1.ChessDB(client);
    yield database.connect();
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(ChessService_1.ChessService(database));
    const wss = new ws_1.default.Server({ port: config_1.SOCKET_PORT });
    const socket = new ChessSocket_1.ChessSocket(wss, database);
    yield socket.connect();
    app.listen(config_1.LISTEN_PORT, () => {
        if (config_1.LOG_LEVEL > 1)
            console.log(`Server listening on port ${config_1.LISTEN_PORT}`);
    });
    const onExit = () => __awaiter(void 0, void 0, void 0, function* () {
        if (config_1.LOG_LEVEL > 1)
            console.log(`Teardown`);
        yield socket.disconnect();
        yield database.disconnect();
        if (config_1.LOG_LEVEL > 1)
            console.log(`Exit`);
        process.exit();
    });
    process.on('SIGUSR1', onExit);
    process.on('SIGUSR2', onExit);
    process.on('SIGTERM', onExit);
    process.on('SIGINT', onExit);
});
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzREFBNkI7QUFDN0IsZ0RBQXVCO0FBQ3ZCLDRDQUEwQjtBQUUxQixxQ0FBcUM7QUFFckMsMkNBQXVDO0FBQ3ZDLHFEQUFpRDtBQUNqRCxtREFBK0M7QUFFL0MscUNBQXlFO0FBRXpFLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUE7QUFFdEIsTUFBTSxJQUFJLEdBQUcsR0FBUyxFQUFFO0lBQ3RCLE1BQU0sTUFBTSxHQUFHLElBQUkscUJBQVcsQ0FBQyxrQkFBUyxFQUFFO1FBQ3hDLGlCQUFpQixFQUFFLElBQUk7UUFDdkIsb0JBQW9CLEVBQUUsSUFBSTtLQUMzQixDQUFDLENBQUE7SUFFRixNQUFNLFFBQVEsR0FBRyxJQUFJLGlCQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDcEMsTUFBTSxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7SUFFeEIsTUFBTSxHQUFHLEdBQUcsaUJBQU8sRUFBRSxDQUFBO0lBQ3JCLEdBQUcsQ0FBQyxHQUFHLENBQUMsY0FBSSxFQUFFLENBQUMsQ0FBQTtJQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsMkJBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO0lBRS9CLE1BQU0sR0FBRyxHQUFHLElBQUksWUFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxvQkFBVyxFQUFFLENBQUMsQ0FBQTtJQUN2RCxNQUFNLE1BQU0sR0FBRyxJQUFJLHlCQUFXLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQzdDLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0lBRXRCLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQVcsRUFBRSxHQUFHLEVBQUU7UUFDM0IsSUFBSSxrQkFBUyxHQUFHLENBQUM7WUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixvQkFBVyxFQUFFLENBQUMsQ0FBQTtJQUMzRSxDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sTUFBTSxHQUFHLEdBQVMsRUFBRTtRQUN4QixJQUFJLGtCQUFTLEdBQUcsQ0FBQztZQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7UUFFMUMsTUFBTSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDekIsTUFBTSxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUE7UUFFM0IsSUFBSSxrQkFBUyxHQUFHLENBQUM7WUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBRXRDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNqQixDQUFDLENBQUEsQ0FBQTtJQUVELE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzlCLE9BQU8sQ0FBQyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLENBQUMsQ0FBQSxDQUFBO0FBRUQsSUFBSSxFQUFFLENBQUEifQ==