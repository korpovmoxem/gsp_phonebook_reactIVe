const express = require('express');
const app = express();
const PORT = 6666;

// Middleware для парсинга JSON
app.use(express.json());

// Подключаем маршруты
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Mock сервер запущен на http://localhost:${PORT}`);
});