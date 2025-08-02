// bot.js

const { Telegraf } = require("telegraf");

// Replace this with your actual token from @BotFather
const BOT_TOKEN = "8320024501:AAEloBk_qxzzCE_vkC50mU7UlX2yfSsM5tY";

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply("👋 Hello! Your bot is working!"));
bot.help((ctx) => ctx.reply("Type any message and I’ll echo it back."));
bot.on("text", (ctx) => ctx.reply(`You said: ${ctx.message.text}`));

// Launch the bot
bot.launch();

console.log("🤖 Bot is running...");
