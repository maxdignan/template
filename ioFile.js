var io = require('socket.io')(require('http').createServer(require('./app')));

module.exports = function(){
    io.on('connection', function(socket){
        console.log(socket);
    });
};
