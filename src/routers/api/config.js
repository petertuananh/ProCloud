const express = require('express');
const router = express.Router();
const functions = require('../../utils/functions/index');
const config = require('../../../config.json');
const path = require('path');
const { con } = require('../../utils/databases/mysql');
const randomString = require('randomstring');
const fs = require('fs');
router.post('/directories/add', async (req, res) => {
    if (!req.body.path) return res.json({code: 400, msg: 'Bad request'});
    // /root
    if (!fs.existsSync(`${req.body.path}`)) return res.json({code: 400, msg: 'Đường dẫn này không tồn tại'}); 
    con.query(`INSERT INTO root_directories(id, ownerId, path, isReadOnly) VALUES (${randomString.generate({ charset: 'numeric', length: 10 })}, ${req.user.id}, '${req.body.path}', 'false')`, e => {
        if (e) return res.json({code: 500, msg: 'Không thể thêm đường dẫn'});
        return res.json({code: 200, msg: 'Thêm đường dẫn thành công'}); 
    });
});

router.post('/directories/remove', async (req, res) => {
    if (!req.body.id) return res.json({code: 400, msg: 'Bad request'});
    con.query(`DELETE FROM root_directories WHERE id = ${req.body.id}`, e => {
        if (e) return res.json({code: 500, msg: 'Không thể thêm đường dẫn'});
        return res.json({code: 200, msg: 'Thêm đường dẫn thành công'}); 
    });
});
module.exports = router;