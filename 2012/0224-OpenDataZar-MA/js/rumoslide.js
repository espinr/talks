/* rumoslide Presentaciones con XHTML, CSS y Javascript
   Copyright (C) 2007  Jorge Rumoroso
   http://www.niquelao.net

   Esta obra está hecha bajo una licencia de Creative Commons:
   http://creativecommons.org/licenses/by-nc-sa/2.5/es
*/

// contains method implementation for arrays
Array.prototype.contains = function (element) {
	for (var i = 0; i < this.length; i++) 
		if (this[i] == element)
			return true;
	return false;
};

rumoslide = {
	fontsizedefaultHead: '',
	fontsizedefaultContent: '',
	fontsizedefaultFoot: '',
	fontsizedefaultCredits: '',
	fontsizedefaultObject: '',
	fontsizedefaultNavGraf: '',
	ratonClick: function(e){
		if(avanceRaton){
			if (!e)
				var e = window.event;
			if (e.target)
				target = e.target;
			else if (e.srcElement)
				target = e.srcElement;
			if (target.nodeName.toLocaleLowerCase() != "object" && target.nodeName.toLocaleLowerCase() != "a" && target.parentNode.nodeName.toLocaleLowerCase() != "a" && target.nodeName.toLocaleLowerCase() != "input" && target.nodeName.toLocaleLowerCase() != "textarea" && target.nodeName.toLocaleLowerCase() != "select" && target.nodeName.toLocaleLowerCase() != "option"){
				rumoslide.padre(target,'current')
			}
		}
	},
	padre: function(element,nombre) {
		if(element.nodeType != 1) return false;
		else
			if(element.id == nombre)
				rumoslide.avanza()
			else
				return rumoslide.padre(element.parentNode,nombre)
	},
	insertAfter: function(previo,nodo) {
		var parent_previo = previo.parentNode;
		if (previo.nextSibling) {
			parent_previo.insertBefore(nodo, previo.nextSibling)
		} else {
			parent_previo.appendChild(nodo);
		}
	},
	fixPng: function(){
		if (nav.indexOf('msie 6')!= -1 && (document.body.filters)) {
			for(var i=0; i<document.images.length; i++) {
				var img = document.images[i]
				var imgName = img.src.toUpperCase()
				if (imgName.substring(imgName.length-3, imgName.length) == "PNG"){
					var imgID = (img.id) ? "id='" + img.id + "' " : ""
					var imgClass = (img.className) ? "class='" + img.className + "' " : ""
					var imgTitle = (img.title) ? "title='" + img.title + "' " : "title='" + img.alt + "' "
					var imgStyle = "display:inline-block;" + img.style.cssText 
					if (img.align == "left") imgStyle = "float:left;" + imgStyle
					if (img.align == "right") imgStyle = "float:right;" + imgStyle
					if (img.parentElement.href) imgStyle = "cursor:hand;" + imgStyle
					var strNewHTML = "<span " + imgID + imgClass + imgTitle
						+ " style=\"" + "width:" + img.width + "px; height:" + img.height + "px;" + imgStyle + ";"
						+ "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader"
						+ "(src=\'" + img.src + "\', sizingMethod='scale');\"></span>" 
					img.outerHTML = strNewHTML
					i = i-1
				}
			}
		}
	},
	scroll_ear: function() { // Esto sólo es operativo en IE 6 o menor y es para simular el "position: fixed" de CSS
		document.getElementById('foot').style.bottom = - document.documentElement.scrollTop + 'px';
		document.getElementById('nav_graf').style.bottom = - document.documentElement.scrollTop + 'px';
	},
	cargaEstilos: function(){
		var clean_st = document.getElementsByTagName('link');
		for (var i = 0; i < clean_st.length; i++) {
			if(clean_st[i].getAttribute('type') == 'text/css' && clean_st[i].className.indexOf('rumoslide') == -1)
				clean_st[i].parentNode.removeChild(clean_st[i])
		}
		var clean_st = document.getElementsByTagName('head')[0].getElementsByTagName('style');
		for (var i = 0; i < clean_st.length; i++) {
			clean_st[i].parentNode.removeChild(clean_st[i])
		}
		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {
			if(scripts[i].getAttribute('src') && scripts[i].getAttribute('src').indexOf('rumoslide.js') > -1) {
				var ruta = scripts[i].src.replace('rumoslide.js','') + 'css/rumoslide.css';
				var link_style = document.createElement('link');
				link_style.setAttribute('rel','stylesheet');
				link_style.setAttribute('type','text/css');
				link_style.setAttribute('href',ruta);
				rumoslide.insertAfter(scripts[i],link_style)
				link_style.setAttribute('media','projection,screen');
				var ruta = scripts[i].src.replace('rumoslide.js','') + 'css/rumoslide_print.css';
				var link_style_print = document.createElement('link');
				link_style_print.setAttribute('rel','stylesheet');
				link_style_print.setAttribute('type','text/css');
				link_style_print.setAttribute('href',ruta);
				link_style_print.setAttribute('media','print');
				rumoslide.insertAfter(link_style,link_style_print)
			}
			if(scripts[i].getAttribute('src') && scripts[i].getAttribute('src').indexOf('rumoslide') == -1) {
				//scripts[i].parentNode.removeChild(scripts[i])
			}
		}
	},
	getStyleElement: function(el,styleProp){
		if(styleProp == 'font-size') var especial = 'fontSize';
		if (el.currentStyle)
			var y = el.currentStyle[especial];
		else if (window.getComputedStyle)
			var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return y;
	},
	bodyId: function() {
		if(document.getElementsByTagName('body')[0].id != identificador){
			document.getElementsByTagName('body')[0].id = identificador;
			if(document.getElementById('foot'))
				document.getElementById('foot').style.display = '';		
			if(document.getElementById('nav_graf'))
				document.getElementById('nav_graf').style.display = '';
			var  paginas = rumoslide.getElementsByClassName(document, 'section', 'slide')
			for (var a = 0; a < paginas.length; a++){
				var cont = rumoslide.getElementsByClassName(document, '*', 'cont_' + a)
				for(var i = 0; i < cont.length; i++){
					if(cont[i].className.indexOf('part') == -1){
						cont[i].style.color = tonos[0];
					}
				}
			}
			var enlac = document.getElementsByTagName('a');
			for(var i = 0; i < enlac.length; i++){
				if(!enlac[i].className || (enlac[i].className && !(enlac[i].className == 'cre')))
					enlac[i].style.color = tonos[0]
			}
			rumoslide.slideInicial();
		}else{
			document.getElementsByTagName('body')[0].id = '';
			if(document.getElementById('foot'))
				document.getElementById('foot').style.display = 'none';
			if(document.getElementById('nav_graf'))
				document.getElementById('nav_graf').style.display = 'none';
			var  paginas = rumoslide.getElementsByClassName(document, 'section', 'slide')
			for (var a = 0; a < paginas.length; a++){
				var cont = rumoslide.getElementsByClassName(document, '*', 'cont_' + a)
				for(var i = 0; i < cont.length; i++){
					if(cont[i].className.indexOf('part') == -1){
						cont[i].style.color = '#000';
					}
				}
				var enlac = document.getElementsByTagName('a');
				for(var i = 0; i < enlac.length; i++){
					if(!enlac[i].className || (enlac[i].className && !(enlac[i].className == 'cre')))
						enlac[i].style.color = '#000'
				}
			}
			for(var a = 0; a < slides.length; a++) {
				slides[a].style.display = 'block';
			}
		}
	},
	bodyClass: function(clase) {
		if(document.getElementsByTagName('body')[0].className) {
			if(document.getElementsByTagName('body')[0].className.indexOf(clase) == -1){
				document.getElementsByTagName('body')[0].className += ' ' + clase;
			}else{
				document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace(clase , '');
			}
		}else{
			document.getElementsByTagName('body')[0].className = clase;
		}
	},
	recogeElements: function() {
		head_1 = document.getElementsByTagName('h1');
		head_2 = document.getElementsByTagName('h2');
		head_3 = document.getElementsByTagName('h3');

		enlaces = document.getElementsByTagName('a');
		if(head_1.length > 1){
			var erase = new Array;
			head_4 = document.getElementsByTagName('h4');
			head_5 = document.getElementsByTagName('h5');
			if(head_5)
				for(var a = 0; a < head_5.length; a++){
					var nuevo_head = document.createElement('h6')
					for(var i = 0; i < head_5[a].childNodes.length; i++){
						nuevo_head.appendChild(head_5[a].childNodes[i])
					}
					head_5[a].parentNode.insertBefore(nuevo_head,head_5[a])
					erase.push(head_5[a])
				}
			if(head_4)
				for(var a = 0; a < head_4.length; a++){
					var nuevo_head = document.createElement('h5')
					for(var i = 0; i < head_4[a].childNodes.length; i++){
						nuevo_head.appendChild(head_4[a].childNodes[i])
					}
					head_4[a].parentNode.insertBefore(nuevo_head,head_4[a])
					erase.push(head_4[a])
				}
			if(head_3)
				for(var a = 0; a < head_3.length; a++){
					var nuevo_head = document.createElement('h4')
					for(var i = 0; i < head_3[a].childNodes.length; i++){
						nuevo_head.appendChild(head_3[a].childNodes[i])
					}
					head_3[a].parentNode.insertBefore(nuevo_head,head_3[a])
					erase.push(head_3[a])
				}
			if(head_2)
				for(var a = 0; a < head_2.length; a++){
					var nuevo_head = document.createElement('h3')
					for(var i = 0; i < head_2[a].childNodes.length; i++){
						nuevo_head.appendChild(head_2[a].childNodes[i])
					}
					head_2[a].parentNode.insertBefore(nuevo_head,head_2[a])
					erase.push(head_2[a])
				}
			if(head_1)
				for(var a = 0; a < head_1.length; a++){
					var nuevo_head = document.createElement('h2')
					for(var i = 0; i < head_1[a].childNodes.length; i++){
						nuevo_head.appendChild(head_1[a].childNodes[i])
					}
					head_1[a].parentNode.insertBefore(nuevo_head,head_1[a])
					erase.push(head_1[a])
				}
			for(var a = 0; a < erase.length; a++){
				if(erase[a].parentNode)
					erase[a].parentNode.removeChild(erase[a])
			}
			for(var a = head_1.length-1; a >= 0; a--)
				delete head_1[a]
			for(var a = head_2.length-1; a >= 0; a--)
				delete head_2[a]
			for(var a = head_3.length-1; a >= 0; a--)
				delete head_3[a]
			for(var a = head_4.length-1; a >= 0; a--)
				delete head_4[a]
			for(var a = head_5.length-1; a >= 0; a--)
				delete head_5[a]
			var nuevo_head = document.createElement('h1');
			nuevo_head_text = rumoslide.obtenTexto(document.getElementsByTagName('title')[0]);
			nuevo_head.appendChild(document.createTextNode(nuevo_head_text))
			document.body.insertBefore(nuevo_head,document.body.firstChild)
			recogeElements();
		}else{
			meta = document.getElementsByTagName('meta');
			for(var a = 0; a < meta.length; a++){
				if(meta[a].getAttribute('name') == 'author')
					author = meta[a].getAttribute('content');
			} 
			rumoslide.bodyId(identificador);
			var citas = document.getElementsByTagName('q');
			for(var i = 0; i < citas.length; i++) {
				if(citas[i].getAttribute('cite')){
					var referencia = citas[i].getAttribute('cite');
					var enlaceRef = document.createElement('a');
					enlaceRef.appendChild(document.createTextNode(referencia));
					enlaceRef.setAttribute('href',referencia);
					citas[i].appendChild(enlaceRef);
				}
			}		
		}
	},
	slideInicial: function() {
		var ancla = location.href;
		if(ancla.indexOf('#slide') > -1) {
			ancla = ancla.substring(ancla.indexOf('#slide')+6, ancla.length);
		}
		if((ancla - 1) >= 0 && (ancla - 1) < total){
			previo = ancla - 2;
			rumoslide.gotoSlide((ancla - 1),'all');
		}else if((ancla - 1) >= total) {
			previo = ancla -1;
			rumoslide.gotoSlide(total - 1,'all');
		}
	},
	teclado: function(event){
		var key;
		if (!event)
		  var event = window.event;
		if (window.event)
		   key = window.event.keyCode;
		else if (event.which)
		   key = event.which;
		else
		   return true;
		if (!key)
		   return true;
		if (key == 17 && !document.getElementById('fondo')){ // control
			if(ctrl)
				ctrl = false;
			else
				ctrl = true;
		}
		// start automatic presentation
		if(keys['play'].contains(key) && !document.getElementById('fondo') && actual < total-1){
			play = true;
			setTimeout(rumoslide.avanza,(velocidad * 1000));
			document.getElementById('enl_play').style.display = 'none';
			document.getElementById('enl_stop').style.display = '';
			if(play){
				auto =  setInterval(rumoslide.avanza,(velocidad * 1000));
				//setTimeout(rumoslide.avanza,(velocidad * 1000));
			}	
		}
		// stop automatic presentation
		if(keys['stop'].contains(key) && !document.getElementById('fondo')){
			if(auto)
				clearInterval(auto)
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
			play = false;
		}
		// create new window in order to browse an URL
		if(keys['newWindow'].contains(key) && !document.getElementById('fondo')) {
			rumoslide.muestraObject('');
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
			return false;
		}
		// toggle alert class of body element
		if (keys['alerta'].contains(key) && !document.getElementById('fondo') && !document.getElementById('indice') && !document.getElementById('ventana')) {
			rumoslide.bodyClass('alerta');
		}
		// toggle Alt+Num class of body element
		if (keys['toggleAltNumClass'].contains(key) && !document.getElementById('fondo')) {
			if(document.getElementById('indice'))
				rumoslide.ocultaIndice()
			if(document.getElementById('ventana')){
				if(document.getElementById('object'))
					rumoslide.ocultaObject();
				if(document.getElementById('img'))
					rumoslide.ocultaImagen()
			}
			if( key < 98 )
				rumoslide.bodyClass('alt' + (key - 48));
			else
				rumoslide.bodyClass('alt' + (key - 96));
		}
		// go to end
		if (keys['goToEnd'].contains(key) && !document.getElementById('fondo')){
			rumoslide.gotoSlide(total-1, 'all');
			var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
			for (var i = 0; i < elementos.length; i++)
				elementos[i].className = elementos[i].className.replace('hide','show')
			anterior = actual;
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
		}
		// go to start
		if(keys['goToStart'].contains(key) && !document.getElementById('fondo')){
			rumoslide.gotoSlide(0,'all');
			anterior = actual;
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
		}
		// prevSlide
		if(keys['prevSlide'].contains(key)){
			if(!document.getElementById('fondo')) {
				if(actual - 1 >= 0 ){
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'show']);
					for (var i = 0; i < elementos.length; i++)
					elementos[i].className = elementos[i].className.replace('show','hide') 
					rumoslide.gotoSlide(actual - 1,'all');
					anterior = actual;
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
				}
			}else{
				if(document.getElementById('indice')){
					if(ind_actual > 0) {
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[ind_actual-1].focus();
						rumoslide.modificaNavGraf(ind_actual-1,true);
						document.getElementById('newlinkimg_' + (ind_actual-1)).src = 'js/img/current.gif';
						ind_actual--;
					}else{
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[total - 1].focus();
						rumoslide.modificaNavGraf(total - 1,true);
						document.getElementById('newlinkimg_' + (total - 1)).src = 'js/img/current.gif';
						ind_actual = total - 1;
					}
				}
			}
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			
			document.getElementById('enl_stop').style.display = 'none';
			
			return false;	  
		}
		// prevStep
		if(keys['prevStep'].contains(key) && !ctrl){
			if(!document.getElementById('fondo')) {
				rumoslide.retrocede();
			}else{
				if(document.getElementById('indice')){
					if(ind_actual > 0) {
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[ind_actual - 1].focus();
						rumoslide.modificaNavGraf(ind_actual-1,true);
						document.getElementById('newlinkimg_' + (ind_actual - 1)).src = 'js/img/current.gif';
						ind_actual--;
					}else{
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[total - 1].focus();
						rumoslide.modificaNavGraf(total - 1,true);
						document.getElementById('newlinkimg_' + (total - 1)).src = 'js/img/current.gif';
						ind_actual = total - 1;
					}
				}
			}
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
			return false;	  
		}
		// nextSlide
		if(keys['nextSlide'].contains(key)){
			if(!document.getElementById('fondo')) {
				if(actual+1 < total){
					if(!dual)
						rumoslide.gotoSlide(actual + 1,'all');
					else
						rumoslide.gotoSlide(actual + 1);
					anterior = actual;
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
				}
			}else{
				if(document.getElementById('indice')){
					if(ind_actual < total-1) {
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[ind_actual+1].focus();
						rumoslide.modificaNavGraf(ind_actual,true);
						document.getElementById('newlinkimg_' + (ind_actual + 1)).src = 'js/img/current.gif';
						ind_actual++;
					}else{
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[0].focus();
						rumoslide.modificaNavGraf(0,true);
						document.getElementById('newlinkimg_' + 0).src = 'js/img/current.gif';
						ind_actual = 0;
					}
				}
			}
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
			return false;	  
		}
		// nextStep
		if(keys['nextStep'].contains(key) && !ctrl) {
			if(!document.getElementById('fondo')) {
				rumoslide.avanza();
			}else{
				if(key == 40 && document.getElementById('indice')){
					if(ind_actual < total-1) {
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[ind_actual+1].focus();
						rumoslide.modificaNavGraf(ind_actual,true);
						document.getElementById('newlinkimg_' + (ind_actual + 1)).src = 'js/img/current.gif';
						ind_actual++;
					}else{
						rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[0].focus();
						rumoslide.modificaNavGraf(0,true);
						document.getElementById('newlinkimg_' + 0).src = 'js/img/current.gif';
						ind_actual = 0;
					}
				}
			}
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';	
			document.getElementById('enl_stop').style.display = 'none';
			return false;	  
		}
		if (keys['enter'].contains(key)){ // intro
			if(document.getElementById('ventana_input') && document.getElementById('object')){
				if(ventana_input.value.substring(0,7) != 'http://'){
					if(ventana_input.value.indexOf('ejercicio') == -1 && ventana_input.value.indexOf('sample') == -1){
						ventana_input.value = 'http://' + ventana_input.value
					}else{
						if(ventana_input.value.indexOf('sample') > -1)
							ventana_input.value = location.href.substring(0,location.href.indexOf('cursoCSS')) + 'samples/' + ventana_input.value + '.html'
						else
							ventana_input.value = location.href.substring(0,location.href.indexOf('cursoCSS')) + 'ejercicios/' + ventana_input.value + '.html'
					}
				}
				document.getElementById('object').setAttribute('src',ventana_input.value);
			}
		}
		if (keys['escape'].contains(key)){ // escape (esc)
			if(document.getElementById('indice'))
				rumoslide.ocultaIndice()
			if(document.getElementById('ventana')){
				if(document.getElementById('object'))
					rumoslide.ocultaObject();
				if(document.getElementById('img'))
					rumoslide.ocultaImagen()
			}
			rumoslide.modificaNavGraf(actual);
			document.getElementById('newlinkimg_' + actual).src = 'js/img/current.gif';
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			
			document.getElementById('enl_stop').style.display = 'none';
			
			return false;	  
		}
		// index
		if (keys['index'].contains(key) && !document.getElementById('ventana_input')){
			if(!document.getElementById('indice'))
				rumoslide.muestraIndice()
			else
				rumoslide.ocultaIndice()
			if(play)
				play = false;
			if(auto)
				clearInterval(auto);
			document.getElementById('enl_play').style.display = '';
			document.getElementById('enl_stop').style.display = 'none';
			return false;	  
		}
		if (keys['zero'].contains(key)){ // cero
			rumoslide.escala();
			rumoslide.reText();
			rumoslide.verticalCenter(true);
		}
		if (keys['plus'].contains(key)){ // signo +
			if(!play){
				rumoslide.escala(3)
				rumoslide.verticalCenter(true);
			}else if(velocidad > 0){
					clearInterval(auto);
					velocidad--;
					auto =  setInterval(rumoslide.avanza,(velocidad * 1000));
			}	
		}
		if (keys['minus'].contains(key)){ // signo -
			if(!play){
				rumoslide.escala(-3);
				rumoslide.verticalCenter(true);
			}else{
					clearInterval(auto);
					velocidad++;
					auto =  setInterval(rumoslide.avanza,(velocidad * 1000));
			}	
		}
		if(keys['timer'].contains(key)){ // timer...
			rumoslide.actTimer();
		}
		return true;
	},
	cleanDiv: function(tag,exc) {
	//	var elements = window.content.document.getElementsByTagName(tag);
		var elements = document.getElementsByTagName(tag);
		var nuevos = new Array;
		for(var a = 0; a < elements.length; a++){
			if(elements[a].className.indexOf(exc) == -1 && elements[a].className.indexOf('notas') == -1)
				nuevos.push(elements[a])
		}
		for(var a = 0; a < nuevos.length; a++){
			if(nuevos[a].childNodes.length == 0){
				if(nuevos[a].parentNode)
					nuevos[a].parentNode.removeChild(nuevos[a])
			}else{
				if(nuevos[a].childNodes){
					var i = 0;
					while(nuevos[a].childNodes[i]) {
						if(nuevos[a].parentNode)
							nuevos[a].parentNode.insertBefore(nuevos[a].childNodes[i],nuevos[a])
					}
					if(nuevos[a].parentNode)
						nuevos[a].parentNode.removeChild(nuevos[a])
					rumoslide.cleanDiv(tag,exc);
				}else{
					return false;
				}
			}
		}
	},
	cleanEmpty: function() {
		var elementos = new Array('a','span','em','strong','abbr','acronym','q','div','h1','h2','h3','h4','h5','h6','p','li','ul','ol','blockquote','cite','br','hr');
		for(var i = 0; i < elementos.length; i++){
			var elements = document.getElementsByTagName(elementos[i]);
			var nuevos = new Array;
			for(var a = 0; a < elements.length; a++){
				if(elements[a].childNodes.length == 1){
					var cadena = elements[a].innerHTML.replace(/ /g,'');
					cadena = cadena.replace(/&nbsp;/g,'');
					if(cadena.length == 0){
						nuevos.push(elements[a])
					}
				}
				if(elements[a].id.indexOf('fechaSlide') == -1 && elements[a].className.indexOf('rumoslide') == -1 && elements[a].childNodes.length == 0)
					nuevos.push(elements[a])
			}
			for(var a = 0; a < nuevos.length; a++){
				if(nuevos[a].parentNode)
					nuevos[a].parentNode.removeChild(nuevos[a])
			}
		}
		rumoslide.cleanDiv('div','rumoslide');
	},
	getElementsByClassName: function(oElm, strTagName, oClassNames){
		var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
		var arrReturnElements = new Array();
		var arrRegExpClassNames = new Array();
		if(typeof oClassNames == "object"){
			for(var i = 0; i < oClassNames.length; i++){
				arrRegExpClassNames.push(new RegExp("(^|\\s)" + oClassNames[i].replace(/\-/g, "\\-") + "(\\s|$)"));
			}
		}
		else{
			arrRegExpClassNames.push(new RegExp("(^|\\s)" + oClassNames.replace(/\-/g, "\\-") + "(\\s|$)"));
		}
		var oElement;
		var bMatchesAll;
		for(var j=0; j<arrElements.length; j++){
			oElement = arrElements[j];
			bMatchesAll = true;
			for(var k=0; k<arrRegExpClassNames.length; k++){
				if(!arrRegExpClassNames[k].test(oElement.className)){
					bMatchesAll = false;
					break;                      
				}
			}
			if(bMatchesAll){
				arrReturnElements.push(oElement);
			}
		}
		return (arrReturnElements)
	},
	avanza: function() {
		if(!dual){
			var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
			if(elementos.length){
				rumoslide.imgChild(elementos[0],10)
				rumoslide.degrada(elementos,1)
				elementos[0].className = elementos[0].className.replace('hide','show');
				elementos[0].style.color = tonos[0];
				if(elementos[0].style.visibility = 'hidden')
					elementos[0].style.visibility = '';
				rumoslide.mueveScroll();
			}else{
				if(actual + 1 < total ) {
					if(slides[actual + 1].className.indexOf('noincremental') != -1 || document.getElementsByTagName('body')[0].className.indexOf('noincremental') != -1){
						rumoslide.gotoSlide(actual + 1,'all')
					}else{
						rumoslide.gotoSlide(actual + 1)
					}
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + (actual-1) , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
					anterior = actual;
					if(slides[actual].className.indexOf('noincremental') == -1){
						rumoslide.degrada(elementos,1)
					}else{
						var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
						for (var i = 0; i < elementos.length; i++){
							elementos[i].className = elementos[i].className.replace('hide','show')
							elementos[i].style.color = tonos[0];
							if(elementos[i].style.visibility = 'hidden')
								elementos[i].style.visibility = '';
						}
					}
				}
				if(actual + 1 == total){
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
					for (var i = 0; i < elementos.length; i++){
						elementos[i].className = elementos[i].className.replace('hide','show');
						rumoslide.imgChild(elementos[i],10)
					}
					play = false;
				}
			}
		}else{
			var elementos = rumoslide.getElementsByClassName(rumoslide.getElementsByClassName(document.getElementById('current'), 'div', 'content')[0], '*', 'cont_' + actual);
			item_actual++;
			if(elementos[item_actual] && elementos[item_actual].className.indexOf('noincremental') != -1)
				item_actual++;
			if(item_actual < elementos.length){
				if(slides[actual].className.indexOf('noincremental') == -1){
					rumoslide.degradaDual(elementos,item_actual);
					rumoslide.mueveScroll();
				}else{
					item_actual = 0;
					if(slides[actual + 1]){
						if(slides[actual + 1].className.indexOf('noincremental') != -1){
							rumoslide.gotoSlide(actual + 1,'all')
						}else{
							rumoslide.gotoSlide(actual + 1)
						}
					}
				}
			}else{
				if(slides[actual + 1]){
					if(slides[actual + 1].className.indexOf('noincremental') != -1){
						rumoslide.gotoSlide(actual + 1,'all')
					}else{
						rumoslide.gotoSlide(actual + 1)
					}
				}
			}
		}
		var enlac = document.getElementById('current').getElementsByTagName('a');
		for(var i = 0; i < enlac.length; i++){
				enlac[i].style.color = enlac[i].parentNode.style.color
		}
		clearInterval(acc_vertical);
	},
	retrocede: function() {
		if(!dual){
			var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'show'])
			if(slides[actual].className.indexOf('noincremental') == -1 &&( ((nav.indexOf('msie') != -1 && elementos.length > 1) || (nav.indexOf('msie') == -1 && elementos.length)) && actual < total-1)){
				if(elementos[elementos.length-1])
					elementos[elementos.length-1].className = elementos[elementos.length-1].className.replace('show','hide');
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide'])
				rumoslide.degrada(elementos,0);
				rumoslide.mueveScroll();
			}else{
				if(slides[actual].className.indexOf('noincremental') == -1 && nav.indexOf('msie') != -1){
					rumoslide.mueveScroll();
					if(elementos[elementos.length-1])
						elementos[elementos.length-1].className = elementos[elementos.length-1].className.replace('show','hide');
				}
				if(actual - 1 >= 0){
					if(elementos[elementos.length-1] && elementos[elementos.length-1].className.indexOf('actual') != -1)
						elementos[elementos.length-1].className = elementos[elementos.length-1].className.replace(' actual','')
					rumoslide.gotoSlide(actual - 1,'all');
					anterior = actual;
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
				}
			}
		}else{
			var elementos = rumoslide.getElementsByClassName(rumoslide.getElementsByClassName(document.getElementById('current'), 'div', 'content')[0], '*', 'cont_' + actual);
			if(item_actual > 0){
				item_actual--;
				if(elementos[item_actual] && elementos[item_actual].className.indexOf('noincremental') != -1)
					item_actual--;
				if(slides[actual].className.indexOf('noincremental') == -1){
					if(item_actual >= 0){
						rumoslide.degradaDual(elementos,item_actual);
						rumoslide.mueveScroll();
					}else{
						if(actual - 1 >= 0){
							rumoslide.gotoSlide(actual - 1,'all')
						}
					}
				}else{
					if(actual - 1 >= 0){
						rumoslide.gotoSlide(actual - 1,'all')
					}
				}
			}else{
				if(actual - 1 >= 0){
					rumoslide.gotoSlide(actual - 1,'all')
				}
			}
		}
	
		var enlac = document.getElementById('current').getElementsByTagName('a');
		for(var i = 0; i < enlac.length; i++)
			enlac[i].style.color = rumoslide.getStyleElement(enlac[i].parentNode,'color')
		clearInterval(acc_vertical);
	},
	imgChild: function(elemento,opacidad){
		var i=0;
		var imagenes = rumoslide.getElementsByClassName(elemento, 'img', 'bio_img')
		for(var i = 0; i < imagenes.length; i++){
				imagenes[i].style.MozOpacity = opacidad/10;
				imagenes[i].style.opacity = opacidad/10;
				rumoslide.imgChild(imagenes[i],opacidad)
		}
	},
	degrada: function(elemento,origen){
		for(var i = 0; i < tonos.length; i++){
			if(elemento[origen + i]){
				elemento[origen + i].style.visibility = '';
				elemento[origen + i].style.color = tonos[i+1];
				rumoslide.imgChild(elemento[origen + i],3*((tonos.length-i-1)/tonos.length));
			}
		}
		for(var i = tonos.length-1; i < elemento.length; i++){
			if(elemento[origen + i]){
				elemento[origen + i].style.visibility = 'hidden';
				rumoslide.imgChild(elemento[origen + i],0);
			}
		}
		var noincrementales = rumoslide.getElementsByClassName(document.getElementById('current'), '*', 'noincremental')
		for(var i = 0; i < noincrementales.length; i++){
			noincrementales[i].style.color = tonos[0];
			rumoslide.imgChild(noincrementales[i],10);
			if(noincrementales[i].style.visibility = 'hidden')
				noincrementales[i].style.visibility = '';
		}
	},
	degradaDual: function(elemento,origen){
		var item_prev = rumoslide.getElementsByClassName(document, '*', 'item_actual')
		if(item_prev[0]){
			item_prev[0].className = item_prev[0].className.replace('item_actual','')
		}
		if(elemento[origen]){
			if(elemento[origen].className)
				elemento[origen].className += ' item_actual'
			else
				elemento[origen].className = 'item_actual'
		}
		for(var i = tonos.length; i < elemento.length; i++){
			if(elemento[origen + i]){
				elemento[origen + i].style.visibility = 'hidden';
			}
		}
		for(var i = 0; i < tonos.length; i++){
			if(elemento[origen - i]){
				rumoslide.imgChild(elemento[origen - i],3*((tonos.length-i)/tonos.length));
				elemento[origen - i].style.visibility = '';
				elemento[origen - i].style.color = tonos[i];
			}
		}
		for(var i = tonos.length; elemento[origen - i]; i++){
			rumoslide.imgChild(elemento[origen - i],3*((tonos.length-1)/tonos.length));
			elemento[origen - i].style.visibility = '';
			elemento[origen - i].style.color = tonos[tonos.length-1];
		}
		var noincrementales = rumoslide.getElementsByClassName(document.getElementById('current'), '*', 'noincremental')
		for(var i = 0; i < noincrementales.length; i++){
			rumoslide.imgChild(noincrementales[i],10);
			noincrementales[i].style.color = tonos[0];
			if(noincrementales[i].style.visibility = 'hidden')
				noincrementales[i].style.visibility = '';
		}
		if(elemento[origen])
			rumoslide.imgChild(elemento[origen],10);
		for(var i = 1; i < tonos.length; i++){
			if(elemento[origen + i]){
				rumoslide.imgChild(elemento[origen + i],3*((tonos.length-i)/tonos.length));
				elemento[origen + i].style.visibility = '';
				elemento[origen + i].style.color = tonos[i];
			}
		}
	},
	hijos: function(element,clase){
		var i=0;
		while(element.childNodes[i]) {
			var hijo = element.childNodes[i];
			if(document.getElementsByTagName('body')[0].className.indexOf('noincremental')== -1 && hijo.nodeType == 1 && hijo.className.indexOf('noincremental') == -1){
				if(nav.indexOf('msie') != -1)
					var ini = 0;
				else
					var ini = 1;
				if(i > ini ){
					if(hijo.className.indexOf('incremental') != -1 || (hijo.className.indexOf(clase) == -1 && hijo.className.indexOf('noincremental') == -1 && hijo.tagName.toLowerCase() != 'img' &&  hijo.tagName.toLowerCase() != 'a' &&  hijo.tagName.toLowerCase() != 'strong' &&  hijo.tagName.toLowerCase() != 'em' &&  hijo.tagName.toLowerCase() != 'abbr' &&  hijo.tagName.toLowerCase() != 'acronym'   &&  hijo.tagName.toLowerCase() != 'span'   &&  hijo.tagName.toLowerCase() != 'cite' &&  hijo.tagName.toLowerCase() != 'code' &&  hijo.tagName.toLowerCase() != 'kbd' &&  hijo.tagName.toLowerCase() != 'th' &&  hijo.tagName.toLowerCase() != 'td')){
						if(hijo.className)
							hijo.className += ' ' + clase;
						else
							hijo.className = clase;
					}
				}
				rumoslide.hijos(hijo,clase)
			}
			i++;
		}
	},
	creaFoot: function() {
		var foot = document.createElement('div');
		foot.id = 'foot';
		var navegacion = document.createElement('ul');
		navegacion.id = 'navegacion';
		var item_indice = document.createElement('li');
		item_indice.id = 'li_indice';
		var contenedor = document.createElement('span');
		var enl_indice = document.createElement('a');
		enl_indice.id = 'enl_indice';
		enl_indice.className = 'cre';
		enl_indice.appendChild(document.createTextNode(textos[lang][0]))
		enl_indice.setAttribute('href', '#');
		enl_indice.onclick = function() {
			rumoslide.muestraIndice();
			return false;
		}
		contenedor.appendChild(enl_indice);
		item_indice.appendChild(contenedor);
		var item_anterior = document.createElement('li');
		item_anterior.id = 'li_anterior';
		var contenedor = document.createElement('span');
		var enl_anterior = document.createElement('a');
		enl_anterior.id = 'enl_anterior';
		enl_anterior.className = 'cre';
		enl_anterior_abbr = document.createElement('abbr');
		enl_anterior_abbr.setAttribute('title',textos[lang][4]);
		enl_anterior_abbr.appendChild(document.createTextNode('<<'))
		enl_anterior.appendChild(enl_anterior_abbr)
		enl_anterior.setAttribute('href', '#');
		enl_anterior.onclick = function() {
			if(actual >= 1)
				rumoslide.gotoSlide(actual-1, 'all')
			return false;
		}
		contenedor.appendChild(enl_anterior);
		item_anterior.appendChild(contenedor);
		var item_contol = document.createElement('li');
		item_contol.id = 'li_control';
		var contenedor = document.createElement('span');
		var enl_play = document.createElement('a');
		enl_play.id = 'enl_play';
		enl_play.className = 'cre';
		enl_play.appendChild(document.createTextNode('play'));
		enl_play.setAttribute('href', '#');
		enl_play.onclick = function() {
			if((actual+1) == total)
				rumoslide.gotoSlide(0)
			if(!document.getElementById('fondo') && actual < total-1){
				play = true;
				setTimeout(rumoslide.avanza,(velocidad * 1000));
				document.getElementById('enl_play').style.display = 'none';	
				document.getElementById('enl_stop').style.display = '';
			}
			return false;
		}
		contenedor.appendChild(enl_play);
		item_contol.appendChild(contenedor);
	
		var contenedor = document.createElement('span');
	
		var enl_stop= document.createElement('a');
		enl_stop.id = 'enl_stop';
		enl_stop.className = 'cre';
		enl_stop.appendChild(document.createTextNode('stop'));
		enl_stop.setAttribute('href', '#');
		enl_stop.onclick = function() {
			if(auto){
				clearInterval(auto)
				play = false;
				document.getElementById('enl_play').style.display = '';
				document.getElementById('enl_stop').style.display = 'none';
			}
			return false;
		}
		contenedor.appendChild(enl_stop);
		item_contol.appendChild(contenedor);
		enl_stop.style.display = 'none';
	
		var item_posterior = document.createElement('li');
		item_posterior.id = 'li_posterior';
		var contenedor = document.createElement('span');
		var enl_posterior = document.createElement('a');
		enl_posterior.id = 'enl_posterior';	
		enl_posterior.className = 'cre';
		enl_posterior_abbr = document.createElement('abbr');
		enl_posterior_abbr.setAttribute('title',textos[lang][3]);
		enl_posterior_abbr.appendChild(document.createTextNode('>>'))
		enl_posterior.appendChild(enl_posterior_abbr)
		enl_posterior.setAttribute('href', '#');
		enl_posterior.onclick = function() {
			if(actual < total-1)
				rumoslide.gotoSlide(actual+1, 'all')
			return false;
		}
		contenedor.appendChild(enl_posterior);
		item_posterior.appendChild(contenedor);
		var item_actual = document.createElement('li');
		var contenedor = document.createElement('span');
		contenedor.id = 'span_actual';
		item_actual.id = 'actual';
		contenedor.appendChild(document.createTextNode((actual+1) + ' / ' + total));
		item_actual.appendChild(contenedor);
		navegacion.appendChild(item_indice);
		navegacion.appendChild(item_anterior);
		navegacion.appendChild(item_contol);
		navegacion.appendChild(item_posterior);
		navegacion.appendChild(item_actual);
		foot.appendChild(navegacion);
		if(nav.indexOf('msie 6') != -1) {
			foot.style.position = 'absolute';
		}
		document.body.appendChild(foot);
		var ancla = location.href;
		if(ancla.indexOf('#slide') == -1) {
			var clase = 'first vcenter cont_0';
			document.getElementById('foot').className = clase;
		}
		rumoslide.creaCorners(foot, 'foot');
	},
	obtenTexto: function(element) {
		if (element.nodeType == 3) return element.nodeValue;
		if(element.tagName.toLowerCase() == 'img') {
			var alternativas = '';
			if(element.getAttribute('alt')) alternativas += element.getAttribute('alt');
			return alternativas;
		}
		var texto = new Array(),i=0;
		while(element.childNodes[i]) {
			texto[texto.length] = rumoslide.obtenTexto(element.childNodes[i]);
			i++;
		}
		return texto.join('');
	},
	obtenTextoNoClass: function(element,noclase) {
		if (element.nodeType == 3) return element.nodeValue;
		var texto = new Array(),i=0;
		var texto2 =  new Array();
		while(element.childNodes[i]) {
			if(element.childNodes[i].className && element.childNodes[i].className.indexOf(noclase) != -1)
				texto2[texto2.length] = rumoslide.obtenTextoNoClass(element.childNodes[i]);
			else
				texto[texto.length] = rumoslide.obtenTextoNoClass(element.childNodes[i]);
			i++;
		}
		return texto.join('');
	},
	longContenido: function(elemento,clase){
		texto = rumoslide.obtenTextoNoClass(elemento,clase);
		texto = texto.replace(/\n/g, '')
		texto = texto.replace(/\t/g, '')
		return texto.length;
	},
	indice: function(){
		var ind = new Array();
		var tit = document.createElement('h2')
		tit.appendChild(document.createTextNode(rumoslide.obtenTexto(head_1[0])));
		ind[0] = 'Inicio';
		var elem_indice = rumoslide.getElementsByClassName(document, 'h2', 'part');
		for (var i=1; i < elem_indice.length+1; i++){
			ind[i] = rumoslide.obtenTexto(elem_indice[i-1]);
		}
		var lista = document.createElement('ol');
		var contador = 0;
		for(var i = 0; i < ind.length; i++){
			var lista_item = document.createElement('li');
			var a = document.createElement("a");
			a.id = 'en' + contador;
			lista_item.id = 'li_' + a.id;
			a.className = 'enl_ind en' + i;
			a.setAttribute('href', '#');
			a.onclick = function() {
				rumoslide.gotoSlide(parseInt(this.id.replace('en','')), 'all')
				return false;
			}
			a.appendChild(document.createTextNode(ind[i]));
			a_pag = document.createElement('span');
			a_pag.className = 'page'
			var a_pag_abbr = document.createElement('abbr');
			a_pag_abbr.setAttribute('title',textos[lang][5]);
			a_pag_abbr.appendChild(document.createTextNode(textos[lang][5].substring(0,1) + '.'));
			a_pag.appendChild(a_pag_abbr);
			a_pag.appendChild(document.createTextNode(' ' + (contador+1)));
			lista_item.appendChild(a);
			lista_item.appendChild(a_pag);
			var subpart = rumoslide.getElementsByClassName(document, 'h3', 'subpart_'+i);
			if(subpart.length){
				var sub_lista = document.createElement('ul');
				for(var cont = 0; cont < subpart.length; cont++){
					var sub_lista_item = document.createElement('li');
					var sub_a = document.createElement("a");
					sub_a.className = 'enl_ind en' + (i + cont);
					sub_a.id = 'en' + (contador + 1);
					sub_lista_item.id = 'li_' + sub_a.id;
					sub_a.setAttribute('href', '#');
					sub_a.onclick = function() {
						rumoslide.gotoSlide(parseInt(this.id.replace('en','')), 'all')
						return false;
					}
					sub_a.appendChild(document.createTextNode(rumoslide.obtenTexto(subpart[cont])));
					sub_lista_item.appendChild(sub_a);
					sub_lista.appendChild(sub_lista_item);
					contador++;
				}
				lista_item.appendChild(sub_lista);
			}
			contador++;
			lista.appendChild(lista_item);
		}
		cont_indice.appendChild(tit);
		cont_indice.appendChild(lista);
	},
	muestraObject: function(destino){
		rumoslide.muestraFondo();
		ventana.style.left = '10%';
		ventana.style.height = '80%';
		ventana.style.width = '80%';
		ventana.style.top = '5%';
		ventana.appendChild(object);
		document.body.appendChild(ventana);
		ventana_input.style.display = 'block';
		ventana_input.focus();
	//	object.setAttribute('data',destino);
	//	object.setAttribute('type','text/html');
		object.setAttribute('src',destino);
		ventana_input.value = destino;
//		if(destino == '')
	//		document.getElementById('ventana_input').focus()
	},
	ocultaObject: function() {
		object.setAttribute('src','');
		ventana_p_title.childNodes[0].nodeValue = '';
		object.parentNode.removeChild(object);
		document.body.removeChild(ventana);
		rumoslide.ocultaFondo();
	},
	muestraImagen: function(destino){
		rumoslide.muestraFondo();
		ventana.appendChild(imagen);
		document.body.appendChild(ventana);
		ventana_input.style.display = 'none';
		imagen.setAttribute('src',destino);
		imagen.style.width = 'auto';
		imagen.style.height = 'auto';
		ventana.style.left = ((document.body.offsetWidth - imagen.offsetWidth)/2)-50 + 'px';
		ventana.style.width = 100 + imagen.offsetWidth + 'px';
		ventana.style.top = ((document.body.offsetHeight - imagen.offsetHeight)/2) + 'px';
		ventana.style.height = imagen.offsetHeight + 'px';
		ventana_input.value = '';
		rumoslide.ajuste();
	},
	ajuste: function() {
		var repeat = 'rumoslide.ajuste()';
		var jarl;
		ventana.style.left = ((document.body.offsetWidth - imagen.offsetWidth)/2)-50 + 'px';
		ventana.style.width = 100 + imagen.offsetWidth + 'px';
		ventana.style.top = ((document.body.offsetHeight - imagen.offsetHeight)/2) + 'px';
		ventana.style.height = imagen.offsetHeight + 'px';
		if(imagen.offsetHeight == 0 || (nav.indexOf('msie') != -1 && imagen.offsetHeight < 32)){
			jarl = setTimeout(repeat,100);
		}else{
			clearInterval(jarl);
		}
	},
	ocultaImagen: function() {
		imagen.setAttribute('src','');
		ventana_p_title.childNodes[0].nodeValue = '';
		imagen.parentNode.removeChild(imagen);
		document.body.removeChild(ventana);
		rumoslide.ocultaFondo()
	},
	newEnlaces: function() {
		for(var i = 0; i < enlaces.length; i++){
			var destino = enlaces[i].href;
			if(enlaces[i].className.indexOf('rumoslide') == -1){
				enlaces[i].onclick = function() {
					if(this.parentNode.className.indexOf('hide') == -1){
						if(this.getAttribute('href').indexOf('#') != 0){
							if(nav.indexOf('msie') == -1 || (nav.indexOf('msie') != -1 && this.getAttribute('href').indexOf(localizacion) == -1)) {
								var tipo = this.getAttribute('href').substring(this.getAttribute('href').length-3, this.getAttribute('href').length);
								if(tipo != 'png' && tipo != 'jpg' && tipo != 'gif')	{
									rumoslide.muestraObject(this.getAttribute('href'));
								}else{
									rumoslide.muestraImagen(this.getAttribute('href'))
								}
								if(this.getAttribute('title')) {
									var titulo = this.getAttribute('title');
									ventana_p_title.childNodes[0].nodeValue = titulo;
									ventana_p_title.style.display = 'block';
								}else{
									ventana_p_title.style.display = 'none'
								}
							}else{
								var destino = this.getAttribute('href').substring(this.getAttribute('href').indexOf('#')+6, this.getAttribute('href').length)
								rumoslide.gotoSlide(destino-1,'all');
							}
						}else{
							var destino = this.getAttribute('href').substring(this.getAttribute('href').indexOf('#')+6, this.getAttribute('href').length)
							rumoslide.gotoSlide(destino-1,'all');
						}
						if(auto){
							clearInterval(auto)
							play = false;
							document.getElementById('enl_play').style.display = '';
							document.getElementById('enl_stop').style.display = 'none';
						}
					}
					return false;
				}
			}else{
				if(enlaces[i].className.indexOf('false'))
					enlaces[i].onclick = function() {
					}
			}
		}
		var enlac = document.getElementsByTagName('a');
		for(var i = 0; i < enlac.length; i++){
			enlac[i].style.color = tonos[0];
			if(enlac[i].style.display == 'none')
				enlac[i].style.display = '';
		}
	},
	creaNavGraf: function() {
		var nav_graf = document.createElement('ul');
		nav_graf.id = 'nav_graf';
		for(var i = 0; i < total; i++){
			var newitem = document.createElement('li');
			newitem.className = 'nav_graf_' + i;
			var newlink = document.createElement('a');
			newlink.className = 'cre';
			newlink.setAttribute('href','#');
			var newlinktext = document.createTextNode(i + 1);
			newlink.appendChild(newlinktext);
			newlink.onclick = function() {
				var to = this.childNodes[0].nodeValue - 1;
				rumoslide.gotoSlide(to,'all')
			}
			newlinkimg = document.createElement('img');
			if(i == 0)
				newlinkimg.src = 'js/img/current.gif';
			else
				newlinkimg.src = 'js/img/no_visited.gif';
			newlinkimg.setAttribute('alt', textos[lang][5] + ' ' + (i+1) )
			newlinkimg.id = 'newlinkimg_' + i;
			newlinkimg.className = 'navtoplink';
			if(i == 0)
				newlinkimg.className += ' current';
			newlinkimg.onclick = function(){
				var to = parseInt(this.id.replace('newlinkimg_',''));
				rumoslide.gotoSlide(to,'all')
			}
			newitem.appendChild(newlink);
			newitem.appendChild(newlinkimg);
			nav_graf.appendChild(newitem);
		}
		var ancla = location.href;
		if(ancla.indexOf('#slide') == -1) {
			var clase = 'first vcenter cont_0';
			nav_graf.className = clase;
		}
		document.body.appendChild(nav_graf);
		if(nav.indexOf('msie 6') != -1) {
			nav_graf.style.position = 'absolute'
		}
	},
	creaScroll: function() {
		var new_scroll_vert = document.createElement('div');
		var new_scroll_horz = document.createElement('div');
		new_scroll_vert.id = 'new_scroll_vert';
		new_scroll_horz.id = 'new_scroll_horz';
		document.body.appendChild(new_scroll_vert);
		document.body.appendChild(new_scroll_horz);
		new_scroll_vert.style.top = '-' + new_scroll_vert.offsetHeight + 'px'
		new_scroll_horz.style.left = new_scroll_horz.offsetWidth + 'px'
		if(!tipo_scroll){
			new_scroll_vert.style.display = 'none';
			new_scroll_horz.style.display = 'none';
		}
	},
	mueveScroll: function() {
		var new_scroll_vert = document.getElementById('new_scroll_vert');
		var new_scroll_horz = document.getElementById('new_scroll_horz');
			if(tipo_scroll == 2) {
				var elementos_show = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'show' ]);
				if(!dual)
					var pos = elementos_show.length;
				else
					var pos = item_actual;
				if(nav.indexOf('msie') != -1) 
					pos--;
			}else {
				if(tipo_scroll == 1)
					pos = actual;
			}
			var alto_body = document.body.offsetHeight;
			var alto_head = 0;
			var alto_foot = document.getElementById('foot').offsetHeight;
			var ancho_body = document.body.offsetWidth;
			new_scroll_vert.style.visibility = 'visible';
			new_scroll_horz.style.visibility = 'visible';
			new_scroll_horz.style.top = alto_body - alto_foot - new_scroll_horz.offsetHeight + 'px';
			if(tipo_scroll == 2) {
				if(pos < cuantos){
					var posicion_vert = alto_head + (pos * ((alto_body - alto_head - alto_foot)/cuantos));
					var posicion_horz = (pos * (ancho_body/cuantos));
				}else{
					var posicion_vert = alto_head + alto_body - alto_head - alto_foot - new_scroll_vert.offsetHeight;
					var posicion_horz = ancho_body - new_scroll_horz.offsetWidth;
				}
			}else{
				if(tipo_scroll == 1){
					var posicion_vert = alto_head + (pos * ((alto_body - alto_head - alto_foot)/(slides.length-1)));
					var posicion_horz = pos * (ancho_body/(slides.length-1));
				}
			}
			final_y  = posicion_vert;
			final_x  = posicion_horz;
			var elem = document.getElementById('new_scroll_vert');
			var elem_horz = document.getElementById('new_scroll_horz');
			elem.style.top = final_y + 'px';
			elem_horz.style.left = final_x +'px';
	},
	modificaNavGraf: function(to,real) {
		var elementos = rumoslide.getElementsByClassName(document, '*', 'navtoplink');
		for (var i = 0; i <= to; i++){
			document.getElementById('newlinkimg_' + i).src = 'js/img/visited.gif';
		}
		if(!real){
			document.getElementById('newlinkimg_' + anterior).className = 'navtoplink';
			document.getElementById('newlinkimg_' + to).className += ' current';
		}
		for (var i = to+1; i < elementos.length; i++){
			document.getElementById('newlinkimg_' + i).src = 'js/img/no_visited.gif';
		}
	},
	creaSlides: function() {
		if(secciones && head_3.length == 0)
			secciones = false
		rumoslide.newEnlaces();
		total = head_1.length + head_2.length;
		if(secciones){
			total += head_3.length;
		}
		var i = 0;
		var contador = 0;
		var parcial = 0;
		var add_no_incr = '';
		while(document.body.childNodes[i]) {
			var element = document.body.childNodes[i];
			if (element.nodeType == 1){
				if(element.tagName.toLowerCase() == 'h2' || (secciones && element.tagName.toLowerCase() == 'h3'))
					contador++;
				if(element.className){
					element.className += ' cont_' + contador + add_no_incr;
				}else{
					element.className = 'cont_' + contador + add_no_incr;
				}
				var texto;
				if(secciones && element.tagName.toLowerCase() == 'h2' && contador <= total){
					var next = element.nextSibling;
					if(next && next.nextSibling){
						parcial++;
					}
				}
				if(secciones && element.tagName.toLowerCase() == 'h3'){
					element.className += ' part subpart_' + parcial;
					var contenedorb = document.createElement('span');
					contenedorb.className = 'subtitulo';
					contenedorb.appendChild(element.childNodes[0]);
					element.appendChild(contenedorb)
				}
			}
			i++;
		}
		for(var i = 0; i < head_2.length; i++)
			head_2[i].className += ' part';
		total = contador+1;
		var pg = 0;
		for(var i = 0; i < total; i++) {
			var new_slide = document.createElement('section');
			new_slide.className = 'slide';
//			if(i % 2 == 0){
//				var new_page = document.createElement('div');
//				new_page.className = 'page' + ' ind_' + i;
//				document.body.appendChild(new_page);
//			}
//			new_page.appendChild(new_slide);
			document.body.appendChild(new_slide);
		}
		slides = rumoslide.getElementsByClassName(document, 'section', 'slide');
		slides[0].className = 'slide first';
		slides[0].id = 'current';
		//slides[0].parentNode.id = 'page_current';
		slides[1].id = 'next-current';
		slides[slides.length-1].className = 'slide last';
		var parcial = 0;
		for(var a = 0; a < slides.length; a++) {
			contenedores[a] = document.createElement('div');
			contenedores[a].className = 'content';
			slides[a].appendChild(contenedores[a]);
			var contenidos = rumoslide.getElementsByClassName(document, '*', 'cont_' + a);
			var texto;
			for(var i = 0; i < contenidos.length; i++) {
				if(contenidos[i].className == 'notas cont_' + a){
					slides[a].appendChild(contenidos[i]);
				}else{
					if(secciones && contenidos[i].tagName.toLowerCase() == 'h2'){
						texto = rumoslide.obtenTexto(contenidos[i]);
						parcial++;
						if(contenidos[i].className.indexOf('noincremental') != -1){
							contenidos[i].className = contenidos[i].className.replace('noincremental','')
							add_no_incr = ' noincremental';
						}else{
							add_no_incr = '';
						}
					}
					if(secciones && a > 0 && i == 0 && contenidos[i].tagName.toLowerCase() != 'h2' && contenidos[i].tagName.toLowerCase() != 'h3'){
						var nuevo_head = document.createElement('h3');
						nuevo_head.className +=   add_no_incr + ' cont_' + a + ' part subpart_' + parcial;
						var contenedorb = document.createElement('span');
						contenedorb.className = 'subtitulo';
						var new_intro = document.createTextNode(texto);
						contenedorb.appendChild(new_intro);
						nuevo_head.appendChild(contenedorb);
						contenedores[a].appendChild(nuevo_head)
					}
					if(secciones && contenidos[i].tagName.toLowerCase() == 'h2' && a < total-1){
						slides[a].className += ' subtema';
					}
					if(secciones && contenidos[i].tagName.toLowerCase() == 'h3') {
						contenedores[a].appendChild(contenidos[i]);
					}else if(contenidos[i].tagName.toLowerCase() == 'h2'){
							contenedores[a].appendChild(contenidos[i]);
						}else{
							contenedores[a].appendChild(contenidos[i])
						}
					if((document.getElementsByTagName('body')[0].className.indexOf('vcenter') != -1 || contenidos[i].className.indexOf('vcenter') != -1) && slides[a].className.indexOf('vcenter') == -1)
						slides[a].className += ' vcenter';
					rumoslide.hijos(slides[a],'cont_' + a)
					if(a > 0 && !dual)
						rumoslide.hijos(slides[a],'hide')
				}
			}
		}
		var contenidos = rumoslide.getElementsByClassName(document, '*', 'part');
		contenidos.unshift(head_1[0])
		for(var i = 0; i < contenidos.length ; i++) {
			var divcontenedor = document.createElement('div');
			divcontenedor.className = 'head';
			contenidos[i].parentNode.parentNode.insertBefore(divcontenedor,contenidos[i].parentNode);
			if(secciones && contenidos[i].tagName.toLowerCase() == 'h3')
				divcontenedor.appendChild(contenidos[i]);
			if(contenidos[i].className){
				divcontenedor.parentNode.className += ' ' + contenidos[i].className;
				if(contenidos[i].className.indexOf('noincremental') != -1){
					contenidos[i].className = contenidos[i].className.replace('noincremental','')
				}
			}
			if(nav.indexOf('msie 6') != -1) {
				divcontenedor.style.position = 'absolute';
			}
		}
		var temas = rumoslide.getElementsByClassName(document, 'section', 'slide');
		var sec = 0;
		for(var a = 1; a < temas.length-1 ; a++) {
			if(temas[a].className.indexOf('subtema') != -1)
				sec++;
			temas[a].className += ' sec_' + sec
		}
		if(secciones){
			var secc = '';
			var titsecc = '';
			for(var i = 1; i < slides.length-1; i++) {
				if(slides[i].className.indexOf('subtema') != -1){
					var group = slides[i].className.split(' ');
					for(var a = 0; a < group.length; a++){
						if(group[a].indexOf('cont_') != -1 && group[a].length > 5){
							var jarl = group[a];
						}
					}
					secc = rumoslide.getElementsByClassName(document, 'h2' ,jarl)[0].childNodes[0].nodeValue;
					if(rumoslide.getElementsByClassName(document, 'h2' ,jarl)[0].className.split(' ').length > 2)
						titsecc = ' ' + rumoslide.getElementsByClassName(document, 'h2' ,jarl)[0].className.split(' ')[0];
					else
						titsecc = '';
				}else{
					var encabezado_actual = rumoslide.getElementsByClassName(slides[i], 'div' , 'head')[0];
					var seccion = document.createElement('span');
					seccion.className = 'seccion';
					seccion.appendChild(document.createTextNode(secc))
					encabezado_actual.appendChild(seccion);
					encabezado_actual.parentNode.className += titsecc
					
				}
			}
		}
		var imagenes = document.getElementsByTagName('img');
		for(var a = 0; a < imagenes.length ; a++) {
			if(nav.indexOf('msie') == -1){
				if(imagenes[a].className){
					imagenes[a].className += ' bio_img';
				}else{
					imagenes[a].className = 'bio_img';
				}
			}
		}
		if(secciones){
			var minititulos;
			var seccionactual;
			for(var a = 1; a < slides.length-1; a++) {
				if(slides[a].className.indexOf('subtema') != -1){
					seccionactual = rumoslide.getElementsByClassName(slides[a], 'div' , 'content')[0];
					var lista_minititulos = document.createElement('ul');
					seccionactual.appendChild(lista_minititulos);
				}else{
					var item_minititulos = document.createElement('li');
					item_minititulos.id = 'minit_' + a;
					item_minititulos.appendChild(document.createTextNode(rumoslide.obtenTexto(slides[a].getElementsByTagName('h3')[0])))
					lista_minititulos.appendChild(item_minititulos);
				}
			}
		}
		rumoslide.creaScroll();
		rumoslide.creaNavGraf();
		rumoslide.creaFoot();
		rumoslide.indice();
		if(ruta_object){
			rumoslide.addObject(ruta_object,ruta_img,alternativa)
		}else{
			if(ruta_img)
				rumoslide.addImg(ruta_img,alternativa)
		}
		rumoslide.addCredits();
		for(var i = 0; i < slides.length; i++) {
			var encabezado_actual = rumoslide.getElementsByClassName(slides[i], 'div' , 'head')[0];
			rumoslide.creaCorners(encabezado_actual, 'head');
			var contenido_actual = rumoslide.getElementsByClassName(slides[i], 'div' , 'content')[0];
			rumoslide.creaCorners(contenido_actual, 'content');
		}
		rumoslide.creaCorners(document.getElementById('bio'), 'body');

		rumoslide.fontsizedefaultHead = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'head')[0],'font-size'));
		rumoslide.fontsizedefaultContent = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'content')[0],'font-size'));
		rumoslide.fontsizedefaultFoot = parseFloat(rumoslide.getStyleElement(document.getElementById('foot'),'font-size'));
		rumoslide.fontsizedefaultCredits = parseFloat(rumoslide.getStyleElement(document.getElementById('credits'),'font-size'));
		if(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0]){
			rumoslide.fontsizedefaultObject = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0],'font-size'));
		}
		rumoslide.fontsizedefaultNavGraf = parseFloat(rumoslide.getStyleElement(document.getElementById('nav_graf'),'font-size'));
		var bod = document.getElementsByTagName('body')[0];
		bod.onresize = function() {
			rumoslide.verticalCenter(true);
			rumoslide.reText();
			return false;
		}
		bod.setAttribute('onresize','rumoslide.reText();rumoslide.verticalCenter(true);');
		if(nav.indexOf('msie') != -1){
			window.onresize = function() {
				rumoslide.verticalCenter(true);
				rumoslide.reText();
				return false;
			}
		}
		var now = new Date();
		onHours = now.getHours();
		onMinutes = now.getMinutes();
		onSeconds = now.getSeconds();  
	},
	creaCorners: function(el,clase) {
		var c_top = document.createElement('div');
		c_top.className = 'c_top_' + clase;
		var c_left = document.createElement('div');
		c_left.className = 'c_left';
		var c_right = document.createElement('div');
		c_right.className = 'c_right';
		c_top.appendChild(c_left);
		c_top.appendChild(c_right);
		el.insertBefore(c_top, el.firstChild)
		var c_bottom = document.createElement('div');
		c_bottom.className = 'c_bottom_' + clase;
		var c_left = document.createElement('div');
		c_left.className = 'c_left';
		var c_right = document.createElement('div');
		c_right.className = 'c_right';
		c_bottom.appendChild(c_left);
		c_bottom.appendChild(c_right);
		el.appendChild(c_bottom)
	},
	muestraIndice: function() {
		if(!document.getElementById('fondo')){
			rumoslide.muestraFondo();
			document.body.appendChild(cont_indice);
			if((cont_indice.offsetWidth/(document.body.offsetWidth+cont_indice.offsetWidth)) < 0.5){
				cont_indice.style.left = ((document.body.offsetWidth-cont_indice.offsetWidth)/2) + 'px';
			}else{
				cont_indice.style.width = '50%';
				cont_indice.style.left = ((document.body.offsetWidth-cont_indice.offsetWidth)/2) + 'px';
			}
			if((cont_indice.offsetHeight/(document.body.offsetHeight+cont_indice.offsetHeight)) < 0.5){
				cont_indice.style.top = ((document.body.offsetHeight-cont_indice.offsetHeight)/2) + 'px';
			}else{
				cont_indice.style.height = '80%';
				cont_indice.style.top = ((document.body.offsetHeight-cont_indice.offsetHeight)/2) + 'px';
			}
			ind_actual = parseInt(actual);
			rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[ind_actual].focus()
		}
	},
	ocultaIndice: function() {
		document.body.removeChild(cont_indice);
		rumoslide.ocultaFondo()
	},
	muestraFondo: function() {
		document.body.appendChild(fondo);
		var opacidad = 7;
		fondo.style.MozOpacity = opacidad/10;
		fondo.style.filter = 'alpha(opacity=' + (opacidad*10) + ')'
		fondo.style.opacity = opacidad/10;
		document.getElementById('new_scroll_vert').style.display = 'none';
		document.getElementById('foot').style.display = 'none';
	},
	ocultaFondo: function() {
		document.body.removeChild(fondo);
		document.getElementById('new_scroll_vert').style.display = 'block';
		document.getElementById('foot').style.display = 'block';
	},
	gotoSlide: function(to,all) {
		if(document.getElementsByTagName('body')[0].className) {
			if(document.getElementsByTagName('body')[0].className.indexOf('alerta') > -1){
				document.getElementsByTagName('body')[0].className = document.getElementsByTagName('body')[0].className.replace('alerta' , '');
			}
		}
		if(!document.getElementById('fondo') || document.getElementById('indice')){
			var previo = document.getElementById('current');
			rumoslide.verticalCenter(false);
			//previo.style.display = 'none';
			previo.removeAttribute('id');
//			previo.parentNode.removeAttribute('id');
			var ant = actual;
			slides[to].id = 'current';
			//slides[to].style.display = 'block';
			actual = to;
			if(document.getElementById('prev-current'))
				document.getElementById('prev-current').removeAttribute('id');
			if(document.getElementById('next-current'))
				document.getElementById('next-current').removeAttribute('id');
//			if(document.getElementById('page_current'))
//				document.getElementById('page_current').removeAttribute('id');
//			if(document.getElementById('prev-page_current'))
//				document.getElementById('prev-page_current').removeAttribute('id');
//			if(document.getElementById('next-page_current'))
//				document.getElementById('next-page_current').removeAttribute('id');
			if(slides[to-1]){
				slides[to-1].id = 'prev-current';
//				if(slides[to-1].parentNode.id != 'page_current')
//					slides[to-1].parentNode.id = 'prev-page_current';
			}
			if(slides[to+1]){
				slides[to+1].id = 'next-current';
//				if(slides[to+1].parentNode.id != 'page_current')
//					slides[to+1].parentNode.id = 'next-page_current';
			}
			if(slides[to-2]){
				slides[to-2].removeAttribute('id');
				slides[to-2].removeAttribute('id');
			}
			if(slides[to+2]){
				slides[to+2].removeAttribute('id');
				slides[to+2].removeAttribute('id');
			}
//			slides[to].parentNode.id = 'page_current';

//			if(slides[to].className.indexOf('sec_') != -1){
//				var clase = slides[to].className.substring(slides[to].className.indexOf('sec_'), slides[to].className.length);
//				if(document.getElementById('foot'))document.getElementById('foot').className = clase;
//				if(document.getElementById('nav_graf'))document.getElementById('nav_graf').className = clase;
//			}else{
//				if(document.getElementById('foot'))document.getElementById('foot').className = ''
//				if(document.getElementById('nav_graf'))document.getElementById('nav_graf').className = '';
//			}
			var clase = slides[to].className.replace('slide','');
			if(document.getElementById('foot'))document.getElementById('foot').className = clase;
			if(document.getElementById('nav_graf'))document.getElementById('nav_graf').className = clase;
			document.getElementById('span_actual').firstChild.nodeValue = (actual+1) + ' / ' + total;
			var elementos = rumoslide.getElementsByClassName(rumoslide.getElementsByClassName(document.getElementById('current'),'div','content')[0], '*', 'cont_' + to);
			if(elementos.length && actual > 0){
				elementos[0].style.color = tonos[0];
				for(var i = 0; i < elementos.length; i++)
					if(elementos[i].className.indexOf('noincremental') != -1){
						elementos[i].style.color = tonos[0];
						rumoslide.imgChild(elementos[i],10)
					}
			}
			if(nav.indexOf('msie') != -1){
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + to , 'hide']);
				if(elementos.length && actual > 0){
					elementos[0].className = elementos[0].className.replace('hide','show');
					elementos[0].style.color = tonos[0];
					rumoslide.imgChild(elementos[0],10)
					if(elementos[0].style.visibility == 'hidden')
						elementos[0].style.visibility = '';
				}
			} 
			if(all == 'all'){
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + ant , 'show']);
				for (var i = 0; i < elementos.length; i++){
					elementos[i].className = elementos[i].className.replace('show','hide')
					rumoslide.imgChild(elementos[i],0)
				}
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + to , 'hide']);
				for (var i = 0; i < elementos.length; i++) {
					elementos[i].className = elementos[i].className.replace('hide','show')
					elementos[i].style.color = tonos[0];
					elementos[i].style.visibility = '';
					rumoslide.imgChild(elementos[i],10)
				}
				var especial_links = slides[to].getElementsByTagName('a');
				for (var i = 0; i < especial_links.length; i++) {
					especial_links[i].style.color = tonos[0];
					especial_links[i].style.visibility = '';
				}
				var elementos = rumoslide.getElementsByClassName(document, '*', 'cont_' + actual);
				for (var i = 1; i < elementos.length; i++){
					elementos[i].style.color = tonos[0];
					elementos[i].style.visibility = '';
					
				}
				var items = rumoslide.getElementsByClassName(rumoslide.getElementsByClassName(document.getElementById('current'), 'div', 'content')[0], '*', 'cont_' + actual);
				item_actual = items.length-1;
			}else{
				if((actual+1) != total){
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'show']);
					for (var i = 1; i < elementos.length; i++){
						elementos[i].className = elementos[i].className.replace('show','hide')
					}
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						if(tonos[tonos.length-1] != 'none')
							elementos[i].style.color = tonos[tonos.length-1];
						else
							elementos[i].style.visibility =  'hidden';
						rumoslide.degrada(elementos,0)
				}else{
					play = false;
				}
				item_actual = 0;
			}
			if(dual){
				var elementos = rumoslide.getElementsByClassName(rumoslide.getElementsByClassName(document.getElementById('current'), 'div', 'content')[0], '*', 'cont_' + actual);
				if(document.getElementById('current').className.indexOf('noincremental') == -1){
					rumoslide.degradaDual(elementos,item_actual);
				}else{
					for(var i = 0; i < elementos.length; i++){
						elementos[i].style.color = tonos[0]
					}
				}
				var enlac = document.getElementById('current').getElementsByTagName('a');
				for(var i = 0; i < enlac.length; i++){
					enlac[i].style.color = enlac[i].parentNode.style.color
				}
			}
			rumoslide.modificaNavGraf(to);
			document.getElementById('newlinkimg_' + to).src = 'js/img/current.gif';
			var ancla = location.href;
			if(ancla.indexOf('#slide') > -1) {
				ancla = ancla.replace(ancla.substring(ancla.indexOf('#slide'), ancla.length),'');
			}
			ancla += '#slide' + (actual + 1);
			location.href = ancla;
			if((actual+1) == total){
				document.getElementById('enl_play').style.display = '';
				document.getElementById('enl_stop').style.display = 'none';
			}
			//rumoslide.verticalCenter(true);
		}
		ctrl = false;
		if(document.getElementById('indice'))
			rumoslide.ocultaIndice()
		if(!dual){
			if(actual-ant > 0 && all != 'all'){
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide' ]);
			}else{
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'show' ]);
			}
		}else{
			var elementos = rumoslide.getElementsByClassName(rumoslide.getElementsByClassName(document.getElementById('current'), 'div', 'content')[0], '*', 'cont_' + actual);
		}
		cuantos = elementos.length;
		if(all == 'all' && nav.indexOf('msie') != -1)
			cuantos--;
		if(dual)
			cuantos--;
		anterior = actual;
		rumoslide.mueveScroll();
		rumoslide.verticalCenter(true);
		if(micontrol){
			if(micontrol.document.getElementById('prev-current'))
				micontrol.document.getElementById('prev-current').removeAttribute('id');
			if(micontrol.document.getElementById('next-current'))
				micontrol.document.getElementById('next-current').removeAttribute('id');
//			if(micontrol.document.getElementById('page_current'))
//				micontrol.document.getElementById('page_current').removeAttribute('id');
//			if(micontrol.document.getElementById('prev-page_current'))
//				micontrol.document.getElementById('prev-page_current').removeAttribute('id');
//			if(micontrol.document.getElementById('next-page_current'))
//				micontrol.document.getElementById('next-page_current').removeAttribute('id');
			if(micontrol.slides[to-1]){
				micontrol.slides[to-1].id = 'prev-current';
//				if(micontrol.slides[to-1].parentNode.id != 'page_current')
//					micontrol.slides[to-1].parentNode.id = 'prev-page_current';
			}
			if(micontrol.slides[to+1]){
				micontrol.slides[to+1].id = 'next-current';
//				if(micontrol.slides[to+1].parentNode.id != 'page_current')
//					micontrol.slides[to+1].parentNode.id = 'next-page_current';
			}
			if(micontrol.slides[to-2]){
				micontrol.slides[to-2].removeAttribute('id');
				micontrol.slides[to-2].removeAttribute('id');
			}
			if(micontrol.slides[to+2]){
				micontrol.slides[to+2].removeAttribute('id');
				micontrol.slides[to+2].removeAttribute('id');
			}
//			micontrol.slides[to].parentNode.id = 'page_current';
			micontrol.slides[to].id = 'current';

//			micontrol.document.getElementById('current').style.display = 'none';
//			micontrol.document.getElementById('current').removeAttribute('id');
//			micontrol.document.getElementById('page_current').removeAttribute('id');
//			micontrol.slides[actual].id = 'current';
//			micontrol.slides[actual].style.display = 'block';
//			micontrol.slides[actual].parentNode.id = 'page_current';
			micontrol.rumoslide.navgraf(actual);
			micontrol.rumoslide.verticalCenter(true);
		}
	},
	escala: function(factor) {
		if(!document.getElementById('fondo') && actual > 0 && actual < slides.length - 1 && slides[actual].className.indexOf('subtema') == -1) {
			if(factor) {
				for (var i = 1; i < contenedores.length -1 ; i++){
					var font_size = parseFloat(rumoslide.getStyleElement(contenedores[i],'font-size'))
					if(nav.indexOf('msie') == -1)
						contenedores[i].style.fontSize = (font_size + factor)  + 'px';
					else
						contenedores[i].style.fontSize = (font_size + (factor/30))  + 'em';
				}
			}else{
				for (var i = 0; i < contenedores.length; i++){
					contenedores[i].style.fontSize = ''
				}
			}
		}
	},
	addObject: function(ruta_object,ruta_img,titulo){
		var object = document.createElement('object');
		object.className = 'bio_object';
		object.setAttribute('data',ruta_object);
		var tipo = ruta_object.substring(ruta_object.length-3,ruta_object.length);
		if(nav.indexOf('msie') == -1 || tipo =='swf') {
			switch ( tipo ) { 
				case 'svg':
					object.setAttribute('type','image/svg+xml');
					break;
				case 'swf':
					object.setAttribute('type','application/x-shockwave-flash');
					var params =  new Array();
					var names = new Array('allowScriptAccess','movie','quality','bgcolor');
					var values = new Array('sameDomain',ruta_object,'high','transparent');
					for(var i = 0; i < 4; i++){
						params[i] =  document.createElement('param');
						params[i].setAttribute(names[i],values[i]);
						object.appendChild(params[i]);
					}
					break;
			}
			object.setAttribute('title',titulo);
			var img_alt = document.createElement('img');
			img_alt.setAttribute('src',ruta_img);
			img_alt.setAttribute('alt',titulo);
			object.appendChild(img_alt);
			document.body.appendChild(object);
		}
	},
	addCredits: function(){
		var credits = document.createElement('div');
		credits.id = 'credits';
		var credits_ul = document.createElement('ul');
		var item_titulo = document.createElement('li');
		item_titulo.id = 'li_titulo';
		item_titulo.appendChild(document.createTextNode(rumoslide.obtenTexto(head_1[0])));
		credits_ul.appendChild(item_titulo);
		if(author) {
			var item_author = document.createElement('li');
			item_author.id = 'li_author';
			item_author.appendChild(document.createTextNode(author));
			credits_ul.appendChild(item_author);
		}
		credits.appendChild(credits_ul);
		credits.style.color = tonos[0];
		document.body.appendChild(credits);
	},
	addImg: function(ruta_img,titulo){
		var div_img = document.createElement('div');
		div_img.className = 'div_img';
		var img = document.createElement('img');
		img.setAttribute('src',ruta_img);
		img.setAttribute('alt',titulo);
		div_img.appendChild(img);
		document.body.appendChild(div_img);
	},
	verticalCenter: function(v){
		if(!actual)
			actual = 0;
		for(var i = 0 ; i <= total; i++){
			var diap = rumoslide.getElementsByClassName(document, 'section', 'slide')[i];
			if(diap){
				var head = rumoslide.getElementsByClassName(diap, 'div', 'head')[0];
				var content = rumoslide.getElementsByClassName(diap, 'div', 'content')[0];
				var foot = document.getElementById('foot');
				var elemt2center;
				var Wheight = document.documentElement.offsetHeight;
				if(diap.className.indexOf('vcenter') != -1){
	//				if((secciones && content.parentNode.className && content.parentNode.className.indexOf('subpart') > -1) || (!secciones && content.parentNode.className && content.parentNode.className.indexOf('part') > -1 && actual < total-1)){
					if((secciones && content.parentNode.className) || (!secciones && content.parentNode.className && actual < total-1)){
						elemt2center = content;
					}else{
						if(!dual && actual > 0 && actual < total-1){
							elemt2center = head;
						}else{
							var h1 = head.getElementsByTagName('h1');
							if(h1.length){
								elemt2center = h1[0];
							}else{
								var h2 = head.getElementsByTagName('h2');
								elemt2center = h2[0]
							}
						}
					}
					if(elemt2center){
						var top = (((Wheight-head.offsetHeight-foot.offsetHeight)/2)-(elemt2center.offsetHeight/2));
						if(v){
							elemt2center.style.top = '0px';
							var incremento = head.offsetHeight+top-elemt2center.offsetTop;
							elemt2center.style.top = incremento + 'px';
							elemt2center.style.position = 'absolute';
						}else{
							elemt2center.style.top = '';
						}
					}
				}
			}
		}
	},
	reText: function(){
		var Wheight = document.documentElement.clientHeight;
		var WWidth = document.documentElement.clientWidth;
		var razonH = Wheight/min_height;
		var razonW = 2*(WWidth/min_width);
		if(razonH < razonW)
			razon = razonH;
		else
			razon = razonW;
		razon = factor_escalado*razon;

		var heads = rumoslide.getElementsByClassName(document, 'div', 'head');
		var contents = rumoslide.getElementsByClassName(document, 'div', 'content');
		for(var i = 0; i < heads.length; i++){
			if(nav.indexOf('msie') == -1){
				heads[i].style.fontSize = (rumoslide.fontsizedefaultContent * razonW/3)  + 'px';
				contents[i].style.fontSize = (rumoslide.fontsizedefaultContent * razon)  + 'px';
			}else{
				heads[i].style.fontSize = (rumoslide.fontsizedefaultContent * razonW/3)  + 'em';
				contents[i].style.fontSize = (rumoslide.fontsizedefaultContent * razon)  + 'em';
			}
		}
		if(nav.indexOf('msie') == -1){
			document.getElementById('foot').style.fontSize = (rumoslide.fontsizedefaultFoot * razonW/3)  + 'px';
			document.getElementById('credits').style.fontSize = (rumoslide.fontsizedefaultCredits * razonW/3)  + 'px';
			document.getElementById('nav_graf').style.fontSize = (rumoslide.fontsizedefaultNavGraf * razon)  + 'px';
			if(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0])
				rumoslide.getElementsByClassName(document, '*', 'bio_object')[0].style.fontSize = (rumoslide.fontsizedefaultObject * razon)  + 'px';
		}else{
			document.getElementById('foot').style.fontSize = (rumoslide.fontsizedefaultFoot * razonW/3)  + 'em';
			document.getElementById('credits').style.fontSize = (rumoslide.fontsizedefaultCredits * razonW/3)  + 'em';
			document.getElementById('nav_graf').style.fontSize = (rumoslide.fontsizedefaultNavGraf * razon)  + 'em';
			if(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0])
				rumoslide.getElementsByClassName(document, '*', 'bio_object')[0].style.fontSize = (rumoslide.fontsizedefaultObject * razon)  + 'em';
		}
	},
	actTimer: function(){
		if(micontrol && !micontrol.document.getElementById('tempo')){
			if(micontrol){
				var tempo = micontrol.document.createElement('div');
				tempo.id = 'tempo';
				tempo.appendChild(document.createTextNode(logHours + logMinutes + logSeconds))
				micontrol.document.getElementsByTagName('body')[0].appendChild(tempo);
			}
		}
		if(document.getElementById('tempo') && !micontrol){
			clearInterval(temporizado);
			document.getElementById('tempo').parentNode.removeChild(document.getElementById('tempo'));
		}else{
			var now = new Date();
			offHours = now.getHours();
			offMinutes = now.getMinutes();
			offSeconds = now.getSeconds(); 
			if (offSeconds >= onSeconds){
				logSeconds = offSeconds - onSeconds;
			}else{
			   	offMinutes -= 1;
				logSeconds = (offSeconds + 60) - onSeconds;      
			}
			if (offMinutes >= onMinutes){
			  	logMinutes = offMinutes - onMinutes; 
			}else{
				offHours -= 1;
				logMinutes = (offMinutes + 60) - onMinutes;
			}
			logHours = offHours - onHours;
			logHours =  ((logHours < 10) ? "0" : ":") + logHours;
			logMinutes = ((logMinutes < 10) ? ":0" : ":") + logMinutes;
			logSeconds = ((logSeconds < 10) ? ":0" : ":") +logSeconds;
			if(!micontrol){
				var tempo = document.createElement('div');
				tempo.id = 'tempo';
				tempo.appendChild(document.createTextNode(logHours + logMinutes + logSeconds))
				document.getElementsByTagName('body')[0].appendChild(tempo);
			}
			temporizado = setInterval(rumoslide.timer, 1000);
		}
	},
	timer: function(){
		var now = new Date();
		offHours = now.getHours();
		offMinutes = now.getMinutes();
		offSeconds = now.getSeconds(); 
		if (offSeconds >= onSeconds){
			logSeconds = offSeconds - onSeconds;
		}else{
		   	offMinutes -= 1;
			logSeconds = (offSeconds + 60) - onSeconds;      
		}
		if (offMinutes >= onMinutes){
		  	logMinutes = offMinutes - onMinutes; 
		}else{
			offHours -= 1;
			logMinutes = (offMinutes + 60) - onMinutes;
		}
		logHours = offHours - onHours;
		logHours =  ((logHours < 10) ? "0" : ":") + logHours;
		logMinutes = ((logMinutes < 10) ? ":0" : ":") + logMinutes;
		logSeconds = ((logSeconds < 10) ? ":0" : ":") +logSeconds;
		if(!micontrol){
			var tempo = document.getElementById('tempo');
			tempo.innerHTML = ''
			tempo.appendChild(document.createTextNode(logHours + logMinutes + logSeconds));
		}else{
			if(micontrol){
				var tempo = micontrol.document.getElementById('tempo');
				tempo.innerHTML = ''
				tempo.appendChild(micontrol.document.createTextNode(logHours + logMinutes + logSeconds));
			}
		}
	},
	fecha: function() {  
		var fecha_actual = new Date();
		var dia = fecha_actual.getDate();
		var mes = fecha_actual.getMonth() 
		var year = fecha_actual.getFullYear();
		var meses = new Array("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
		var fecha_completa = document.createTextNode(dia + " de " + meses[mes] + " de " + year);
		if(document.getElementById("fechaSlide"))
		document.getElementById("fechaSlide").appendChild(fecha_completa);
		
	},
	
	
	controladora: function(){
		micontrol = window.open("controladora.html","Moderador","menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=no");
	}
}

