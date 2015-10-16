var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var startTime;

app.use(express.static(__dirname+'/content'));

io.on('connection', function(socket){
	console.log('Se conecto usuario.');
	socket.on('disconnect', function(){
		console.log('El usuario se desconecto.');
	});
	socket.on('control', function(boton){
		console.log('Control: ' + boton);
		io.emit('control',boton);
	});
});
http.listen(80, function(){
  console.log('Servidor iniciado en puerto 80');
});
