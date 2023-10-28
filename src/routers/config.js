const express = require('express');
const router = express.Router();
const path = require('path');
const { con } = require('../utils/databases/mysql');



router.get('/directories', async (req, res) => {
    con.query(`SELECT * FROM root_directories`, function (err, directories) {
        return res.render('config/directories', {
            directories
        });
    });
});
router.get('/share', async (req, res) => {
    return res.render('setting/share');
});
module.exports = router;