if(!lang) 
	var lang = document.getElementsByTagName('html')[0].getAttribute('xml:lang');
if(!lang)
	lang = 'es';
else
	lang = lang.toLowerCase();
if(lang.substr(0,2) != 'es' && lang.substr(0,2) != 'en')
	var lang = 'es';
var ocultar = false;
var head_1 = new Array();
var head_2 = new Array();
var head_3 = new Array();
var meta = new Array();
var author;
var enlaces = new Array();
var fondo = document.createElement('div');
	fondo.id = 'fondo';
var cont_indice = document.createElement('div');
	cont_indice.id = 'indice';
var ventana = document.createElement('div');
	ventana.id = 'ventana';
var ventana_p_title = document.createElement('p');
	ventana_p_title.id = 'ventana_title';
	var ventana_titulo = document.createTextNode('')
		ventana_p_title.appendChild(ventana_titulo);
	ventana.appendChild(ventana_p_title);
var ventana_p_off = document.createElement('p');
	ventana_p_off.id = 'ventana_off';
	ventana.appendChild(ventana_p_off);
var ventana_input = document.createElement('input');
	ventana_input.setAttribute('type','text');
	ventana_input.id = 'ventana_input';
	ventana_p_off.appendChild(ventana_input);
var ventana_a_off = document.createElement('a');
	ventana_a_off.setAttribute('href','#');
	ventana_a_off.appendChild(document.createTextNode(textos[lang][1]))
	ventana_a_off.onclick = function () {
		if(document.getElementById('object'))
			rumoslide.ocultaObject();
		if(document.getElementById('img'))
			rumoslide.ocultaImagen()
		return false;
	}
	ventana_p_off.appendChild(ventana_a_off);
