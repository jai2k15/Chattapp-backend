const express = require('express');
const app = express();
let cors = require('cors');
const path = require('path')
require('dotenv').config();
const BASE_URL = process.env.BASE_URL;
const DATABASE = process.env.DATABASE;
const port = process.env.PORT || 8001;
//imports
// console.log(process.env.DATABASE)
app.use(cors())

const connectToMongo = require('./DB_Connect')//MongoDB
const userRouter = require('./routes/user')//Routes
const friendRouter = require('./routes/friend')//Routes
const { restrictToLoggedIn } = require('./middleware/auth')
let onlineUsers= [];
//Connection
try{
    connectToMongo(DATABASE)
    .then(console.log('Database connected'));
}catch(error){
    console.log('Cannot connect to Database '+error);
}


//Middleware
app.use(express.json());

//routes
app.use('/home', restrictToLoggedIn, (req, res)=>{
    res.send('HomePage')
})


//user routes
app.use('/api/user', userRouter)

app.use('/api/friends', friendRouter)

app.get("/api", (req, res) => {
  res.json({message: "Hello"})
});


//App
const server = app.listen(port, ()=>{
    console.log(`Social Media App Listening on ${BASE_URL}:${port}`)
})

const io = require('socket.io')(server, {
    
    cors:{
        origin: `${BASE_URL}`,
        origin: "https://socially-messaging.netlify.app",
        allowedHeaders:["my-custom-header"],
        credentials: true
    }
});

io.on('connection', (socket)=>{

    socket.on('setup', (data)=>{
        socket.join(data.userId);
        const username = data.username
        socket.emit('connected');
        if(!onlineUsers.some((user)=> user.username === username)){
            onlineUsers.push({username, socketId:socket.id});
        }
        io.emit("get_users", onlineUsers)
    });

    socket.on("join_chat", (room)=>{
        socket.join(room);
        console.log("user joined "+room)
    })

    socket.on("send_message", (data)=>{
        // console.log("username "+data.username)
        console.log(data.msg)
        const users = data.users;
        if(!data.username) return console.log("user not exist");
        socket.in(data.username).emit("message_received", data);
        
    }) 

    socket.on('disconnect', ()=>{
        onlineUsers = onlineUsers.filter((user)=> user.socketId != socket.id);
        io.emit('get_users', onlineUsers);
    });
})
