# 🤖 AI Telegram Bot — MVC Architecture

AI-powered Telegram chatbot using Google Gemini 1.5 Flash, built with a clean **MVC + Service Layer** pattern in Node.js/Express.

## 🗂️ Folder Structure

```
telegram-bot-mvc/
├── src/
│   ├── index.js                        # Entry point — Express app + webhook init
│   ├── config/
│   │   └── env.js                      # Loads & exports all env variables
│   ├── models/
│   │   └── conversationModel.js        # In-memory chat history per user
│   ├── services/
│   │   ├── geminiService.js            # Google Gemini API integration
│   │   └── telegramService.js          # Telegram API (sendMessage, setWebhook)
│   ├── controllers/
│   │   └── botController.js            # Handles updates, routes commands vs messages
│   ├── routes/
│   │   └── webhookRoute.js             # POST /webhook → BotController
│   └── middleware/
│       └── rateLimiter.js              # Per-user rate limiting
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ MVC Roles

| Layer | File | Responsibility |
|-------|------|----------------|
| **Route** | `webhookRoute.js` | Maps POST /webhook to controller |
| **Controller** | `botController.js` | Receives update, decides what to do |
| **Service** | `geminiService.js` | Calls Gemini AI, returns reply |
| **Service** | `telegramService.js` | Sends messages via Telegram API |
| **Model** | `conversationModel.js` | Stores & retrieves chat history |
| **Middleware** | `rateLimiter.js` | Blocks excessive requests |
| **Config** | `env.js` | Single source of truth for env vars |

## 🚀 Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# → Fill TELEGRAM_BOT_TOKEN, GEMINI_API_KEY, BASE_URL

# 3. Run
npm run dev     # development
npm start       # production
```

## 🔑 Getting API Keys

- **Telegram token** → [@BotFather](https://t.me/BotFather) → `/newbot`
- **Gemini key** → [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
- **Public URL** → Deploy on [Render](https://render.com) or use `ngrok http 3000` locally

## ➕ Adding a New Command

**1. Add handler in `botController.js`:**
```js
case "/mycommand":
  return TelegramService.sendMessage(chatId, "My response here!");
```

That's it — no other files need to change.
