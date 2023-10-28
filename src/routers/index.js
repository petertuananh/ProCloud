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
            if (!directory[0]) return res.redirect('/error/404');
            fs.readFile(req.query.path, e => {
                if (!e) {
                    console.log(path.resolve(req.query.path))
                    return res.sendFile(path.resolve(req.query.path));
                } else {
                    fs.readdir(req.query.path, (err, items) => {
                        return res.render('folder', {
                            items
                        });
                    });
                }
            });
            
        });
    } else {
        con.query(`SELECT * FROM root_directories`, function (err, directories) {
            return res.render('index', {
                directories
            });
        });
    }
});
router.get('/wizard', async (req, res) => {
    if (config.status.isWizarded) return res.redirect('/error/403');
    return res.render('wizard');
});
module.exports = router;