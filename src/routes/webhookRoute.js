const express = require("express");
const router = express.Router();
const BotController = require("../controllers/botController");

// POST /webhook  — Telegram sends all updates here
router.post("/", BotController.handleUpdate);

module.exports = router;
