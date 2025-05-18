const http = require('http')
const { Server } = require('socket.io')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const authRoutes = require('./routes/auths')
const userRoutes = require('./routes/users')
const fetchdbsRoutes = require('./routes/fetchdbs')
const testRoutes = require('./routes/tests')
const recordRoutes = require('./routes/records')
const scoreRoutes = require('./routes/scores')

app.use(morgan('dev'))
app.use(express.json())
app.use(cors())

app.use('/api', testRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/score', scoreRoutes)
app.use('/api/fetchdbs', fetchdbsRoutes)
app.use('/api/records', recordRoutes )

io.on('connection', (socket) => {
    console.log('New socket connection:', socket.id);

    socket.on('message', (data) => {
        console.log('Message received:', data);
        socket.emit('reply', 'Message received successfully!');
    });

    socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
    });
});

server.listen(8800, () => {
    console.log('Server running on port 8800');
});