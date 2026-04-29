const axios = require("axios");
const { TELEGRAM_BOT_TOKEN, BASE_URL } = require("../config/env");

const API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

class TelegramService {
  static async setWebhook() {
    const webhookUrl = `${BASE_URL}/webhook`;
    const { data } = await axios.post(`${API}/setWebhook`, {
      url: webhookUrl,
      allowed_updates: ["message", "callback_query"],
    });
    if (data.ok) {
      console.log(`✅ Webhook registered: ${webhookUrl}`);
    } else {
      console.error("❌ Webhook failed:", data.description);
    }
  }

  static async sendMessage(chatId, text, options = {}) {
    const chunks = TelegramService._chunk(text, 4000);
    for (const chunk of chunks) {
      await axios.post(`${API}/sendMessage`, {
        chat_id: chatId,
        text: chunk,
        parse_mode: "Markdown",
        ...options,
      });
    }
  }

  static async sendTyping(chatId) {
    await axios.post(`${API}/sendChatAction`, {
      chat_id: chatId,
      action: "typing",
    });
  }

  // Split long messages at newline boundaries
  static _chunk(text, maxLen) {
    if (text.length <= maxLen) return [text];
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      let end = start + maxLen;
      if (end < text.length) {
        const breakPoint = text.lastIndexOf("\n", end);
        if (breakPoint > start) end = breakPoint;
      }
      chunks.push(text.slice(start, end));
      start = end;
    }
    return chunks;
  }
}

module.exports = TelegramService;
