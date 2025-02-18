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
exports.getProxyAgent = getProxyAgent;
exports.loadProxies = loadProxies;
exports.checkIP = checkIP;
exports.getRandomProxy = getRandomProxy;
const axios_1 = __importDefault(require("axios"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const https_proxy_agent_1 = require("https-proxy-agent");
const socks_proxy_agent_1 = require("socks-proxy-agent");
let proxyList = [];
let axiosConfig = {};
function getProxyAgent(proxyUrl) {
    try {
        const isSocks = proxyUrl.toLowerCase().startsWith("socks");
        if (isSocks) {
            return new socks_proxy_agent_1.SocksProxyAgent(proxyUrl);
        }
        return new https_proxy_agent_1.HttpsProxyAgent(proxyUrl.startsWith("http") ? proxyUrl : `http://${proxyUrl}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(chalk_1.default.red(`[!] Error creating proxy agent: ${error.message}`));
        }
        else {
            console.log(chalk_1.default.red(`[!] Error creating proxy agent`));
        }
        return null;
    }
}
function loadProxies() {
    try {
        const proxyFile = fs_1.default.readFileSync("proxy.txt", "utf8");
        proxyList = proxyFile
            .split("\n")
            .filter((line) => line.trim())
            .map((proxy) => {
            proxy = proxy.trim();
            if (!proxy.includes("://")) {
                return `http://${proxy}`;
            }
            return proxy;
        });
        if (proxyList.length === 0) {
            throw new Error("No proxies found in proxies.txt");
        }
        console.log(chalk_1.default.green(`✓ Loaded ${proxyList.length} proxies from proxies.txt`));
        return true;
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(chalk_1.default.red(`[!] Error loading proxies: ${error.message}`));
        }
        else {
            console.error(chalk_1.default.red(`[!] Error loading proxies`));
        }
        return false;
    }
}
function checkIP() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get("https://api.ipify.org?format=json", axiosConfig);
            const ip = response.data.ip;
            console.log(chalk_1.default.green(`[+] Ip Using: ${ip}`));
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log(chalk_1.default.red(`[!] Failed to get IP: ${error.message}`));
            }
            else {
                console.log(chalk_1.default.red(`[!] Failed to get IP`));
            }
            return false;
        }
    });
}
function getRandomProxy() {
    return __awaiter(this, void 0, void 0, function* () {
        if (proxyList.length === 0) {
            axiosConfig = {};
            yield checkIP();
            return null;
        }
        let proxyAttempt = 0;
        while (proxyAttempt < proxyList.length) {
            const proxy = proxyList[Math.floor(Math.random() * proxyList.length)];
            try {
                const agent = getProxyAgent(proxy);
                if (!agent)
                    continue;
                axiosConfig.httpsAgent = agent;
                yield checkIP();
                return proxy;
            }
            catch (error) {
                proxyAttempt++;
            }
        }
        console.log(chalk_1.default.red("[!] Using default IP"));
        axiosConfig = {};
        yield checkIP();
        return null;
    });
}
