const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/users.json');

// Вспомогательная функция для чтения данных
const readData = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

// GET /api/users
router.get('/', (req, res) => {
  const users = readData();
  res.json(users);
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  const users = readData();
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  res.json(user);
});

// POST /api/users
router.post('/', (req, res) => {
  const users = readData();
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
  res.status(201).json(newUser);
});

module.exports = router;