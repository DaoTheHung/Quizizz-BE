const express = require('express')
const router = express.Router()
const { pool, sql } = require("../database/db")

//Render
router.get("/", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'select * from quizizz'

    return await conn.request().query(sqlString, (err, data) => {

        res.send(
            {
                data: data.recordset
            }
        )
    })

})

//Detail
router.get("/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'select * from quizizz where question_id = ' + id
    return await conn.request().query(sqlString, (err, data) => {
        res.send({
            result: data.recordset
        })
    })

})


//Post
router.post("/add", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'insert into quizizz (name, createAt, updateAt) values(@name, @createAt, @updateAt)'
    return await conn.request()

        .input('name', sql.NVarChar, req.body.name)
        .input('createAt', sql.Date, req.body.createAt)
        .input('updateAt', sql.Date, req.body.updateAt)

        .query(sqlString, (err, data) => {
            res.json({
                message: "Successfull add new quession",
                data: req.body
            })
        })

})

//Put
router.put("/update/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'update quizizz set name = @name, timer = @timer where question_id = ' + id
    return await conn.request()
        .input('name', sql.VarChar(), req.body.name)
        .input('timer', sql.Int, req.body.timer)

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
    const sqlString = 'delete from quizizz where question_id = ' + id
    return await conn.request()

        .query(sqlString, (err, data) => {

            res.send({
                message: "Successfull delete quession",
                result: data
            })
        })

})







module.exports = router