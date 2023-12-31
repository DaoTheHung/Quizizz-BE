const express = require('express')
const router = express.Router()
const { pool, sql } = require("../database/db")

//
router.get("/", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'select * from quizizz'

    return await conn.request().query(sqlString, (err, data) => {
        const result = data.recordset
        res.send(
            result
        )
    })

})

//Detail
router.get("/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'select * from quizizz where id = ' + id
    return await conn.request().query(sqlString, (err, data) => {
        const result = data.recordset
        res.send(
            result
        )
    })

})


//Post
router.post("/add", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'insert into quizizz (nameQuiz, createAt, updateAt, questionList) values(@nameQuiz, @createAt, @updateAt,@questionList)'
    return await conn.request()
        .input('nameQuiz', sql.NVarChar, req.body.nameQuiz)
        .input('createAt', sql.Date, req.body.createAt)
        .input('updateAt', sql.Date, req.body.updateAt)
        .input('questionList', sql.NVarChar, JSON.stringify(req.body.questionList))

        .query(sqlString, (err, data) => {
            res.json({
                message: "Successfull add new quizizz",
                data: req.body
            })
        })

})

//Put
router.put("/update/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'update quizizz set result = @result where id = ' + id
    return await conn.request()
        .input('result', sql.VarChar(), JSON.stringify(req.body.result))

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
    const sqlString = 'delete from quizizz where id = ' + id
    return await conn.request()

        .query(sqlString, (err, data) => {

            res.send({
                message: "Successfull delete quession",
                result: data
            })
        })

})







module.exports = router