const TelegramService = require("../services/telegramService");
const GeminiService = require("../services/geminiService");
const ConversationModel = require("../models/conversationModel");
const rateLimiter = require("../middleware/rateLimiter");

class BotController {
  // Entry point — called from webhookRoute
  static async handleUpdate(req, res) {
    // ACK Telegram immediately (must be fast)
    res.sendStatus(200);

    const update = req.body;
    if (!update.message?.text) return;

    const { chat, from, text } = update.message;
    const chatId = chat.id;
    const userId = from.id;
    const input = text.trim();

    try {
      if (input.startsWith("/")) {
        await BotController._handleCommand(chatId, from, input);
      } else {
        await BotController._handleMessage(chatId, userId, input);
      }
    } catch (err) {
      console.error("❌ BotController error:", err.message);
      await TelegramService.sendMessage(
        chatId,
        "⚠️ Something went wrong. Please try again in a moment."
      );
    }
  }

  // --- Private: command router ---
  static async _handleCommand(chatId, user, text) {
    const command = text.split(" ")[0].toLowerCase();
    const name = user.first_name || "there";

    switch (command) {
      case "/start":
        return TelegramService.sendMessage(
          chatId,
          `👋 *Hello, ${name}!*\n\nI'm *Gemini Bot* — your AI assistant powered by Google Gemini.\n\n*Commands:*\n/start — Welcome message\n/help — Show commands\n/clear — Reset conversation\n/about — Project info\n\nSend me any message to get started!`
        );

      case "/help":
        return TelegramService.sendMessage(
          chatId,
          `📖 *Help Menu*\n\n/start — Welcome message\n/help — This menu\n/clear — Clear your chat history\n/about — About this bot\n\n*Tips:*\n• I remember context within our session\n• Ask follow-up questions freely\n• Rate limit: ${process.env.RATE_LIMIT || 10} messages/min`
        );

      case "/clear":
        ConversationModel.clear(chatId);
        return TelegramService.sendMessage(
          chatId,
          "🗑️ *Conversation cleared!* Let's start fresh."
        );

      case "/about":
        return TelegramService.sendMessage(
          chatId,
          `🤖 *About Gemini Bot*\n\n*Stack:*\n• Node.js + Express.js\n• Google Gemini 1.5 Flash\n• Telegram Bot API\n\n*Architecture:* MVC + Service Layer\n*Built by:* Nikk | MCA Final Year`
        );

      default:
        return TelegramService.sendMessage(
          chatId,
          "❓ Unknown command. Type /help for available commands."
        );
    }
  }

  // --- Private: AI message handler ---
  static async _handleMessage(chatId, userId, text) {
    const allowed = rateLimiter(userId, chatId);
    if (!allowed) return;

    await TelegramService.sendTyping(chatId);
    const reply = await GeminiService.generateReply(userId, text);
    await TelegramService.sendMessage(chatId, reply);
  }
}

module.exports = BotController;
