var sql = require('mysql2');
const util = require('util');

let connection = sql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

})
const query = util.promisify(connection.query).bind(connection);


module.exports = query ;