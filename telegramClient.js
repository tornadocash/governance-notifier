const Telegram = require('telegraf/telegram');

class TelegramClient {
  constructor() {
    this.telegram = new Telegram(process.env.TELEGRAM_BOT_TOKEN);
  }

  send(message) {
    return this.telegram.sendMessage(
      process.env.TELEGRAM_CHAT_ID,
      message,
      { parse_mode: 'MARKDOWN' }
    );
  }

  sendError(e) {
    return this.telegram.sendMessage(
        process.env.TELEGRAM_CHAT_ID,
        `Error: ${e}`,
    );
  }

  check() {
    return this.telegram.getMe();
  }
}

module.exports = TelegramClient;
