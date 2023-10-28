const express = require('express');
const router = express.Router();
const functions = require('../utils/functions/index');
const config = require('../../config.json');
const path = require('path');
const { con } = require('../utils/databases/mysql');
const fs = require('fs');
router.use('/api', require('./api'));
router.use('/auth', require('./auth'));
router.use('/config', functions.express.authentication.ensureAuthenticated, require('./config'));


router.get('/', functions.express.authentication.ensureAuthenticated, async (req, res) => {
    if (req.query.path) {
        con.query(`SELECT * FROM root_directories WHERE path = '/${req.query.path.split('/')[1]}'`, function (err, directory) {
            if (!directory[0]) return res.render('error/404');
            fs.readFile(req.query.path, (e, file) => {
                if (!e) {
                    const base64data = Buffer.from(file, 'binary').toString('base64');
                    const originaldata = Buffer.from(base64data, 'base64');
                    return res.end(Buffer.from(originaldata), 'binary');
                } else {
                    fs.readdir(req.query.path, (err, items) => {
                        return res.render('folder', {
                            currentPath: req.query.path,
                            items
                        });
                    });
                }
            });
        });
    } else {
        con.query(`SELECT * FROM root_directories`, function (err, directories) {
            return res.render('index', {
                currentPath: req.query.path,
                directories
            });
        });
    }
});
router.get('/wizard', async (req, res) => {
    if (config.status.isWizarded) return res.render('error/403');
    return res.render('wizard');
});
module.exports = router;