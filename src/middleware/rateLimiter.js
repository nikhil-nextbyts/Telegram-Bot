const { RATE_LIMIT, RATE_WINDOW_MS } = require("../config/env");
const TelegramService = require("../services/telegramService");

const requestMap = new Map();

function rateLimiter(userId, chatId) {
  const now = Date.now();
  const id = String(userId);
  const entry = requestMap.get(id);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    requestMap.set(id, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    const resetIn = Math.ceil((RATE_WINDOW_MS - (now - entry.windowStart)) / 1000);
    TelegramService.sendMessage(
      chatId,
      `⏳ *Rate limit reached!* Please wait *${resetIn}s* before sending another message.`
    );
    return false;
  }

  entry.count++;
  return true;
}

// Clean up stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of requestMap.entries()) {
    if (now - val.windowStart > RATE_WINDOW_MS * 2) requestMap.delete(key);
  }
}, 5 * 60 * 1000);

module.exports = rateLimiter;
