const express = require('express');
const router = express.Router();
const path = require('path');
router.get('/login', async (req, res) => {
    return res.render('auth/login');
});
router.get('/forgot', async (req, res) => {
    return res.render('auth/forgotPassword');
});
module.exports = router;