const socketio = require('socket.io');
const io = socketio();
const socketApi = {};
socketApi.io = io;
//helpers
const randomColor = require('../helpers/randomColor');

const users = {};

io.on('connection',(socket)=>{

    socket.on('newUser',(data)=>{
        const defaultData = {
            id:socket.id,
            position:{
                x:0,
                y:0
            },
            color:randomColor()
        };

        const userData = Object.assign(data,defaultData);
        users[socket.id]=userData;
        socket.broadcast.emit('newUser',userData);
        io.emit('initPlayers',users);

    });

    socket.on('locationUpdate',(locData)=>{
        try {
        users[socket.id].position.x=locData.left;
        users[socket.id].position.y=locData.top;
        socket.broadcast.emit('locUpdate',{'id':locData.id,'left':locData.left,'top':locData.top});

        }catch (e) {
            console.log(e)
        }
    });

    socket.on('disconnect',()=>{
        socket.broadcast.emit('disUser',users[socket.id]);
        delete users[socket.id];
    });

    socket.on('newMessage',(data)=>{
        socket.broadcast.emit('newMessage',data);
    });

});

module.exports= socketApi;