
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'bghswadcfk6wnmowf10h-mysql.services.clever-cloud.com',
    user     : 'u49tdh29mpnozunp',
    password : 'l4Ct9bL2YKhJMNHWq722',
    database : 'bghswadcfk6wnmowf10h'
});


module.exports = db;
