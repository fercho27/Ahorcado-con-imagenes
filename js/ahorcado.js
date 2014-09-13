var hombre, l, espacio;
var bolsaDePalabras = ["Tamarindo", "Pikachu", "Trombosis", "Higado", "Memorandum", "Trinchera", "Semillas", "Pokemon",
						"Nocturno", "Raton", "Llavero", "Futbol", "Basquet", "Triunfo", "Caramelo", "Pantalones",
						"Piramide", "Aguila", "Lavadero", "Portugal", "Aristoteles", "Principe", "Hierro"];
var palabra



// Constructor clase imagen
var Imagen = function (x, y, url, ahorcado) 
{
	this.posx = x;
	this.posy = y;
	this.ok = false;
	

	this.img = new Image();
	this.img.src = url;
	this.img.onload = function()
	{
		ahorcado.dibujar();
	};
}

Imagen.prototype.confirmar = function (estado)
{
	this.ok = estado;
}


//Declaración de la clase Ahorcado
var Ahorcado = function (con)
{
	var ah = this;

	// Variableas del juego
	this.contexto = con;
	this.maximo = 5;
	this.intentos = 0;
	this.vivo = true;

	// Cargando las imagenes
	this.fondo = new Imagen(0, 0, "img/fondo-ahorcado.png", ah);
	this.poste = new Imagen(250, 150, "img/poste-ahorcado.png", ah);
	this.vida = new Imagen(10, 10, "img/vida-ahorcado.gif", ah);
	// Cargando los intentos del hombrecito
	this.hombre1 = new Imagen(230, 220, "img/hombre-cabeza.png", ah);
	this.hombre2 = new Imagen(230, 220, "img/hombre-cuerpo.png", ah);
	this.hombre3 = new Imagen(230, 220, "img/hombre-brazos.png", ah);
	this.hombre4 = new Imagen(230, 220, "img/hombre-entero.png", ah);
	this.hombre5 = new Imagen(230, 220, "img/hombre-muerto.png", ah);



	this.fondo.confirmar(true);
	this.poste.confirmar(true);
	this.vida.confirmar(true);
}

Ahorcado.prototype.dibujar = function ()
{
	// Capa 1: Fondo
	if(this.fondo.ok)
	{
		this.contexto.drawImage(this.fondo.img, this.fondo.posx, this.fondo.posy);
	}

	// Capa 2: Poste
	if(this.poste.ok)
	{
		this.contexto.drawImage(this.poste.img, this.poste.posx, this.poste.posy);
	}

	// Capa 3: Vida
	if(this.vida.ok)
	{
		for(var i = 0; i < this.maximo - this.intentos; i++)
		{
			this.contexto.drawImage(this.vida.img, this.vida.posx + 50 * i, this.vida.posy);
		}
		
	}	

	// Capa 4: Hombre
	if(this.hombre1.ok)
	{
		this.contexto.drawImage(this.hombre1.img, this.hombre1.posx, this.hombre1.posy);
	}
	else if(this.hombre2.ok)
	{
		this.contexto.drawImage(this.hombre2.img, this.hombre2.posx, this.hombre2.posy);
	}
	else if(this.hombre3.ok)
	{
		this.contexto.drawImage(this.hombre3.img, this.hombre3.posx, this.hombre3.posy);
	}
	else if(this.hombre4.ok)
	{
		this.contexto.drawImage(this.hombre4.img, this.hombre4.posx, this.hombre4.posy);
	}	
	else if(this.hombre5.ok)
	{
		this.contexto.drawImage(this.hombre5.img, this.hombre5.posx, this.hombre5.posy);
	}

}

Ahorcado.prototype.trazar = function ()
{
	this.intentos++;
	// Al fallar el primer intento dibujo la cabeza
	if(this.intentos == 1)
	{
		this.hombre1.confirmar(true);		
	}
	// Al fallar el 2do intento dibujo la cabeza y cuerpo
	if(this.intentos == 2)
	{
		this.hombre1.confirmar(false);
		this.hombre2.confirmar(true);
	}
	// Al fallar el 3er intento dibujo la cabeza, cuerpo y brazos
	if(this.intentos == 3)
	{
		this.hombre2.confirmar(false);
		this.hombre3.confirmar(true);
	}
	// Al Fallar el 4to intento dibujo la la cabeza, cuerpo, brazos y piernas
	if(this.intentos == 4)
	{
		this.hombre3.confirmar(false);
		this.hombre4.confirmar(true);
	}
	// Al perder todos los intentos dibujo hombresillo muerto.
	if(this.intentos >= this.maximo)
	{
		this.vivo = false;
		this.hombre4.confirmar(false);
		this.hombre5.confirmar(true);
		alert("¡Estás muerto!");
	}
	this.dibujar();
}

function iniciar () 
{
	l = document.getElementById("letra");
	var b = document.getElementById("boton");	
	var canvas = document.getElementById("c");
	canvas.width = 700;
	canvas.height = 600;
	hombre = new Ahorcado(canvas.getContext("2d"));

	// Elijo una palabra aleatoria de mi bolsa de palabras
	var aleatorio = Math.floor(Math.random() * (bolsaDePalabras.length - 1 - 0 + 1)) + 0;
	palabra = bolsaDePalabras[aleatorio]
	
	//Convierte a mayúscula un texto
	palabra = palabra.toUpperCase();

	//Declaro un array con n espacios de acuerdo al largo de la palabra
	espacio = new Array(palabra.length);

	//Agregamos una función que se dispare al dar click al botón
	b.addEventListener("click", agregarLetra);
	l.addEventListener("keydown", teclaEnter);
	mostrarPista(espacio);
	devolverFoco();

}

function teclaEnter(datos)
{
	// keyCode me da el valor de la tecla que apreto el usuario
	var codigo = datos.keyCode;

	if(codigo == 13)
	{
		agregarLetra();
	}
}

function devolverFoco()
{
	document.getElementById("letra").focus()
}

function agregarLetra()
{
	var letra = l.value;
	l.value = "";
	mostrarPalabra(palabra, hombre, letra);
	devolverFoco();
}

function mostrarPalabra(palabra, ahorcado, letra)
{
	var encontrado = false;
	var p;
	letra = letra.toUpperCase();
	for(p in palabra)
	{ 
		if(letra == palabra[p])
		{
			espacio[p] = letra;
			encontrado = true;
		}
	}
	mostrarPista(espacio);

	//Si NO lo encontré
	if(!encontrado)
	{
		ahorcado.trazar();
	}

	if(!ahorcado.vivo)
	{
		//Mostrar la palabra entera al morir
		for( var i = 0; i < palabra.length; i++)
		{
			espacio[i] = palabra[i];
			mostrarPista(espacio)
		}
	
	}
}

function mostrarPista(espacio)
{
	var pista = document.getElementById("pista");
	var texto = "";
	var i;
	var largo = espacio.length;

	for(i = 0; i<largo; i++)
	{
		if(espacio[i] != undefined)
		{
			texto = texto + espacio[i] + " ";
		}
		else
		{
			texto += "_ ";
		}
	}
	pista.innerText = texto;
}
