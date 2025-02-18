import chalk from "chalk";
import fs from "fs";
import { getRandomProxy, loadProxies } from "./classes/proxy";
import { sosoValuRefferal } from "./classes/sosoValue";
import { generatePassword } from "./utils/generate";
import { logMessage, prompt, rl } from "./utils/logger";

async function main(): Promise<void> {
  console.log(
    chalk.cyan(`
        ███████╗ █████╗ ███╗   ███╗ ██████╗
        ██╔════╝██╔══██╗████╗ ████║██╔════╝
        ███████╗███████║██╔████╔██║██║
        ╚════██║██╔══██║██║╚██╔╝██║██║
        ███████║██║  ██║██║ ╚═╝ ██║╚██████╗
        ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝
        
        ██╗   ██╗███╗   ██╗
        ██║   ██║████╗  ██║
        ██║   ██║██╔██╗ ██║
        ██║   ██║██║╚██╗██║
        ╚██████╔╝██║ ═████║
         ╚═════╝ ╚═╝  ╚═══╝
        By : SAMCVN
        github.com/anht3k52
        t.me/samcvn
      Use it at your own risk
  `)
  );

  const refCode = await prompt(chalk.yellow("Enter Referral Code: "));
  const count = parseInt(await prompt(chalk.yellow("How many do you want? ")));
  const captchaMethod = await prompt(
    chalk.yellow(`Choose Captcha Metode \n1.2Captcha\n2.Puppeteer (Free) :`)
  );
  const proxiesLoaded = loadProxies();
  if (!proxiesLoaded) {
    console.log(chalk.yellow("No proxy available. Using default IP."));
  }
  let successful = 0;

  const sosoValueaccount = fs.createWriteStream("accounts.txt", { flags: "a" });

  for (let i = 0; i < count; i++) {
    console.log(chalk.white("-".repeat(85)));
    logMessage(i + 1, count, "Process", "debug");
    const currentProxy = await getRandomProxy();
    const sosoValue = new sosoValuRefferal(refCode, currentProxy, captchaMethod);


    try{
      const email = sosoValue.generateTempEmail();
      const password = generatePassword() 
      const registered = await sosoValue.registerAccount(email, password.encodedPassword);
      if(registered){
        successful++;
        sosoValueaccount.write(`Email Address : ${email}\n`);
        sosoValueaccount.write(`Password : ${password.password}\n`);
        sosoValueaccount.write(`Invitation Code : ${registered.invitationCode}\n`);
        sosoValueaccount.write(`===================================================================\n`);
      }
    } catch(err){
      logMessage(i + 1, count, `Error: `, "error");
    }
  }

  sosoValueaccount.end();

  console.log(chalk.magenta("\n[*] Dono bang!"));
  console.log(chalk.green(`[*] Account dono ${successful} dari ${count} akun`));
  console.log(chalk.magenta("[*] Result in accounts.txt"));
  rl.close(); 
}

main().catch((err) => {
  console.error(chalk.red("Error occurred:"), err);
  process.exit(1);
});