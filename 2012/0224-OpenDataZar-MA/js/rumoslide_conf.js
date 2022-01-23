var tonos = new Array('#303030') // pasos y tonos de degradado
var secciones = 1; // Cambiar a "false" para no dividir en secciones
var velocidad = 3; //velocidad de reproducción automática valorada en segundos de retardo
var textos = {
	es : new Array('índice','cerrar','Introducción','Siguiente diapositiva','Anterior diapositiva','página'),
	en : new Array('index','close','Intro','Next slide','Previous slide','page')
	};
var dual = false;
var ruta_object = 'js/img/CTIC_CT-W3C_blanco.svg'; // si queremos un swf o un svg que se presente en todo el documento
var ruta_img = 'js/img/CTIC_CT-W3C_black.png'; //alternativa al anterior o imagen presente en todo el documento
var alternativa = 'W3C España - CTIC'; // texto alternativo y title de la imagen y del svg respectivamente
var avanceRaton = 0;
var min_height = 500; // altura media del area de pantalla sobre la que se diseña
var min_width = 1024; // anchura media del area de pantalla sobre la que se diseña
var factor_escalado = .9;
var tipo_scroll= 1; // 1 si es por diapo, 2 si es por contenido de diapo, 0 si no se muestra
/* Fragmento creado e introducido por Diego Martínez, http://enmimismado.es/
 configuración de las teclas de control de la presentacion (los números que aparecen en el array representan
 el keycode de la tecla presionada (puede variar en función del dispositivo utilizado para realizar la
 presentación.
*/
var keys = {
	nextStep : new Array(32,34,40),
	nextSlide : new Array(39, 666),
	prevStep : new Array(38, 33),
	prevSlide : new Array(37, 666),
	index : new Array(73, 666),
	play : new Array(80, 666),
	stop : new Array(83, 666),
	goToStart : new Array(36, 666),
	goToEnd : new Array(35, 666),
	newWindow : new Array(87, 666),
	toggleAltNumClass : new Array(48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105),
	alerta : new Array(65, 666),
	enter : new Array(13, 666),
	escape : new Array(27, 666),
	plus : new Array(61, 107),
	minus : new Array(109, 666),
	zero : new Array(48, 96),
	timer :  new Array(84, 666)
};
