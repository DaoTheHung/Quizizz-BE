const sql = require('mssql/msnodesqlv8')

// kết nối CSDL
const config = {
    user: 'sa',
    password: '123',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance
    database: 'KPIM',
    driver: "msnodesqlv8",
  
}

const pool = new sql.ConnectionPool(config).connect().then(conn => conn)


module.exports = {
    pool,
    sql,
}