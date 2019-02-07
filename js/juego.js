var canvas;
var ctx;
var FPS = 50;

//DIMENSIONES DE LAS CASILLAS
var anchoF = 50;
var altoF = 50;

//COLORES
var muro = '#044f14';
var tierra = '#c6892f';

var color1P = '#820c01';
var color2P = '#0959ab';




var jugador1;
var jugador2;

var escenario = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2,2,0],
  [0,2,2,0,0,2,2,0,0,0,0,2,2,0,0,2,2,0,0],
  [0,2,2,2,2,2,2,2,2,2,2,2,0,0,0,2,2,2,0],
  [0,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,2,0],
  [0,2,2,2,2,2,2,0,2,2,0,0,0,0,0,2,2,2,0],
  [0,2,2,2,2,2,0,0,0,2,2,2,2,2,0,2,2,2,0],
  [0,0,0,2,2,0,0,0,0,0,2,2,0,2,2,2,2,2,0],
  [0,0,0,2,2,0,0,0,0,0,2,2,0,2,2,2,2,2,0],
  [0,0,0,2,2,0,0,0,0,0,2,2,0,2,2,2,2,2,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];



//OBJETO CÁMARA
var camara = function(seguir,tileX,tileY,w,h,xCanvas,yCanvas,personaje,rival){

	//POSICION EN EL CANVAS (REAL)
	this.xCanvas = xCanvas;
	this.yCanvas = yCanvas;

	//POSICIÓN EN EL ESCENARIO (tiles)
	this.x = tileX;
	this.y = tileY;
	
	//ANCHO Y ALTO
	this.w = w;
	this.h = h;
	
	//OBTENEMOS EL TAMAÑO DEL ARRAY DEL NIVEL
	this.nivelSizeX = escenario[0].length;
	this.nivelSizeY = escenario.length;
	
	
	this.corrigeX = false;
	this.corrigeY = false;

	

	
	//CORREGIMOS LA POSICIÓN DE LA CÁMARA PARA QUE NO SE SALGA DE LOS MÁRGENES DEL NIVEL
	this.corrigeCamara = function(){
		
		this.corrigeX = false;
		this.corrigeY = false;
		
		
		
		//EJE X
		if(this.x<0){
			this.x=0;
			this.corrigeX = true;
		}
		if(this.x + this.w > this.nivelSizeX - 1){		//se resta 1, por el margen para el clipping
			this.x = this.nivelSizeX - this.w - 1;
			this.corrigeX = true;
		}
		
		
		//EJE Y
		if(this.y<0){
			this.y=0;
			this.corrigeY = true;
		}
		if(this.y + this.h > this.nivelSizeY - 1){		//se resta 1, por el margen para el clipping
			this.y = this.nivelSizeY - this.h - 1;
			this.corrigeY = true;
		}
		
	}
	
	

	//DIBUJAMOS EL ESCENARIO
	this.dibujaEscenario = function(){
		var color;
		
		//DIBUJAMOS LOS TILES (añadimos uno más de margen, para luego poder hacer el clipping)
		for(y=this.y;y<(this.h + this.y + 1);y++){
			for(x=this.x;x<(this.w + this.x + 1);x++){

			  if(escenario[y][x]==0)
				color = muro;

			  if(escenario[y][x]==2)
				color = tierra;

			  ctx.fillStyle = color;
			  ctx.fillRect(this.xCanvas+(x-this.x)*anchoF,this.yCanvas+(y-this.y)*altoF,anchoF,altoF);
			}
		 }
		
	}
	
	
	
	//DIBUJAMOS ESCENARIO Y PROTAGONISTA
	this.dibuja = function(){
		
		
		if(seguir){
			//--------------------------------------------------------------------------
			//CÁMARA DINÁMICA
			//OBTENEMOS LAS COORDENADAS DEL USUARIO PARA SABER SI NOS TENEMOS QUE MOVER

			//AVERIGUAMOS EN QUÉ CASILLA ESTÁ EL PERSONAJE
			var coordenadas = personaje.getPosicion();
			
			var tileXPersonaje = parseInt(coordenadas.x/anchoF);
			var tileYPersonaje = parseInt(coordenadas.y/altoF);
			
		
		
			//CAMBIAMOS LA POSICIÓN DE LA CÁMARA EN FUNCIÓN DE LA CASILLA EN LA QUE ESTÁ EL PERSONAJE
			this.x = tileXPersonaje - parseInt(this.w/2);
			this.y = tileYPersonaje - parseInt(this.h/2);
			
			//HACEMOS MÁS SUAVE EL MOVIMIENTO CALCULANDO LOS PIXELS EXTRA CON RESPECTO A LA CASILLA ACTUAL
			var difPixelX = parseInt(coordenadas.x - tileXPersonaje*anchoF);
			var difPixelY = parseInt(coordenadas.y - tileYPersonaje*altoF);
			
			//CORREGIMOS LA POSICIÓN DE LA CÁMARA PARA EVITAR QUE SE LLEGUE AL FINAL DEL NIVEL
			this.corrigeCamara();
			

			//AÑADIMOS MOVIMIENTO SÓLO SI HA HABIDO UNA CORRECCIÓN EN UN EJE
			if(this.corrigeX){
				if(this.x==0){
					difPixelX = 0;
				}
				else{
					difPixelX = anchoF;
				}
			}
			
			
			if(this.corrigeY){
				if(this.y==0){
					difPixelY = 0;
				}
				else{
					difPixelY = altoF;
				}
			}

		}
		
		
		//-----------------------------------------------------------------------------
		
		//CLIPPING
		ctx.save();
		ctx.rect(xCanvas,yCanvas,w*anchoF,h*altoF);
		ctx.clip();
		
		//MOVIMIENTO SUAVE (CÁMARA DINÁMICA)
		//HACEMOS UN TRANSLATE DEL CANVAS PARA AJUSTAR EL MOVIMIENTO (EN CÁMARA DINÁMICA)
		ctx.translate(-difPixelX,-difPixelY);

		
		//DIBUJAMOS
		this.dibujaEscenario();
		
		rival.dibuja(this.x,this.y,this.w,this.h,this.xCanvas,this.yCanvas);
		personaje.dibuja(this.x,this.y,this.w,this.h,this.xCanvas,this.yCanvas);
		
		
		//RESTAURAMOS TRAS EL CLIPPING
		ctx.restore();
		
	}

	
	
}





