const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '7551797623:AAF3HUP2hLVU0JVTEWz9Z-D1wzRvW0seUwo';

const options = {polling: true};

const bot = new TelegramApi(token, options);

const commands = [
    {command: '/start', description: 'Начальное привествие'},
    {command: '/info', description: 'Получить информацию о пользователе'},
    {command: '/game', description: 'Игра угадай игру'}
];

const chats = {} // Объект как ключи содержать в себе ID чата, а как значение- загаданое ботом число





const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, ты должен её угадать!`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber; //в соотвествующий объект по ключчу chatId мы добавляем сгенерированное число
    await bot.sendMessage(chatId, 'Отгадывай!', gameOptions);
}

const start = () => {
    bot.setMyCommands(commands);
    
    bot.on( 'message', async msg =>  {
        const text = msg.text;
        const chatId = msg.chat.id;
        if(text === '/start' ){
           await bot.sendSticker(chatId, 'https://sl.combot.org/computer_scientist/webp/0xf09f9880.webp');
           return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот Gevorg`);
        }
        if(text === '/info'){
           return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if(text == '/game'){
           return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!');
    })
    
    bot.on('callback_query', msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const guessedNumber = chats[chatId]; // Получаем загаданное число
        if(data === '/again'){
            return startGame(chatId);
        }
        if(parseInt(data) === guessedNumber){
            bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}`, againOptions);
            delete chats[chatId]; // Удаляем число после игры
        }
        else{
            bot.sendMessage(chatId, `К сожалению, бот загадал цифру ${guessedNumber}`, againOptions);
        }
    }) 
}

start()