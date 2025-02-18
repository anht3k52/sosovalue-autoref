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
exports.authorize = authorize;
const fs_1 = __importDefault(require("fs"));
const imapflow_1 = require("imapflow");
const path_1 = __importDefault(require("path"));
const configPath = path_1.default.resolve(__dirname, "../../config.json");
const config = JSON.parse(fs_1.default.readFileSync(configPath, "utf8"));
const confEmail = config.email;
const pass = config.password;
function authorize() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new imapflow_1.ImapFlow({
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            auth: {
                user: confEmail,
                pass: pass,
            },
            logger: false,
        });
        try {
            yield client.connect();
            return client;
        }
        catch (err) {
            console.error("Error connecting to IMAP server", err);
            throw err;
        }
    });
}
