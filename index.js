const express = require('express')
const app = express()
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

var bodyParser = require('body-parser')

const quizizz = require('./router/quizizz')
const questionList = require('./router/questionList')

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

app.get('/', (req,res)=> {
    res.send("Hello word!")
})


const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    socket.on("send_message", (data) => {
        socket.broadcast.emit("receive_message",data)
    })

})


const post = process.env.PORT || 3080
app.listen(post, () => {
    console.log(`Server running on port ${post}`)
});