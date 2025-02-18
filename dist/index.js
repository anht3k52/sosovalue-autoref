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
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const proxy_1 = require("./classes/proxy");
const sosoValue_1 = require("./classes/sosoValue");
const generate_1 = require("./utils/generate");
const logger_1 = require("./utils/logger");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(chalk_1.default.cyan(`
░█▀▀░█▀█░█▀▀░█▀█░░░█░█░█▀█░█░░░█░█░█▀▀
░▀▀█░█░█░▀▀█░█░█░░░▀▄▀░█▀█░█░░░█░█░█▀▀
░▀▀▀░▀▀▀░▀▀▀░▀▀▀░░░░▀░░▀░▀░▀▀▀░▀▀▀░▀▀▀
        By : El Puqus Airdrop
        github.com/ahlulmukh
      Use it at your own risk
  `));
        const refCode = yield (0, logger_1.prompt)(chalk_1.default.yellow("Enter Referral Code: "));
        const count = parseInt(yield (0, logger_1.prompt)(chalk_1.default.yellow("How many do you want? ")));
        const captchaMethod = yield (0, logger_1.prompt)(chalk_1.default.yellow(`Choose Captcha Metode \n1.2Captcha\n2.Puppeteer (Free) :`));
        const proxiesLoaded = (0, proxy_1.loadProxies)();
        if (!proxiesLoaded) {
            console.log(chalk_1.default.yellow("No proxy available. Using default IP."));
        }
        let successful = 0;
        const sosoValueaccount = fs_1.default.createWriteStream("accounts.txt", { flags: "a" });
        for (let i = 0; i < count; i++) {
            console.log(chalk_1.default.white("-".repeat(85)));
            (0, logger_1.logMessage)(i + 1, count, "Process", "debug");
            const currentProxy = yield (0, proxy_1.getRandomProxy)();
            const sosoValue = new sosoValue_1.sosoValuRefferal(refCode, currentProxy, captchaMethod);
            try {
                const email = sosoValue.generateTempEmail();
                const password = (0, generate_1.generatePassword)();
                const registered = yield sosoValue.registerAccount(email, password.encodedPassword);
                if (registered) {
                    successful++;
                    sosoValueaccount.write(`Email Address : ${email}\n`);
                    sosoValueaccount.write(`Password : ${password.password}\n`);
                    sosoValueaccount.write(`Invitation Code : ${registered.invitationCode}\n`);
                    sosoValueaccount.write(`===================================================================\n`);
                }
            }
            catch (err) {
                (0, logger_1.logMessage)(i + 1, count, `Error: `, "error");
            }
        }
        sosoValueaccount.end();
        console.log(chalk_1.default.magenta("\n[*] Dono bang!"));
        console.log(chalk_1.default.green(`[*] Account dono ${successful} dari ${count} akun`));
        console.log(chalk_1.default.magenta("[*] Result in accounts.txt"));
        logger_1.rl.close();
    });
}
main().catch((err) => {
    console.error(chalk_1.default.red("Error occurred:"), err);
    process.exit(1);
});
