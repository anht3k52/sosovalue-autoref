"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailGenerator = void 0;
exports.generatePassword = generatePassword;
class EmailGenerator {
    constructor(baseEmail) {
        this.baseEmail = baseEmail;
    }
    generatePlusVariations() {
        const [username, domain] = this.baseEmail.split("@");
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${username}+${randomString}@${domain}`;
    }
    generateRandomVariation() {
        return this.generatePlusVariations();
    }
}
exports.EmailGenerator = EmailGenerator;
function generatePassword() {
    const firstLetter = String.fromCharCode(Math.floor(Math.random() * 26) + 65);
    const otherLetters = Array.from({ length: 4 }, () => String.fromCharCode(Math.floor(Math.random() * 26) + 97)).join("");
    const numbers = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join("");
    const password = `${firstLetter}${otherLetters}@${numbers}!`;
    const encodedPassword = Buffer.from(password).toString('base64');
    return { password, encodedPassword };
}
