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
    const sqlString =
        'insert into question (questionId, questionTitle, question_a, question_b, question_c, question_d, timer,answare, score) values(@questionId, @questionTitle, @question_a, @question_b, @question_c, @question_d, @timer, @answare, @score)'
    return await conn.request()
        .input('questionId', sql.Int, req.body.questionId)
        .input('questionTitle', sql.NVarChar, req.body.questionTitle)
        .input('question_a', sql.NVarChar, req.body.question_a)
        .input('question_b', sql.NVarChar, req.body.question_b)
        .input('question_c', sql.NVarChar, req.body.question_c)
        .input('question_d', sql.NVarChar, req.body.question_d)
        .input('timer', sql.Int, req.body.timer)
        .input('answare', sql.NVarChar, req.body.answare)
        .input('score', sql.VarChar, req.body.score)

        .query(sqlString, (err, data) => {
            console.log(err)
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

            res.send({
                message: "Successfull delete quession",
                result: data
            })
        })

})


module.exports = router