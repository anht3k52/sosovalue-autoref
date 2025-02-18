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
exports.solveTurnstileCaptcha = solveTurnstileCaptcha;
exports.solveTurnstileCaptchaPuppeter = solveTurnstileCaptchaPuppeter;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const puppeteer_real_browser_1 = require("puppeteer-real-browser");
const configPath = path_1.default.resolve(__dirname, "../../config.json");
const config = JSON.parse(fs_1.default.readFileSync(configPath, "utf8"));
const conf2Captcha = config.captcha2;
/**
 *
 * @param siteKey
 * @param pageUrl
 */
function solveTurnstileCaptcha(siteKey, pageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const captchaRequest = yield axios_1.default.post("http://2captcha.com/in.php", null, {
                params: {
                    key: conf2Captcha,
                    method: "turnstile",
                    sitekey: siteKey,
                    pageurl: pageUrl,
                    json: 1,
                },
            });
            const captchaId = captchaRequest.data.request;
            while (true) {
                yield new Promise((resolve) => setTimeout(resolve, 5000));
                const captchaResult = yield axios_1.default.get("http://2captcha.com/res.php", {
                    params: {
                        key: conf2Captcha,
                        action: "get",
                        id: captchaId,
                        json: 1,
                    },
                });
                if (captchaResult.data.status === 1) {
                    return captchaResult.data.request;
                }
                else if (captchaResult.data.request !== "CAPCHA_NOT_READY") {
                    return null;
                }
            }
        }
        catch (error) {
            console.error("Error solving CAPTCHA:", error);
            return null;
        }
    });
}
function solveTurnstileCaptchaPuppeter() {
    return __awaiter(this, void 0, void 0, function* () {
        let browser;
        try {
            const { browser: connectedBrowser, page } = yield (0, puppeteer_real_browser_1.connect)({
                headless: false,
                args: [],
                customConfig: {},
                turnstile: true,
                connectOption: {},
                disableXvfb: false,
                ignoreAllFlags: false,
            });
            browser = connectedBrowser;
            yield page.goto("https://sosovalue.com/");
            const modalSelector = "#root > div.MuiDialog-root.MuiModal-root.mui-style-126xj0f > div.MuiDialog-container.MuiDialog-scrollPaper.mui-style-ekeie0 > div";
            yield page.waitForSelector(modalSelector, { visible: true });
            const signUpButtonSelector = "#exp_top > div.flex.items-center > button.MuiButtonBase-root.MuiIconButton-root.MuiIconButton-sizeMedium.bg-background-brand-accent-600-600.border-0.rounded.text-background-white-white.text-sm.font-semibold.cursor-pointer.py-1.px-3.ml-2.whitespace-nowrap.mui-style-1yxmbwk";
            yield page.waitForSelector(signUpButtonSelector, { visible: true });
            yield page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.click();
                }
                else {
                    console.error(`Element with selector ${selector} not found.`);
                }
            }, signUpButtonSelector);
            yield page.evaluate(() => {
                return new Promise((resolve) => setTimeout(resolve, 10000));
            });
            const turnstileSelector = "#root > div:nth-child(3) > div.MuiDialog-container.MuiDialog-scrollPaper.mui-style-ekeie0 > div > div > div:nth-child(3) > div.mt-6 > div.flex.flex-col.space-y-5 > div:nth-child(2) > div";
            yield page.waitForSelector(turnstileSelector, { visible: true });
            const cfTurnstileResponseValue = yield page.evaluate(() => {
                const inputElement = document.querySelector('input[name="cf-turnstile-response"]');
                return inputElement ? inputElement.value : null;
            });
            if (cfTurnstileResponseValue) {
                return cfTurnstileResponseValue;
            }
            else {
                console.log("Gagal mendapatkan token");
                return null;
            }
        }
        catch (error) {
            console.error("Error solving CAPTCHA:");
            return null;
        }
        finally {
            if (browser) {
                yield browser.close();
            }
        }
    });
}
