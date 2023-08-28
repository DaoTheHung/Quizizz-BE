const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

var bodyParser = require('body-parser')

const quizizz = require('./router/quizizz')
const questionList = require('./router/questionList')
const zoomQuiz = require('./router/room')
const { randomUUID } = require('crypto')

// CORS
app.use(cors())

// BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const server = http.createServer(app)

app.use('/api/quizizz', quizizz)

app.use('/api/question', questionList)
app.use('/api/zoom', zoomQuiz)

app.get('/', (req, res) => {
    res.send("Hello word!")
})


const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST']
    }
})

const listCorrect = []
const result = []
const result1 = []
let resultTest = 0
const listUser = []
const players = []
io.on('connection', (socket) => {
    socket.on('join_room', (data, type) => {
        let room = data + "" + type
        socket.join(room)


    })
    socket.on('join_room1', (data) => {
        socket.join(data)
    })

    // Hết giờ trả lời câu hỏi
    socket.on('timeOut', data => {
        let room1 = data.room + "" + data.type

        io.sockets.to(room1).emit('sendTimeOut', data)

    })


    // player vào phòng
    socket.on('userJoin', (data) => {
        let room1 = data.roomId + "" + data.type
        const object = {
            id: socket.id,
            username: data.username.userName,
        }
        !players.some(user => user.username == data.username.userName) && players.push(object)
        resultTest++
        io.sockets.to(room1).emit('sendUserJoin', data)
        io.to(room1).emit('sendUpdateUser', players)
    })

    // bắt đầu trò chơi
    socket.on('start_game', (data) => {
        let room1 = data.id + "" + data.type
        io.sockets.to(room1).emit('sendStartGame', data)
    })



    // người chơi trả lời câu hỏi - chế độ thông thường  
    socket.on('answer', async (data) => {
        let room1 = data.room + "" + data.type
        !result.some(user => user.userId == data.userId) && result.push(data)
        const check = result.findIndex(id => id.userId == data.userId)
        result[check].score = data.score
        result[check].correctAnswer = data.correctAnswer
        result[check].wrongAnswer = data.wrongAnswer
        await io.sockets.to(room1).emit('sendAnswer', result, data.correctAnswer)
        console.log(data)

    })

    socket.on('questionResult', data => {
        listCorrect.push(data)
        io.to(data.room).emit('sendQuestionResult', listCorrect)
    })

    // người chơi trả lời câu hỏi - chế độ giáo viên  
    socket.on('answerTeacher', (data, user) => {
        let room1 = data.room + "" + data.type
        !result1.some(user => user.userId == data.userId) && result1.push(data)
        const check = result1.findIndex(id => id.userId == data.userId)
        result1[check].score = data.score
        result1[check].result = data.result
        result1[check].index = data.index

        io.sockets.to(room1).emit('sendAnswerTeacher', result1, user, resultTest)
    })

    socket.on('answered', data => {
        let room1 = data.room + "" + data.type

        io.sockets.to(room1).emit('sendAnswered', data)

    })

    socket.on('nextQuestion', data => {
        let room1 = data.room + "" + data.type
        io.sockets.to(room1).emit('sendNextQuestion', data)
    })


    // xóa người chơi khỏi phòng
    socket.on('kick', (data, room, type) => {
        players.filter(user => user !== data)
        let room1 = room + "" + type
        if (resultTest > 0) {
            resultTest--
        }
        io.sockets.to(room1).emit('outRoom', data)
    })

    //
    socket.on('username', (data) => {
        !listUser.some(user => user.username == data.username) && listUser.push(data)

        io.to(data.roomId).emit('sendUserName', listUser)
    })


    // ngắt kết nối
    socket.on('disconnect', () => {
        console.log('a player disconnect')
    })
})



const post = process.env.PORT || 3080
server.listen(post, () => {
    console.log(`Server running on port ${post}`)
});