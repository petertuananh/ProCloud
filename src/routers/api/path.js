const express = require('express');
const router = express.Router();
const functions = require('../../utils/functions/index');
const config = require('../../../config.json');
const path = require('path');
const { con } = require('../../utils/databases/mysql');
const fs = require('fs');
const rimraf = require("rimraf");

router.post('/rename', async (req, res) => {
    if (!req.body.path || !req.body.name || !req.body.fileName) return res.json({code: 400, msg: 'Bad request'});
    fs.rename(req.body.path, req.body.path.replace(req.body.fileName, req.body.name), function(err) {
        if (err) return res.json({code: 500, msg: 'Không thể đổi tên'});
        return res.json({code: 200, msg: 'Đổi tên thành công'});
    });
})


router.post('/unlink', async (req, res) => {
    if (!req.body.path) return res.json({code: 400, msg: 'Bad request'});
    try {
        await rimraf.sync(`${req.body.path}`);
        return res.json({code: 200, msg: 'Đã xóa thành công'});
    } catch (error) {
        console.log(error)
        return res.json({code: 500, msg: 'Không thể xóa'});
    }
});
router.post('/upload', async (req, res) => {
    const file = req.files?.sampleFile;
    if (!file) return res.json({ code: 400, msg: `File ?` });
    file.mv(`${req.query.path}/${file.name}`, function (err) {
        if (err) {
            return res.json({ code: 500, msg: `Không thể tải lên` });
        }
        return res.redirect(`/?path=${req.query.path}`)
    });
})
module.exports = router;