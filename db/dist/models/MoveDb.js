"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const MoveSchema = new mongoose_1.Schema({
    color: {
        type: String,
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    piece: {
        type: String
    },
    captured: {
        type: String
    },
    promotion: {
        type: String
    },
    flags: {
        type: String
    },
    san: {
        type: String
    },
    lan: {
        type: String
    },
    before: {
        type: String
    },
    after: {
        type: String
    },
}, { timestamps: true });
const MoveDb = (0, mongoose_1.model)("MoveDb", MoveSchema);
exports.default = MoveDb;
