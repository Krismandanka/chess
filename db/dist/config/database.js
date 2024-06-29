"use strict";
// const mongoose = require("mongoose");
// require("dotenv").config();
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
exports.dbConnect = void 0;
// exports.connect = () => {
//     mongoose.connect(process.env.MONGODB_URL)
//     .then(() => console.log("DB Connected Successfully"))
//     .catch( (error:any) => {
//         console.log("DB Connection Failed");
//         console.error(error);
//         process.exit(1);
//     } )
// };
const mongoose_1 = __importDefault(require("mongoose"));
const dbConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('mongo url not defined');
        }
        const conn = yield mongoose_1.default.connect(process.env.MONGO_URL);
        console.log(`MongoDb connected`);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
exports.dbConnect = dbConnect;