//OBJETO JUGADOR
var jugador = function(color){

  //Posición en pixels
  this.x = 70;
  this.y = 70;

  //Velocidad horizontal y vertical
  this.vx = 0;
  this.vy = 0;

  //Gravedad
  this.gravedad = 0.3;    //lunar = 0.3   normal = 0.5
  this.friccion = 0.1;    //sin fricción = 0   hielo = 0.1   suelo = 0.2


  this.salto = 10;     //salto = 10
  this.velocidad = 3;  //desplazamiento = 3

  //¿Está en el suelo?
  this.suelo = false;

  //controlamos la pulsación de las teclas
  this.pulsaIzquierda = false;
  this.pulsaDerecha = false;


  this.durezaRebote = 100;  //flexible = 2  noFlexible = 100
  this.color = color;

  
  //OBTENEMOS LAS COORDENADAS DEL PERSONAJE
  this.getPosicion = function(){
	return {x:this.x, y:this.y};
  }



  //CORREGIMOS LA POSICION DEL JUGADOR A UNA CASILLA (SIN DEJAR HUECOS)
  this.correccion = function(lugar){

    if(lugar == 1){
      this.y = parseInt(this.y/altoF)*altoF;
      //console.log('abajo');
    }

    if(lugar == 2){
      this.y = (parseInt(this.y/altoF)+1)*altoF;
      //console.log('arriba');
    }


    if(lugar == 3){
      this.x = (parseInt(this.x/anchoF))*anchoF;
      //console.log('izquierda');
    }

    if(lugar == 4){
      this.x = parseInt((this.x/anchoF)+1)*anchoF;
      //console.log('derecha');
    }


  }





  //HACEMOS LOS CÁLCULOS OPORTUNOS
  this.fisica = function(){

    //CAÍDA
    if(this.suelo == false){
      this.vy += this.gravedad;
    }
    else{
      this.correccion(1);

      //AÑADIMOS
      var rebote = parseInt(this.vy/this.durezaRebote);
      this.vy = 0 - rebote;
    }


    //VELOCIDAD HORIZONTAL
    //Siempre la refrescamos, para que pueda haber inercia y deslice
    if(this.pulsaIzquierda == true){
      this.vx = -this.velocidad;
    }

    if(this.pulsaDerecha == true){
      this.vx = this.velocidad;
    }



    //FRICCÓN (INERCIA)
    //Izquierda
    if(this.vx < 0){
      this.vx += this.friccion;

      //si nos pasamos, paramos
      if(this.vx >0){
        this.vx = 0;
      }
    }

    //Derecha
    if(this.vx > 0){
      this.vx -= this.friccion;

      //si nos pasamos, paramos
      if(this.vx < 0){
        this.vx = 0;
      }
    }



    //VEMOS SI HAY COLISIÓN POR LOS LADOS
    //SOLO HACEMOS LA CORRECCIÓN SI LA FICHA NO ESTÁ ENCAJADA EN EL PUNTO EXACTO
    //DEJAMOS UN PIXEL POR LOS LADOS, PARA QUE NO QUEDE JUSTO EN LA PRÓXIMA CASILLA Y SE BLOQUEE

    //derecha
    if(this.vx > 0){
      if(this.colision(this.x + anchoF + this.vx,(this.y + 1))==true || this.colision(this.x + anchoF + this.vx,(this.y + altoF - 1))==true){
        if(this.x != parseInt(this.x/anchoF)*anchoF){
          this.correccion(4)
        }

        this.vx = 0;
      }
    }


    //Izquierda
    if(this.vx < 0){
      if(this.colision(this.x + this.vx,(this.y+ 1))==true || this.colision(this.x + this.vx,(this.y+ + altoF - 1))==true){
        this.correccion(3)
        this.vx = 0;
      }
    }


    //ACTUALIZAMOS POSICIÓN
    this.y += this.vy;
    this.x += this.vx;


    //para ver si hay colisión por abajo le sumamos 1 casilla a "y"
    //COMPROBAMOS 2 PUNTOS EN PANTALLA Y NOS ASEGURAMOS DE QUE NO ESTÁ SALTANDO (velocidad vertical mayor o igual que cero)
    if(this.vy >= 0){
      if((this.colision((this.x + 1),(this.y + altoF))==true) || (this.colision((this.x + anchoF - 1),(this.y + altoF))==true)){
        this.suelo = true;
      }
      else{
        this.suelo = false;
      }
    }


    //COMPROBAMOS COLISIÓN CON EL TECHO (frena el ascenso en seco)
    //if(this.colision((this.x+ (parseInt(anchoF/2))), this.y)){
    if((this.colision((this.x + 1), this.y) == true) || (this.colision((this.x + anchoF - 1), this.y) == true)){
      this.correccion(2);
      this.vy = 0;

    }


  }



  //PASAMOS COMO PARÁMETRO LAS COORDENADAS DE LA CÁMARA
  this.dibuja = function(camX,camY,w,h,canvasX,canvasY){
	  
	var casillaX = parseInt(this.x/anchoF);
	var casillaY = parseInt(this.y/altoF);
	
	//SOLO DIBUJAMOS AL PERSONAJE SI ESTÁ EN LA VENTANA DE LA CÁMARA
	if(casillaX >= camX-1 && casillaX <= camX + w && casillaY >= camY-1 && casillaY <= camY + h){
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x - (camX*anchoF) + canvasX,this.y - (camY*altoF) + canvasY,anchoF,altoF);
	}
	
	
  }


  
  
  
  
  
  this.colision = function(x,y){
    var colisiona = false;

    //Ajustamos los pixels a los cuadros dividiendo por altoF y anchoF
    //if(escenario[y][x]==0){
    if(escenario[parseInt(y/altoF)][parseInt(x/anchoF)]==0){
      colisiona = true;
    }

    return(colisiona);
  }



  this.arriba = function(){

    //Solo podemos saltar si estamos en el suelo
    if(this.suelo == true){
      this.vy -= this.salto;
      this.suelo = false;
    }
  }



  this.izquierda = function(){
    //this.vx = -this.velocidad;
    this.pulsaIzquierda = true;
  }

  this.derecha = function(){
    //this.vx = this.velocidad;
    this.pulsaDerecha = true;
  }


  this.izquierdaSuelta = function(){
    this.pulsaIzquierda = false;
  }

  this.derechaSuelta = function(){
    this.pulsaDerecha = false;
  }

}





