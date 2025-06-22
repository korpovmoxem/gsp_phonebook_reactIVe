const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('', apiRoutes); // <-- 👈 Без префикса

app.listen(PORT, () => {
  console.log(`✅ Мок сервер запущен: http://localhost:${PORT}`);
});