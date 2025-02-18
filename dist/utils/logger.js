"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rl = exports.prompt = void 0;
exports.logMessage = logMessage;
const chalk_1 = __importDefault(require("chalk"));
const readline = __importStar(require("readline"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
exports.rl = rl;
const prompt = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
};
exports.prompt = prompt;
function logMessage(accountNum = null, total = null, message = "", messageType = "info") {
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    const accountStatus = accountNum && total ? `${accountNum}/${total}` : "";
    const colors = {
        info: chalk_1.default.white,
        success: chalk_1.default.green,
        error: chalk_1.default.red,
        warning: chalk_1.default.yellow,
        process: chalk_1.default.cyan,
        debug: chalk_1.default.magenta,
    };
    const logColor = colors[messageType] || chalk_1.default.white;
    console.log(`${chalk_1.default.white("[")}${chalk_1.default.dim(timestamp)}${chalk_1.default.white("]")} ` +
        `${chalk_1.default.white("[")}${chalk_1.default.yellow(accountStatus)}${chalk_1.default.white("]")} ` +
        `${logColor(message)}`);
}
