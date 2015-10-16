
var canvas;
var socket;
var requestAnimFrame;

var juego = {
	enemigos: [],
	incX:0,
	incY:0,
	cual:1,
	anim:0,
	status: 'pausa',
	incBala: 5,
	bala: {x:0,y:0,disparada:false},
	disparar: function(){
		if(juego.status=='normal'){
			if (juego.bala.disparada==false){
				juego.bala.x = juego.x;
				juego.bala.y = juego.y;
				juego.bala.disparada=true;

			}
		}else{
			if(juego.status=='pausa'){
				juego.status='normal';
			}
		}
	},
	poblar: function (ops){
		var ix=20;
		var iy=10;
		var max = 68;
		if(ops.crear==false){
			max = juego.enemigos.length;
		}
		for(var i=0;i<max;i++){
			if (ops.crear==true){
				juego.enemigos.push({sx:ix,incex:1, sy:iy,x: ix,y: iy, w:32, h:32, activo:true});
				ix = ix+40;
				if (ix>600){
					ix=0;
					iy=iy+40;
				}
			}else{
				juego.enemigos[i].x = juego.enemigos[i].sx;
				juego.enemigos[i].y = juego.enemigos[i].sy;
				juego.enemigos[i].activo=true;
			}
		}
	},
	xi:320,
	yi:300,
	x: 320,
	y: 300,
	presIzq: function(){
		juego.incX=-4;
	},
	presDer: function(){
		juego.incX=4;
	},
	liberoIzq: function(){
		juego.incX=0;

	},
	liberoDer: function(){
		juego.incX=0;

	},
	reset:function(){
		juego.x=juego.xi;
		juego.y=juego.yi;
		juego.poblar({crear:false});
	},
	obtenerInfo: function(){
		var total=0;
		if (juego.anim>=3){
			juego.cual = 3- juego.cual;
			juego.anim=0;
		}
		juego.anim++;
		juego.x += juego.incX;
		if(juego.x>0){
			juego.x--;
		}
		if(juego.x<600){
			juego.x++;
		}
		var enemigoActual;
		
		for(var i=0;i<juego.enemigos.length;i++){
			enemigoActual = juego.enemigos[i];
			if(enemigoActual.activo==true){
				if (juego.bala.x>=enemigoActual.x && juego.bala.x<=(enemigoActual.x+enemigoActual.w)){
					if (juego.bala.y>=enemigoActual.y && juego.bala.y<=(enemigoActual.y+enemigoActual.h)){
						juego.enemigos[i].activo=false;
						juego.bala.disparada=false;
					}
				}
			}
			enemigoActual=juego.enemigos[i];
			if(enemigoActual.activo==true)
			{
				
				total++;
				juego.enemigos[i].x+=juego.enemigos[i].incex;
				if(Math.abs(juego.enemigos[i].sx-juego.enemigos[i].x)>=10){
					juego.enemigos[i].incex= -juego.enemigos[i].incex;
					juego.enemigos[i].y++;
				}
			}
			
		}
		if (total==0){
				
				juego.reset();
				juego.status='pausa';
		}
		if(juego.bala.disparada){

			if (juego.bala.y>0){
				juego.bala.y-=juego.incBala;
			}else{
				juego.bala.disparada=false;
			}
		}
		return {x: juego.x, y: juego.y,cual:juego.cual, enemigos: juego.enemigos,bala:juego.bala};
	},
	imgSprite: null,
	ultimoEstado: null,
	juegoNormal: function(){
		var valores = juego.obtenerInfo();
		var img = document.getElementById('imgSprites');
 		canvas.drawImage(img,0,205,62,35,valores.x-16,valores.y,32,32);
		if(valores.bala.disparada){
			canvas.drawImage(img,16,216,8,8,valores.bala.x,valores.bala.y,4,4);
		}

		for(var i =0;i<valores.enemigos.length;i++){
			if (valores.enemigos[i].activo){
				canvas.fillStyle = "black";
				canvas.fillText('E', valores.enemigos[i].x, valores.enemigos[i].y);
				if(valores.cual==1){
					canvas.drawImage(img,0,0,62,34,valores.enemigos[i].x,valores.enemigos[i].y,32,32);

				}else{
					canvas.drawImage(img,0,35,62,34,valores.enemigos[i].x,valores.enemigos[i].y,32,32);
				}
			}
		}

	},
	juegoPausa:function(){
		canvas.fillStyle = "white";
		canvas.fillText('PAUSA', 100,100);
	},

	mostrar: function(){
		
		canvas.clearRect(0, 0, 640, 320);

		switch(juego.status){
			case 'normal':
				juego.juegoNormal();
			break;
			case 'pausa':
				juego.juegoPausa();
			break
		}
	}

};


window.onload=function(){
	canvas = document.getElementById('canvasPantalla').getContext("2d");
	juego.poblar({crear:true});
	socket = io();
    setInterval(function(){
    	juego.mostrar();
    },1000/30);
    socket.on('control',function(boton){
		switch(boton){
			case 'pres_der':
				juego.presDer();
				break;
			case 'pres_izq':
				juego.presIzq();
				break;
			case 'libero_der':
				juego.liberoDer();
				break;
			case 'libero_izq':
				juego.liberoIzq();
				break;
			case 'disparar':
				juego.disparar();
				break;
		}
    })
};