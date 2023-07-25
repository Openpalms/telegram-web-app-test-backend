const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const token = '6014535737:AAGvhmuhBWrWQ9Z4ttPfOrKPxg7zvFEOsbE';
const webAppUrl = 'https://master--bucolic-bienenstitch-18b937.netlify.app/';

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(
      chatId,
      'Приступим! Для открытия timepicker нажмите кнопку ниже.',
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Открыть!', web_app: { url: webAppUrl } }],
          ],
        },
      }
    );
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, 'Спасибо за обратную связь!');
      await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
      await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

      setTimeout(async () => {
        await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post('/content', async (req, res) => {
  const { hours, minutes, id } = req.body;
  console.log(hours, minutes, id);
  try {
    await bot.answerWebAppQuery(id, {
      type: 'article',
      id,
      title: 'Выбранное время:',
      input_message_content: {
        message_text: `${hours}:${minutes}`,
      },
    });
    return res.status(200).json({});
  } catch (error) {
    await bot.answerWebAppQuery(id, {
      type: 'article',
      id,
      title: 'Что-то пошло не так',
      input_message_content: {
        message_text: `повторите попытку позднее`,
      },
    });
    return res.status(500).json({});
  }
});
const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT));
