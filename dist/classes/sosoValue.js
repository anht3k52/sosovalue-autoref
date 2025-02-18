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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sosoValuRefferal = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const mailparser_1 = require("mailparser");
const path_1 = __importDefault(require("path"));
const captchaServices_1 = require("../utils/captchaServices");
const generate_1 = require("../utils/generate");
const logger_1 = require("../utils/logger");
const authGmail_1 = require("./authGmail");
const proxy_1 = require("./proxy");
const configPath = path_1.default.resolve(__dirname, "../../config.json");
const config = JSON.parse(fs_1.default.readFileSync(configPath, "utf8"));
const confEmail = config.email;
class sosoValuRefferal {
    constructor(refCode, proxy = null, captchaMethod = "1") {
        this.refCode = refCode;
        this.proxy = proxy;
        this.captchaMethod = captchaMethod;
        this.axiosConfig = Object.assign(Object.assign({}, (this.proxy && { httpsAgent: (0, proxy_1.getProxyAgent)(this.proxy) })), { timeout: 60000 });
        this.baseEmail = confEmail;
        this.siteKey = "0x4AAAAAAA4PZrjDa5PcluqN";
    }
    makeRequest(method_1, url_1) {
        return __awaiter(this, arguments, void 0, function* (method, url, config = {}, retries = 3) {
            for (let i = 0; i < retries; i++) {
                try {
                    const response = yield (0, axios_1.default)(Object.assign(Object.assign({ method,
                        url }, this.axiosConfig), config));
                    return response;
                }
                catch (error) {
                    if (i === retries - 1) {
                        (0, logger_1.logMessage)(null, null, `Request failed: ${error.message}`, "error");
                        if (this.proxy) {
                            (0, logger_1.logMessage)(null, null, `Failed proxy: ${this.proxy}`, "error");
                        }
                        return null;
                    }
                    (0, logger_1.logMessage)(null, null, `Retrying... (${i + 1}/${retries})`, "warning");
                    yield new Promise((resolve) => setTimeout(resolve, 2000));
                }
            }
            return null;
        });
    }
    generateTempEmail() {
        const emailGenerator = new generate_1.EmailGenerator(this.baseEmail);
        const tempEmail = emailGenerator.generateRandomVariation();
        (0, logger_1.logMessage)(null, null, `Email using : ${tempEmail}`, "success");
        return tempEmail;
    }
    cekEmailValidation(email) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, logger_1.logMessage)(null, null, "Checking Email ...", "process");
            const response = yield this.makeRequest("POST", `https://gw.sosovalue.com/usercenter/user/anno/checkEmailIsRegister/V2?email=${email}`);
            if (response && response.data.data === true) {
                (0, logger_1.logMessage)(null, null, "Email Available", "success");
                return true;
            }
            else {
                return false;
            }
        });
    }
    sendEmailCode(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, logger_1.logMessage)(null, null, "try solve captcha ...", "process");
            let captchaResponse = null;
            if (this.captchaMethod === "1") {
                captchaResponse = yield (0, captchaServices_1.solveTurnstileCaptcha)(this.siteKey, "https://sosovalue.com/");
            }
            else if (this.captchaMethod === "2") {
                captchaResponse = yield (0, captchaServices_1.solveTurnstileCaptchaPuppeter)();
            }
            else {
                (0, logger_1.logMessage)(null, null, "Invalid CAPTCHA method selected.", "error");
                return false;
            }
            if (!captchaResponse) {
                (0, logger_1.logMessage)(null, null, "Failed to solve captcha", "error");
                return false;
            }
            (0, logger_1.logMessage)(null, null, "captcha solved, sending verification code...", "success");
            const dataSend = {
                password: password,
                rePassword: password,
                username: "NEW_USER_NAME_02",
                email: email,
            };
            const response = yield this.makeRequest("POST", `https://gw.sosovalue.com/usercenter/email/anno/sendRegisterVerifyCode/V2?cf-turnstile-response=${captchaResponse}`, { data: dataSend });
            if (response && response.data) {
                (0, logger_1.logMessage)(null, null, "Email Verification Send", "success");
                return true;
            }
            else {
                return false;
            }
        });
    }
    getCodeVerification(email) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            (0, logger_1.logMessage)(null, null, "Waiting for code verification...", "process");
            const client = yield (0, authGmail_1.authorize)();
            const maxAttempts = 5;
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                (0, logger_1.logMessage)(null, null, `Attempt ${attempt + 1}`, "process");
                (0, logger_1.logMessage)(null, null, "Waiting for 10sec...", "warning");
                yield new Promise((resolve) => setTimeout(resolve, 10000));
                try {
                    const lock = yield client.getMailboxLock("INBOX");
                    try {
                        const messages = yield client.fetch("1:*", {
                            envelope: true,
                            source: true,
                        });
                        try {
                            for (var _d = true, messages_1 = (e_1 = void 0, __asyncValues(messages)), messages_1_1; messages_1_1 = yield messages_1.next(), _a = messages_1_1.done, !_a; _d = true) {
                                _c = messages_1_1.value;
                                _d = false;
                                const message = _c;
                                if (message.envelope.to && message.envelope.to.some((to) => to.address === email)) {
                                    const emailSource = message.source.toString();
                                    const parsedEmail = yield (0, mailparser_1.simpleParser)(emailSource);
                                    const verificationCode = this.extractVerificationCode(parsedEmail.text);
                                    if (verificationCode) {
                                        (0, logger_1.logMessage)(null, null, `Verification code found: ${verificationCode}`, "success");
                                        return verificationCode;
                                    }
                                    else {
                                        (0, logger_1.logMessage)(null, null, "No verification code found in the email body.", "warning");
                                    }
                                }
                            }
                        }
                        catch (e_1_1) { e_1 = { error: e_1_1 }; }
                        finally {
                            try {
                                if (!_d && !_a && (_b = messages_1.return)) yield _b.call(messages_1);
                            }
                            finally { if (e_1) throw e_1.error; }
                        }
                    }
                    finally {
                        lock.release();
                    }
                }
                catch (error) {
                    console.error("Error fetching emails:", error);
                }
                (0, logger_1.logMessage)(null, null, "Verification code not found. Waiting for 5 sec...", "warning");
                yield new Promise((resolve) => setTimeout(resolve, 5000));
            }
            (0, logger_1.logMessage)(null, null, "Error get code verification.", "error");
            return null;
        });
    }
    extractVerificationCode(content) {
        if (!content)
            return null;
        const textCodeMatch = content.match(/\[SoSoValue\] Your verification code is:\s*\n\s*(\d{6})\s*\n/);
        if (textCodeMatch) {
            return textCodeMatch[1];
        }
        return null;
    }
    getReferralCode(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const response = yield this.makeRequest("GET", "https://gw.sosovalue.com/authentication/user/getUserInfo", {
                headers: headers,
            });
            if (response && response.data.code == 0) {
                return response.data.data.invitationCode;
            }
            else {
                (0, logger_1.logMessage)(null, null, "Failed Get User Info", "error");
                return null;
            }
        });
    }
    registerAccount(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, logger_1.logMessage)(null, null, "Register account...", "process");
            const cekEmail = yield this.cekEmailValidation(email);
            if (!cekEmail) {
                (0, logger_1.logMessage)(null, null, "Email already registered", "error");
                return null;
            }
            const sendEmailCode = yield this.sendEmailCode(email, password);
            if (!sendEmailCode) {
                (0, logger_1.logMessage)(null, null, "Failed send email", "error");
                return null;
            }
            const verifyCode = yield this.getCodeVerification(email);
            if (!verifyCode) {
                (0, logger_1.logMessage)(null, null, "Failed to get verification code ", "error");
                return null;
            }
            const registerData = {
                email: email,
                invitationCode: this.refCode,
                invitationFrom: null,
                password: password,
                rePassword: password,
                username: "NEW_USER_NAME_02",
                verifyCode: verifyCode,
            };
            const response = yield this.makeRequest("POST", "https://gw.sosovalue.com/usercenter/user/anno/v3/register", {
                data: registerData,
            });
            if (response && response.data.code == 0) {
                (0, logger_1.logMessage)(null, null, "Register Succesfully", "success");
                const invitationCode = yield this.getReferralCode(response.data.data.token);
                return Object.assign(Object.assign({}, response.data), { invitationCode });
            }
            else {
                (0, logger_1.logMessage)(null, null, "Failed Register", "error");
                return null;
            }
        });
    }
}
exports.sosoValuRefferal = sosoValuRefferal;
