const express = require('express');
const router = express.Router();
const functions = require('../../utils/functions/');
const config = require('../../../config.json');
const path = require('path');
const mysql = require('mysql2');
const crypto = require('crypto');
const randomString = require('randomstring');

const editJsonFile = require("edit-json-file");
router.post('/', async (req, res) => {
    if (config.status.isWizarded) return res.json({ code: 403, msg: 'Permission denied' });
    const port = req.body.port;
    const db_host = req.body.db_host;
    const db_port = req.body.db_port;
    const db_table = req.body.db_table;
    const db_username = req.body.db_username;
    const db_password = req.body.db_password;
    const username = req.body.username;
    const password = req.body.password;
    const passwordcf = req.body.passwordcf;
    const connection = mysql.createConnection({
        host: db_host,
        port: db_port,
        user: db_username,
        password: db_password
    });
    connection.connect(function(err) {
        if (err) return res.json({code: 500, msg: 'Không thể kết nối đến mysql/marinadb'});
        connection.query(`CREATE DATABASE IF NOT EXISTS ${db_table}`, e => {
            if (e) return res.json({ code: 500, msg: `Không thể tạo bảng ${db_table}` });
            connection.query(`CREATE TABLE IF NOT EXISTS ${db_table}.users (id text, username text, email text, passwd text, createAt text, flags text)`);
            connection.query(`CREATE TABLE IF NOT EXISTS ${db_table}.user_sessions (id text, userId text, token text, createAt text, expireAt text)`);
            connection.query(`CREATE TABLE IF NOT EXISTS ${db_table}.root_directories (id text, ownerId text, path text, isReadOnly text)`);
            const userId = randomString.generate({ charset: 'numeric', length: 7 })
            const hashedPasswd = crypto.createHmac("sha256", `${userId}-${password}-#@*#&%#%^%#$#`).update(`${userId}-${password}-#@*#&%#%^%#$#`).digest("hex");
            connection.query(`INSERT INTO ${db_table}.users(id, username, email, passwd, createAt, flags) VALUES (${userId}, '${username}', '', '${hashedPasswd}', ${Date.now()}, '["admin"]')`);
            const configFile = editJsonFile(`./config.json`);
            // server config
            configFile.set("server.port", port);

            // status config
            configFile.set("status.isWizarded", true);

            // database config
            configFile.set("database.mysql.host", db_host);
            configFile.set("database.mysql.port", db_port);
            configFile.set("database.mysql.database", db_table);
            configFile.set("database.mysql.user", db_username);
            configFile.set("database.mysql.password", db_password);

            // save changes
            configFile.save();

            return res.json({code: 200, msg: 'Đã lưu thay đổi'});
        })
    });
});

module.exports = router;