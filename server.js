const express = require('express')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server,{cors:{origin:"*"}})

app.use(express.json())
app.use(express.urlencoded({extended:true}))

function formDate(){
    const today = new Date();
    return today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

}

const chat = new Map()


app.get('/rooms/*',(req,res)=>{
    const roomId = req.query.id
    const obj = chat.has(roomId)?
        {
            users: Array.from(chat.get(roomId).get('users').values()),
            messages: Array.from(chat.get(roomId).get('messages').values())
        } 
        : {users:[],messages:[]}
    
    res.json(obj)
})



app.post('/rooms',(req,res)=>{
  
    const {roomId, user} = req.body

    if(!chat.has(roomId)){
        chat.set(roomId, new Map([
            ['users',new Map()],
            ['messages',[]]
        ]))
    }
    res.json(JSON.stringify([...chat]))
})


io.on('connection', socket => {

    socket.on('ROOM:JOIN',({roomId, user})=>{
        socket.join(roomId)
 
        chat.get(roomId).get('users').set(socket.id, user)
        allUsers = Array.from(chat.get(roomId).get('users').values())

        socket.to(roomId).emit('ROOM:JOINED',JSON.stringify({'users':allUsers,'room':roomId}))
    })

    socket.on('MESSAGE:SENDING',({roomId, user, message})=>{
        socket.join(roomId)
    
        const messages = chat.get(roomId).get('messages')
        messages.push({user,message,time:formDate()})
        chat.get(roomId).set('messages',messages)
 
        const allMessages = chat.get(roomId).get('messages')   
        io.in(roomId).emit('MESSAGE:SENT', JSON.stringify({user,message,time:formDate()}))
    })

    socket.on('disconnect',()=>{
        chat.forEach((value,key)=>{
            if(value.get('users').delete(socket.id)){
                allUsers = Array.from(value.get('users').values())
                socket.to(key).broadcast.emit('ROOM:LEAVE',JSON.stringify({'users':allUsers}))
            }
        })
    })
   
})


server.listen(8888,(err)=>{
    console.log('App started...');
    if(err) {
        throw Error(err)
    }
})
