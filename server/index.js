const http=require ('http');
const express=require ('express');

const cors=require ('cors');
const socketIO=require('socket.io');
const users=[{}];


const app=express();
app.use(cors());
app.get('/',(req,res)=>{
    res.send("Hello from server");
})
const server=http.createServer(app);
const io=socketIO(server);

io.on("connection",(socket)=>{
    console.log("New connection");
    socket.on('joined',({user})=>{
        users[socket.id]=user;
        console.log(`${user} has joined`)
        socket.broadcast.emit('userjoined',{user:"admin",message:`${users[socket.id]} has joined.`})
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat ${users[socket.id]}`});
    });
    socket.on('message',({message,id})=>{
        io.emit('send-message',{user:users[id],message,id});
    })


    socket.on('disconnect',()=>{
        socket.broadcast.emit(`leave`,{user:"Admin",message:`${users[socket.id]} has left`})
        console.log(`${users[socket.id]} left`);
    })

})

server.listen(3000,()=>{console.log("Server running on port 3000")});
