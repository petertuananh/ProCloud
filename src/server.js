const express = require('express');
const app = express();
const config = require('../config.json');
const useragent = require('express-useragent');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(useragent.express());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views/pages'));
app.use("/assets", express.static(path.resolve(`${process.cwd()}${path.sep}src${path.sep}public${path.sep}assets`)));

app.use(function (req, res, next) {
    const config2 = require('../config.json');
    if (!config2.status.isWizarded && !req.url.startsWith('/wizard') && !req.url.startsWith('/api')) return res.redirect('/wizard');
    return next();
})


app.use('/', require('./routers'));

app.listen(config.server.port, async () => {
    console.log('Server đang hoạt động tại port', config.server.port)
});