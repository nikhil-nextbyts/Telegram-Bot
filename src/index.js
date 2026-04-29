require("dotenv").config();
const express = require("express");
const { PORT } = require("./config/env");
const TelegramService = require("./services/telegramService");
const webhookRoute = require("./routes/webhookRoute");

const app = express();

app.use(express.json());

// Routes
app.use("/webhook", webhookRoute);
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() }),
);

// Start server & register webhook
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await TelegramService.setWebhook();
});
