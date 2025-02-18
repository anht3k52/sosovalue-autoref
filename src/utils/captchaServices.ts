import axios from "axios";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connect } from 'puppeteer-real-browser';

const configPath = path.resolve(__dirname, "../../config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const geminiApiKey = config.gemini.apiKey;
const genAI = new GoogleGenerativeAI(geminiApiKey);

/**
 * Gửi hình ảnh CAPTCHA đến Gemini AI để giải mã
 * @param {string} imageBase64 - Dữ liệu ảnh CAPTCHA dạng Base64
 * @returns {Promise<string | null>}
 */
async function solveCaptchaWithGemini(imageBase64) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([
      {
        type: "image",
        data: imageBase64
      }
    ]);

    const solution = result.response.text();
    return solution || null;
  } catch (error) {
    console.error("Error solving CAPTCHA with Gemini:", error);
    return null;
  }
}

/**
 * Dùng Puppeteer để lấy ảnh CAPTCHA, gửi đến Gemini và lấy token
 * @returns {Promise<string | null>}
 */
export async function solveTurnstileCaptchaPuppeteer() {
  let browser;
  try {
    const { browser: connectedBrowser, page } = await connect({
      headless: false,
      args: [],
      customConfig: {},
      turnstile: true,
      connectOption: {},
      disableXvfb: false,
      ignoreAllFlags: false,
    });

    browser = connectedBrowser;
    await page.goto("https://sosovalue.com/");
    await page.waitForTimeout(5000);

    // Chụp ảnh CAPTCHA
    const captchaElement = await page.$("#captcha-container");
    if (!captchaElement) {
      console.error("Không tìm thấy CAPTCHA");
      return null;
    }
    const captchaBuffer = await captchaElement.screenshot();
    const captchaBase64 = captchaBuffer.toString("base64");

    // Giải mã CAPTCHA bằng Gemini
    const captchaSolution = await solveCaptchaWithGemini(captchaBase64);
    if (!captchaSolution) {
      console.error("Không thể giải mã CAPTCHA");
      return null;
    }

    // Điền CAPTCHA vào form
    await page.type('input[name="cf-turnstile-response"]', captchaSolution);
    await page.waitForTimeout(2000);

    return captchaSolution;
  } catch (error) {
    console.error("Error solving CAPTCHA:", error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
