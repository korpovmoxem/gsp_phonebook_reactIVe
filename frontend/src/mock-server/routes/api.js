
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const readJSON = (filename) => {
    const filePath = path.join(__dirname, '../data', filename);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// === ROUTES ===

// GET: список организаций (дерево)
router.get('/organization/tree', (req, res) => {
    const data = readJSON('organizations.json');
    res.json({ result: data });
});

// GET: список внешних организаций
router.get('/external/phonebook', (req, res) => {
    const data = readJSON('externalOrganizations.json');
    res.json({ result: data });
});

// GET: список сотрудников по отделу / организации
router.get('/employee', (req, res) => {
    const data = readJSON('users.json');
    res.json({ result: data });
});

// GET: поиск сотрудников по параметрам
router.get('/employee/search', (req, res) => {
    const data = readJSON('users.json');
    res.json({ result: data });
});

// GET: информация о сотруднике
router.get('/employee/detail', (req, res) => {
    const data = readJSON('currentEmployeeInfo.json');
    res.json({ result: data });
});

// POST: отправка кода подтверждения
router.post('/employee/verification', (req, res) => {
    const data = readJSON('verificationCode.json');
    res.json({ result: data });
});

// PATCH: сохранение информации о сотруднике
router.patch('/employee/edit', (req, res) => {
    const data = readJSON('saveResult.json');
    res.json({ result: data });
});

module.exports = router;
