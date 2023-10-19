const TelegramBot = require('node-telegram-bot-api');

const token = "6479890221:AAFwzbFsB0v_KQAfjTbJhEJyTLLYc7DQYX4";
const groupChatId = -1001941195975;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, 'Добро пожаловать! Отправьте ваш вопрос, и мы ответим на него.');
});

const userChatIdToGroupChatId = new Map(); // Создаем Map для отслеживания чатов пользователей и соответствующих им групповых чатов

bot.on('message', (msg) => {
	const userChatId = msg.chat.id;
	const text = msg.text;

	if (msg.text !== '/start') {
		// Проверяем, если у пользователя уже есть ассоциированный групповой чат
		if (userChatIdToGroupChatId.has(userChatId)) {
			const groupChatId = userChatIdToGroupChatId.get(userChatId);
			bot.sendMessage(groupChatId, `Пользователь (${userChatId}) написал: ${text}`);
		} else {
			// Если у пользователя нет ассоциированного группового чата, отправляем в группу и ассоциируем чат
			bot.sendMessage(groupChatId, `Пользователь (${userChatId}) написал: ${text}`);
			userChatIdToGroupChatId.set(userChatId, groupChatId);
		}

		// Отправляем ответ в тот же чат, откуда пришло первое сообщение
		bot.sendMessage(userChatId, `Ваш ответ: ${text}`);
	}
});

console.log('Бот запущен. Ожидание команд...');

// const TelegramBot = require('node-telegram-bot-api');
//
// const token = "6479890221:AAFwzbFsB0v_KQAfjTbJhEJyTLLYc7DQYX4";
// const groupChatId = -1001941195975;
//
// const bot = new TelegramBot(token, { polling: true });
//
// // Создаем объект для отслеживания активных чатов пользователей
// const activeChats = {};
//
// bot.onText(/\/start/, (msg) => {
// 	const chatId = msg.chat.id;
// 	bot.sendMessage(chatId, 'Добро пожаловать! Отправьте ваш вопрос, и мы ответим на него.');
// });
//
// bot.on('message', (msg) => {
// 	const userChatId = msg.chat.id;
// 	const text = msg.text;
// 	const USER_CHAT_ID = msg.from.id;
// 	console.log(userChatId);
// 	console.log(msg.from.id);
//
// 	if (msg.text !== '/start') {
// 		if (msg.chat.id === USER_CHAT_ID) {
// 			// Сохраняем информацию о пользователе и его чате
// 			activeChats[USER_CHAT_ID] = userChatId;
// 			bot.sendMessage(groupChatId, `Пользователь (${userChatId}) написал: ${text}`);
// 		} else {
// 			// Отправляем ответ пользователю, который отправил сообщение из группы
// 			if (activeChats[USER_CHAT_ID]) {
// 				bot.sendMessage(activeChats[USER_CHAT_ID], `Ваш ответ: ${text}`);
// 				// Удаляем информацию о чате после отправки ответа
// 				delete activeChats[USER_CHAT_ID];
// 			}
// 		}
// 	}
// });
//
// console.log('Бот запущен. Ожидание команд...');