var object = document.createElement('iframe');
	object.id = 'object';
	object.setAttribute('src','')
var imagen = document.createElement('img');
	imagen.id = 'img';
	imagen.setAttribute('src','')
var total;
var slides = new Array;
var contenedores = new Array;
var excepcion_class = 'slide'
var actual = 0;
var ind_actual = 0;
var anterior = 0;
var cuantos = 0;
var item_actual = 0;
var identificador = 'bio';
var ctrl = false;
var play = false;
var auto;
var temporizado;
var ext_grafica = new Array('gif', 'jpg', 'png'); 
var onHours = '';
var onMinutes = '';
var onSeconds = '';
var offHours = 0;
var offMinutes = 0;
var offSeconds = 0;
var logSeconds = 0;
var logMinutes = 0;
var logHours = 0;
var micontrol; 

var PageTimeValue = '';
if(tonos.length == 1 || !dual) dual = false
var localizacion = location.href.replace(location.href.substring(location.href.indexOf('#'), location.href.length),'');
var nav = navigator.userAgent.toLowerCase(); 
this.nav = nav;
if(nav.indexOf('msie 6') != -1) {
	window.onscroll = rumoslide.scroll_ear; // Esto sólo es operativo en IE 6 o menor y es para simular el "position: fixed" de CSS
}
document.onkeydown = rumoslide.teclado;
document.onclick = rumoslide.ratonClick;