//----------------------------------------------------

var ratonX = 0;
var ratonY = 0;

function clicRaton(e){
  
}

function sueltaRaton(e){
  
}

function posicionRaton(e){
  ratonX = e.pageX;
  ratonY = e.pageY;
}


//-----------------------------------------------------

function inicializa(){
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  //CREAMOS AL JUGADOR

  jugador1 = new jugador(color1P);
  jugador2 = new jugador(color2P);
  
  camara1 = new camara(true,0,5,7,11,0,0,jugador1,jugador2);
  camara2 = new camara(true,0,5,7,11,450,0,jugador2,jugador1);
  //camara2 = new camara(true,0,5,7,11,400,0,jugador2,jugador1);
 

  //RATÓN
  canvas.addEventListener('mousedown',clicRaton,false);
  canvas.addEventListener('mouseup',sueltaRaton,false);
  canvas.addEventListener('mousemove',posicionRaton,false);


  //LECTURA DEL TECLADO
  document.addEventListener('keydown',function(tecla){

	//JUGADOR 1
    if(tecla.keyCode == 38){
      jugador1.arriba();
    }

    if(tecla.keyCode == 37){
      jugador1.izquierda();
    }

    if(tecla.keyCode == 39){
      jugador1.derecha();
    }
	
	//JUGADOR 2
	if(tecla.keyCode == 87){
      jugador2.arriba();
    }

    if(tecla.keyCode == 65){
      jugador2.izquierda();
    }

    if(tecla.keyCode == 68){
      jugador2.derecha();
    }
	

  });



  //LECTURA DEL TECLADO
  document.addEventListener('keyup',function(tecla){

	//JUGADOR1
    if(tecla.keyCode == 37){
      jugador1.izquierdaSuelta();
    }

    if(tecla.keyCode == 39){
      jugador1.derechaSuelta();
    }
	
	//JUGADOR2
	if(tecla.keyCode == 65){
      jugador2.izquierdaSuelta();
    }

    if(tecla.keyCode == 68){
      jugador2.derechaSuelta();
    }

  });



  setInterval(function(){
    principal();
  },1000/FPS);
}


function borraCanvas(){
  canvas.width=canvas.width;
  canvas.height=canvas.height;
}


function principal(){
  borraCanvas();

  jugador1.fisica();
  jugador2.fisica();
  
  camara1.dibuja();
  camara2.dibuja();

}
