const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const token = ''; //// телеграм токен
const webAppUrl = 'https://master--bucolic-bienenstitch-18b937.netlify.app/';

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === '/start') {
    await bot.sendMessage(chatId, 'выберите время', {
      reply_markup: {
        keyboard: [[{ text: 'выбрать время', web_app: { url: webAppUrl } }]],
      },
    });

    //для кнопки в сообщениях бота - закомментил, т.к для ее обработки нужен сервер
    // await bot.sendMessage(
    //   chatId,
    //   'Приступим! Для открытия timepicker нажмите кнопку ниже.',
    //   {
    //     reply_markup: {
    //       inline_keyboard: [
    //         [{ text: 'Открыть!', web_app: { url: webAppUrl } }],
    //       ],
    //     },
    //   }
    // );
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(
        chatId,
        'выбранное время: ' + data?.hours + ' : ' + data?.minutes
      );
    } catch (e) {
      console.log(e);
    }
  }
});
// серверная обработка данных с мейнКнопки (нужен сервер, ngrok не подходит)

// app.post('/content', async (req, res) => {
//   const { hours, minutes, id } = req.body;
//   console.log(hours, minutes, id);
//   try {
//     await bot.answerWebAppQuery(id, {
//       type: 'article',
//       id,
//       title: 'Выбранное время:',
//       input_message_content: {
//         message_text: `${hours}  :  ${minutes}`,
//       },
//     });
//     return res.status(200).json({});
//   } catch (error) {
//     await bot.answerWebAppQuery(id, {
//       type: 'article',
//       id,
//       title: 'Что-то пошло не так',
//       input_message_content: {
//         message_text: `повторите попытку позднее`,
//       },
//     });
//     return res.status(500).json({});
//   }
// });
const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT));
