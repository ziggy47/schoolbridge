const mysql2 = require('mysql');

const mysqlLive = mysql2.createConnection(
    {
        host:"127.0.0.1",
        user:"root",
        password: "",
        database: 'schoolbridge',
        multipleStatements:true,
    }   
)
module.exports=mysqlLive;