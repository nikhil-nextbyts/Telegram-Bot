import { Telegraf } from "telegraf";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenve from "dotenv";

// Load environment variables
dotenve.config();

// Ensure you have your bot token and Gemini API key set in your environment variables    


// Replace these
const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.gemini_API;

// Setup Telegram bot
const bot = new Telegraf(BOT_TOKEN);

// Setup Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// When someone sends a message
bot.on("text", async (ctx) => {
  const flowerName = ctx.message.text;
  ctx.reply(`🌸 Looking up details for "${flowerName}"...`);
  

  try {
    const prompt = `Tell me sweet and beautiful details about the flower named "${flowerName}".`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Send back Gemini's response
    ctx.reply(text.slice(0, 4096)); // Telegram limit
  } catch (err) {
    ctx.reply("❌ Failed to fetch from Gemini: " + err.message);
    console.log(err);
  }
});

bot.launch();
console.log("🤖 Bot is running...");
