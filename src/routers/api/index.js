const express = require('express');
const router = express.Router();
const functions = require('../../utils/functions/index');
const config = require('../../../config.json');
const path = require('path');
router.use('/wizard', require('./wizard'));
router.use('/config', functions.express.authentication.ensureAuthenticated, require('./config'));
router.use('/auth', require('./auth'));
module.exports = router;