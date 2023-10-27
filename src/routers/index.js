const express = require('express');
const router = express.Router();
const functions = require('../utils/functions/index');
const config = require('../../config.json');
const path = require('path');
router.use('/api', require('./api'));
router.use('/auth', require('./auth'));


router.get('/', functions.express.authentication.ensureAuthenticated, async (req, res) => {
    return res.render('pages/index');
});
router.get('/wizard', async (req, res) => {
    if (config.status.isWizarded) return res.redirect('/error/403');
    return res.render('wizard');
});
module.exports = router;