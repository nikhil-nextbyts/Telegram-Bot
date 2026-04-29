require("dotenv").config();

module.exports = {
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  BASE_URL: process.env.BASE_URL,
  PORT: process.env.PORT || 3000,
  RATE_LIMIT: parseInt(process.env.RATE_LIMIT || "10"),
  RATE_WINDOW_MS: parseInt(process.env.RATE_WINDOW_MS || "60000"),
};
