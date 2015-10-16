var socket;
var appControl = {
	presIzq: function(){
		socket.emit('control','pres_izq');
	},
	presDer: function(){
		socket.emit('control','pres_der');
	},
	liberoIzq:function(){
		socket.emit('control','libero_izq');
	},
	liberoDer:function(){
		socket.emit('control','libero_der');
	},
	disparar: function() {
		socket.emit('control','disparar');
	}
}

window.onload=function(){
	socket = io();
	$('#btnIZQ').bind('touchend',function(e){
		appControl.liberoIzq();
	});
	$('#btnIZQ').bind('touchstart',function(e){
		appControl.presIzq();
	});
	$('#btnDER').bind('touchstart',function(e){
		appControl.presDer();
	});
	$('#btnDER').bind('touchend',function(e){
		appControl.liberoDer();
	});
	$('#btnDISPARAR').bind('touchstart',function(e){
		appControl.disparar();
	});
};
