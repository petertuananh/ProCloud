const functions = require('../index');
const { con } = require('../../databases/mysql');
const config = require('../../../../config.json');
module.exports = {
    ensureAuthenticated: async function (req, res, next) {
        const config2 = require('../../../../config.json');
        if (!config2.status.isWizarded) return next();
        con.query(`SELECT * FROM user_sessions WHERE token = '${req.cookies._atk}'`, function (err, data) {
            if (err || !data?.[0] || (data?.[0]?.expireAt < Date.now())) return res.redirect('/auth/login');
            return next();
        })
    }
}