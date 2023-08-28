const express = require('express')
const router = express.Router()
const { pool, sql } = require("../database/db")


//
router.get("/", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'select * from room'

    return await conn.request().query(sqlString, (err, data) => {
        const result = data.recordset
        res.send(
            result
        )
    })

})


//Post
router.post("/create", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'insert into room (roomId, username, type) values(@roomId, @username, @type)'
    return await conn.request()
        .input('username', sql.NVarChar, req.body.username)
        .input('roomId', sql.NVarChar, req.body.roomId)
        .input('type', sql.NVarChar, req.body.type)


        .query(sqlString, (err, data) => {
            res.json({
                message: "Successfull add new username",
                data: req.body
            })
        })

})

//Update
router.put("/update/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'update room set socketId = @socketId where id = ' + id
    return await conn.request()
        .input('socketId', sql.VarChar, req.body.socketId)
        .query(sqlString, (err, data) => {
            res.json({
                message: "Successfull update  quession",
                data: req.body
            })
        })

})

//Delete
router.delete("/delete/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'delete from room where id = ' + id
    return await conn.request()

        .query(sqlString, (err, data) => {

            res.send({
                message: "Successfull delete player",
                result: data
            })
        })

})

module.exports = router