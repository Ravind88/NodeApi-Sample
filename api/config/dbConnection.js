var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ravind',
    database: 'reactsampledb',
    charset: 'utf8mb4',// for special character 
    multipleStatements: true
});
connection.connect(function (error) {
    if (error) throw error;
    console.log("Db connected");
})

module.exports = connection;