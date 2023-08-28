const express = require('express')
const router = express.Router()
const { pool, sql } = require("../database/db")


router.get("/", async (req, res, next) => {

    const conn = await pool
    const sqlString = 'select * from question'
    return await conn.request().query(sqlString, (err, data) => {
        res.send({
            question: data.recordset,
        })
    })

})

// Thêm mới
router.post("/add", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'insert into question (id, questionType, questionTitle, question, timer, answare, score) values(@id, @questionType, @questionTitle, @question, @timer, @answare, @score)'
    return await conn.request()
        .input('id', sql.NChar, req.body.id)
        .input('questionType', sql.NVarChar, req.body.questionType)
        .input('questionTitle', sql.NVarChar, req.body.questionTitle)
        .input('question', sql.NVarChar, JSON.stringify(req.body.question))
        .input('timer', sql.Int, req.body.timer)
        .input('answare', sql.NVarChar, JSON.stringify(req.body.answare))
        .input('score', sql.Int, req.body.score)

        .query(sqlString, (err, data) => {

            res.json({
                message: "Successfull add new quession",
                data: req.body
            })
        })

})


// Xóa
router.delete("/delete/:id", async (req, res, next) => {
    const id = req.params.id
    const conn = await pool
    const sqlString = 'delete from question where id = ' + id
    return await conn.request()

        .query(sqlString, (err, data) => {
            console.log(data)
            res.send({
                message: "Successfull delete quession",
                result: data
            })
        })

})

// Xóa tất cả
router.delete("/delete/all", async (req, res, next) => {
    const conn = await pool
    const sqlString = 'truncate table question'
    return await conn.request()

        .query(sqlString, (err, data) => {

            res.send({
                message: "Successfull delete quession",
                data
            })
        })

})


module.exports = router