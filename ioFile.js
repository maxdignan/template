var socketio = require('socket.io');

module.exports = function(server){
    var io = socketio(server);
    io.on('connection', function(socket){
        console.log(socket);

        socket.on('hi', function (text) {
            console.log(text);
            socket.emit('hello', 'bob');
        });


    });

};
