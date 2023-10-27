const { con } = require('../../databases/mysql');
module.exports = {
    query: async function(query) {
        return await new Promise((resolve, reject) => {
            con.query(query, async function (err, res) {
                if (err) return resolve(false);
                return resolve(res)
            })
        })
    }
}