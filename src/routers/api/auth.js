const express = require('express');
const router = express.Router();
const functions = require('../../utils/functions/index');
const config = require('../../../config.json');
const path = require('path');
const { con } = require('../../utils/databases/mysql');
const randomString = require('randomstring');
const ms = require('ms');
const crypto = require('crypto');

router.post('/login', async (req, res) => {
    if (!req.body.username || !req.body.password) return res.json({code: 400, msg: 'Bad request'});
    con.query(`SELECT * FROM users WHERE username = '${req.body.username}'`, function (err, userFindByUsername) {
        if (!userFindByUsername?.[0]) return res.json({code: 400, msg: 'Người dùng không tồn tại'});
        const hashedPasswd = crypto.createHmac("sha256", `${userFindByUsername[0].id}-${req.body.password}-#@*#&%#%^%#$#`).update(`${userFindByUsername[0].id}-${req.body.password}-#@*#&%#%^%#$#`).digest("hex");
        if (hashedPasswd !== userFindByUsername[0].passwd) return res.json({code: 403, msg: 'Mật khẩu chưa chính xác'});
        const accessToken = randomString.generate({ length: 15 });
        con.query(`INSERT INTO user_sessions(id, userId, token, createAt, expireAt) VALUES (${randomString.generate({ charset: 'numeric', length: 10 })}, ${userFindByUsername[0].id}, '${accessToken}', ${Date.now()}, ${Date.now() + ms('24h')})`, e => {
            if (e) return res.json({code: 500, msg: 'Lỗi đăng nhập'});
            return res.cookie('_atk', accessToken, {expires: false}).json({code: 200, msg: 'Đăng nhập thành công', nextUrl: req.cookies.next || '/'});
        });
    })
})
module.exports = router;