const express = require('express');
const app = express();
const config = require('../config.json');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(useragent.express());
app.use(fileUpload());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views/pages'));
app.use("/assets", express.static(path.resolve(`${process.cwd()}${path.sep}src${path.sep}public${path.sep}assets`)));

app.use(function (req, res, next) {
    res.locals.req = req;
    const config2 = require('../config.json');
    if (!config2.status.isWizarded && !req.url.startsWith('/wizard') && !req.url.startsWith('/api')) return res.redirect('/wizard');
    return next();
})
app.use(function (err, req, res, next) {
    if (err) {
        res.status(err.status || 500).render('error/500', {
            message: err.message,
            error: {}
        });
    }
});

app.use('/', require('./routers'));
app.use(function (req, res, next) {
    return res.render('error/404');
})
app.listen(config.server.port, async () => {
    console.log('Server đang hoạt động tại port', config.server.port)
});
const pm2 = require('pm2');