if(nav.indexOf('msie') == -1) {
	// Valores iniciales
	var pageX = pageY = 0;
	// Sensibilidad en pixels
	var sensibilidad = 10;
	// Evento START
	document.addEventListener('touchstart', function(e) {
		// Posición icial del evento touch
		var touch = e.touches[0];
		pageX = touch.pageX;
		pageY = touch.pageY;
	}, false);
	// Evento MOVE
	document.addEventListener('touchmove', function(e) {
		e.preventDefault();					
		var touch = e.touches[0];
		var Y = pageY - touch.pageY;
		var X = pageX - touch.pageX;
		if (Y < sensibilidad) dirY = 'abajo';
		else if (Y > sensibilidad) dirY = 'arriba';
		else dirY = 'centro';
		if (X > sensibilidad){
			if(actual+1 < total){
				if(!dual)
					rumoslide.gotoSlide(actual + 1,'all');
				else
					rumoslide.gotoSlide(actual + 1);
				anterior = actual;
				var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
				for (var i = 0; i < elementos.length; i++)
					elementos[i].className = elementos[i].className.replace('hide','show')
			}
		}else{
			if (X < sensibilidad){
				if(actual - 1 >= 0 ){
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'show']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('show','hide') 
					rumoslide.gotoSlide(actual - 1,'all');
					anterior = actual;
					var elementos = rumoslide.getElementsByClassName(document, '*', ['cont_' + actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
				}
			}

		}
	//		else dirX = 'centro';
	}, false);
	// Evento END 
	document.addEventListener('touchend', function(e){return;}, false); // No hacemos nada
}
if(typeof Array.prototype.push != "function"){
	Array.prototype.push = ArrayPush;
	function ArrayPush(value){
		this[this.length] = value;
	}
}
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      oldonload();
      func();
    }
  }
}

addLoadEvent(rumoslide.cleanEmpty);
addLoadEvent(rumoslide.fixPng);
if(nav.indexOf('chrome') == -1)
	addLoadEvent(rumoslide.cargaEstilos);
addLoadEvent(rumoslide.recogeElements);
addLoadEvent(rumoslide.creaSlides);
addLoadEvent(rumoslide.slideInicial);
addLoadEvent(rumoslide.reText);
addLoadEvent(rumoslide.fecha);
if(nav.indexOf('chrome') > 0)
	addLoadEvent(rumoslide.cargaEstilos);
//addLoadEvent(rumoslide.controladora); //comentar esta línea si no queremos ventana controladora (pop-up de control que permite incluir notas)

var demora = 500;
if(nav.indexOf('chrome') > 0)
	demora = 100;
var acc_vertical = setInterval("rumoslide.verticalCenter("+true+")",demora);
setTimeout("clearInterval(" + acc_vertical + ")",6000);


