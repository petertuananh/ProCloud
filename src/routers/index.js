const express = require('express');
const router = express.Router();
const functions = require('../utils/functions/index');
const config = require('../../config.json');
const path = require('path');
const { con } = require('../utils/databases/mysql');

router.use('/api', require('./api'));
router.use('/auth', require('./auth'));
router.use('/config', functions.express.authentication.ensureAuthenticated, require('./config'));


router.get('/', functions.express.authentication.ensureAuthenticated, async (req, res) => {
    con.query(`SELECT * FROM root_directories`, function (err, directories) {
        return res.render('index', {
            directories
        });
    })
});
router.get('/wizard', async (req, res) => {
    if (config.status.isWizarded) return res.redirect('/error/403');
    return res.render('wizard');
});
module.exports = router;