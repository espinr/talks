/* rumoslide Presentaciones con XHTML, CSS y Javascript
   Copyright (C) 2007  Jorge Rumoroso
   http://www.niquelao.net

   Esta obra está hecha bajo una licencia de Creative Commons:
   http://creativecommons.org/licenses/by-nc-sa/2.5/es
*/

	var moderador = true;
	var slides = new Array();
	var nav = navigator.userAgent.toLowerCase(); 
	this.nav = nav;

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
	insertAfter: function(previo,nodo) {
		var parent_previo = previo.parentNode;
		if (previo.nextSibling) {
			parent_previo.insertBefore(nodo, previo.nextSibling)
		} else {
			parent_previo.appendChild(nodo);
		}
	},
	getStyleElement:function(el,styleProp){
		if(styleProp == 'font-size') var especial = 'fontSize';
		if (el.currentStyle)
			var y = el.currentStyle[especial];
		else if (window.getComputedStyle)
			var y = document.defaultView.getComputedStyle(el,null).getPropertyValue(styleProp);
		return y;
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
	verticalCenter:function(v){
		if(!window.opener.actual)
			window.opener.actual = 0;
		var diap = rumoslide.getElementsByClassName(document, 'div', 'slide')[window.opener.actual];
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
					if(!dual && window.opener.actual > 0 && window.opener.actual < window.opener.total-1){
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
	},
	reText: function(){
		var Wheight = document.documentElement.clientHeight;
		var WWidth = document.documentElement.clientWidth;
		var razonH = Wheight/min_height;
		var razonW = 1.5*(WWidth/min_width);
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
	navgraf:function (to){
		var elementos = rumoslide.getElementsByClassName(document, '*', 'navtoplink');
		for (var i = 0; i <= to; i++){
			document.getElementById('newlinkimg_' + i).src = 'js/img/visited.gif';
		}
		for (var i = to+1; i < elementos.length; i++){
			document.getElementById('newlinkimg_' + i).src = 'js/img/no_visited.gif';
		}
		for (var i = 0; i < elementos.length; i++){
			document.getElementById('newlinkimg_' + i).className = 'navtoplink';
		}
		document.getElementById('newlinkimg_' + to).className += ' current';
	},
	NavGeneral:function() {
		var a_nav_graf = rumoslide.getElementsByClassName(document.getElementById('nav_graf'),'a','cre');
		var img_nav_graf = rumoslide.getElementsByClassName(document.getElementById('nav_graf'),'img','navtoplink');
		for(var i = 0; i < a_nav_graf.length; i++){
			a_nav_graf[i].onclick = function() {
				var to = this.childNodes[0].nodeValue - 1;
				window.opener.rumoslide.gotoSlide(to,'all')
			}
			img_nav_graf[i].onclick = function(){
				var to = parseInt(this.id.replace('newlinkimg_',''));
				window.opener.rumoslide.gotoSlide(to,'all')
			}
		}
		
		
		document.getElementById('enl_indice').onclick = function() {
			window.opener.rumoslide.muestraIndice();
			return false;
		}
		document.getElementById('enl_anterior').onclick = function() {
			if(window.opener.actual >= 1)
				window.opener.rumoslide.gotoSlide(window.opener.actual-1, 'all')
			return false;
		}
		document.getElementById('enl_play').onclick = function() {
			if((window.opener.actual+1) == window.opener.total)
				window.opener.rumoslide.gotoSlide(0)
			if(!window.opener.document.getElementById('fondo') && window.opener.actual < window.opener.total-1){
				play = true;
				window.opener.rumoslide.auto =  setTimeout(window.opener.rumoslide.avanza,(velocidad * 1000));
				window.opener.document.getElementById('enl_play').style.display = 'none';	
				window.opener.document.getElementById('enl_stop').style.display = '';
			}
			return false;
		}
		document.getElementById('enl_stop').onclick = function() {
			if(auto){
				clearInterval(window.opener.auto)
				play = false;
				window.opener.document.getElementById('enl_play').style.display = '';
				window.opener.document.getElementById('enl_stop').style.display = 'none';
			}
			return false;
		}
		document.getElementById('enl_posterior').onclick = function() {
			if(window.opener.actual < window.opener.total-1)
				window.opener.rumoslide.gotoSlide(window.opener.actual+1, 'all')
			return false;
		}		
	},
	ratonClick:function(e){
		if(avanceRaton){
			if (!e)
				var e = window.event;
			if (e.target)
				target = e.target;
			else if (e.srcElement)
				target = e.srcElement;
			if (target.nodeName.toLocaleLowerCase() != "object" && target.nodeName.toLocaleLowerCase() != "a" && target.parentNode.nodeName.toLocaleLowerCase() != "a" && target.nodeName.toLocaleLowerCase() != "input" && target.nodeName.toLocaleLowerCase() != "textarea" && target.nodeName.toLocaleLowerCase() != "select" && target.nodeName.toLocaleLowerCase() != "option"){
				window.opener.rumoslide.padre(target,'current')
			}
		}
	},
	teclado:function(event){
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
		if (key == 17 && !window.opener.document.getElementById('fondo')){ // control
			if(window.opener.ctrl)
				window.opener.ctrl =false;
			else
				window.opener.ctrl =true;
		}
		if(key == 13 && window.opener.document.getElementById('indice'))
			window.opener.rumoslide.gotoSlide(window.opener.ind_actual,'all');
		// start automatic presentation
		if(keys['play'].contains(key) && !window.opener.document.getElementById('fondo') && window.opener.actual < window.opener.total-1){
			play = true;
			setTimeout(window.opener.rumoslide.avanza,(velocidad * 1000));
			window.opener.document.getElementById('enl_play').style.display = 'none';
			window.opener.document.getElementById('enl_stop').style.display = '';
			if(window.opener.rumoslide.play){
				window.opener.rumoslide.auto =  setInterval(window.opener.rumoslide.avanza,(velocidad * 1000));
				//setTimeout(window.opener.rumoslide.avanza,(velocidad * 1000));
			}	
		}
		// stop automatic presentation
		if(keys['stop'].contains(key) && !window.opener.document.getElementById('fondo')){
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto)
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
			window.opener.rumoslide.play = false;
		}
		// create new window in order to browse an URL
		if(keys['newWindow'].contains(key) && !window.opener.document.getElementById('fondo')) {
			window.opener.rumoslide.muestraObject('');
			if(window.opener.rumoslide.play)
				play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// toggle Alt+Num class of body element
		if (keys['toggleAltNumClass'].contains(key) && !window.opener.document.getElementById('fondo')) {
			if(window.opener.document.getElementById('indice'))
				window.opener.rumoslide.ocultaIndice()
			if(window.opener.document.getElementById('ventana')){
				if(window.opener.document.getElementById('object'))
					window.opener.rumoslide.ocultaObject();
				if(window.opener.document.getElementById('img'))
					window.opener.rumoslide.ocultaImagen()
			}
			if( key < 98 )
				window.opener.rumoslide.bodyClass('alt' + (key - 48));
			else
				window.opener.rumoslide.bodyClass('alt' + (key - 96));
		}
		// go to end
		if (keys['goToEnd'].contains(key) && !window.opener.document.getElementById('fondo')){
			window.opener.rumoslide.gotoSlide(window.opener.total-1, 'all');
			var elementos = window.opener.rumoslide.getElementsByClassName(document, '*', ['cont_' + window.opener.actual , 'hide']);
			for (var i = 0; i < elementos.length; i++)
				elementos[i].className = elementos[i].className.replace('hide','show')
			anterior = window.opener.actual;
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// go to start
		if(keys['goToStart'].contains(key) && !window.opener.document.getElementById('fondo')){
			window.opener.rumoslide.gotoSlide(0,'all');
			anterior = window.opener.actual;
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// prevSlide
		if(keys['prevSlide'].contains(key)){
			if(!window.opener.document.getElementById('fondo')) {
				if(window.opener.actual - 1 >= 0 ){
					var elementos = window.opener.rumoslide.getElementsByClassName(document, '*', ['cont_' + window.opener.actual , 'show']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('show','hide') 
					window.opener.rumoslide.gotoSlide(window.opener.actual - 1,'all');
					anterior = window.opener.actual;
					var elementos = window.opener.rumoslide.getElementsByClassName(document, '*', ['cont_' + window.opener.actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
				}
			}else{
				if(window.opener.document.getElementById('indice')){
					if(window.opener.ind_actual > 0) {
						window.opener.rumoslide.getElementsByClassName(window.opener.document, 'a', 'enl_ind')[window.opener.ind_actual-1].focus();
						window.opener.rumoslide.modificaNavGraf(window.opener.ind_actual-1,true);
						window.opener.document.getElementById('newlinkimg_' + (window.opener.ind_actual-1)).src = 'js/img/current.gif';
						window.opener.ind_actual--;
					}else{
						window.opener.rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[window.opener.total - 1].focus();
						window.opener.rumoslide.modificaNavGraf(window.opener.total - 1,true);
						window.opener.document.getElementById('newlinkimg_' + (window.opener.total - 1)).src = 'js/img/current.gif';
						window.opener.ind_actual = window.opener.total - 1;
					}
				}
			}
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// prevStep
		if(keys['prevStep'].contains(key) && !window.opener.ctrl){
			if(!window.opener.document.getElementById('fondo')) {
				window.opener.rumoslide.retrocede();
			}else{
				if(window.opener.document.getElementById('indice')){
					if(window.opener.ind_actual > 0) {
						window.opener.rumoslide.getElementsByClassName(window.opener.document, 'a', 'enl_ind')[window.opener.ind_actual - 1].focus();
						window.opener.rumoslide.modificaNavGraf(window.opener.ind_actual-1,true);
						window.opener.document.getElementById('newlinkimg_' + (window.opener.ind_actual - 1)).src = 'js/img/current.gif';
						window.opener.ind_actual--;
					}else{
						window.opener.rumoslide.getElementsByClassName(window.opener.document, 'a', 'enl_ind')[window.opener.total - 1].focus();
						window.opener.rumoslide.modificaNavGraf(window.opener.total - 1,true);
						window.opener.document.getElementById('newlinkimg_' + (window.opener.total - 1)).src = 'js/img/current.gif';
						window.opener.ind_actual = window.opener.total - 1;
					}
				}
			}
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// nextSlide
		if(keys['nextSlide'].contains(key)){
			if(!window.opener.document.getElementById('fondo')) {
				if(window.opener.actual+1 < window.opener.total){
					if(!dual)
						window.opener.rumoslide.gotoSlide(window.opener.actual + 1,'all');
					else
						window.opener.rumoslide.gotoSlide(window.opener.actual + 1);
					anterior = window.opener.actual;
					var elementos = window.opener.rumoslide.getElementsByClassName(window.opener.document, '*', ['cont_' + window.opener.actual , 'hide']);
					for (var i = 0; i < elementos.length; i++)
						elementos[i].className = elementos[i].className.replace('hide','show')
				}
			}else{
				if(window.opener.document.getElementById('indice')){
					if(window.opener.ind_actual < window.opener.total-1) {
						window.opener.rumoslide.getElementsByClassName(window.opener.document, 'a', 'enl_ind')[window.opener.ind_actual+1].focus();
						window.opener.rumoslide.modificaNavGraf(window.opener.ind_actual,true);
						window.opener.document.getElementById('newlinkimg_' + (window.opener.ind_actual + 1)).src = 'js/img/current.gif';
						window.opener.ind_actual++;
					}else{
						window.opener.rumoslide.getElementsByClassName(document, 'a', 'enl_ind')[0].focus();
						window.opener.rumoslide.modificaNavGraf(0,true);
						window.opener.document.getElementById('newlinkimg_' + 0).src = 'js/img/current.gif';
						ind_actual = 0;
					}
				}
			}
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// nextStep
		if(keys['nextStep'].contains(key) && !window.opener.ctrl) {
			if(!window.opener.document.getElementById('fondo')) {
				window.opener.rumoslide.avanza();
			}else{
				if(key == 40 && window.opener.document.getElementById('indice')){
					if(window.opener.ind_actual < window.opener.total-1) {
						window.opener.rumoslide.getElementsByClassName(window.opener.document, 'a', 'enl_ind')[window.opener.ind_actual+1].focus();
						window.opener.rumoslide.modificaNavGraf(window.opener.ind_actual,true);
						window.opener.document.getElementById('newlinkimg_' + (window.opener.ind_actual + 1)).src = 'js/img/current.gif';
						window.opener.ind_actual++;
					}else{
						window.opener.rumoslide.getElementsByClassName(window.opener.document, 'a', 'enl_ind')[0].focus();
						window.opener.rumoslide.modificaNavGraf(0,true);
						window.opener.document.getElementById('newlinkimg_' + 0).src = 'js/img/current.gif';
						window.opener.ind_actual = 0;
					}
				}
			}
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';	
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		if (keys['enter'].contains(key)){ // intro
			if(window.opener.document.getElementById('ventana_input') && window.opener.document.getElementById('object')){
				if(ventana_input.value.substring(0,7) != 'http://')
					ventana_input.value = 'http://' + ventana_input.value
				window.opener.document.getElementById('object').setAttribute('src',ventana_input.value);
			}
		}
		if (keys['escape'].contains(key)){ // escape (esc)
			if(window.opener.document.getElementById('indice'))
				window.opener.rumoslide.ocultaIndice()
			if(window.opener.document.getElementById('ventana')){
				if(window.opener.document.getElementById('object'))
					window.opener.rumoslide.ocultaObject();
				if(window.opener.document.getElementById('img'))
					window.opener.rumoslide.ocultaImagen()
			}
			window.opener.rumoslide.modificaNavGraf(window.opener.actual);
			window.opener.document.getElementById('newlinkimg_' + window.opener.actual).src = 'js/img/current.gif';
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		// index
		if (keys['index'].contains(key) && !window.opener.document.getElementById('ventana_input')){
			if(!window.opener.document.getElementById('indice'))
				window.opener.rumoslide.muestraIndice()
			else
				window.opener.rumoslide.ocultaIndice()
			if(window.opener.rumoslide.play)
				window.opener.rumoslide.play = false;
			if(window.opener.rumoslide.auto)
				clearInterval(window.opener.rumoslide.auto);
			window.opener.document.getElementById('enl_play').style.display = '';
			window.opener.document.getElementById('enl_stop').style.display = 'none';
		}
		if (keys['zero'].contains(key)){ // cero
			window.opener.rumoslide.escala();
			window.opener.rumoslide.reText();
			window.opener.rumoslide.verticalCenter(true);
		}
		if (keys['plus'].contains(key)){ // signo +
			if(!window.opener.rumoslide.play){
				window.opener.rumoslide.escala(3)
				window.opener.rumoslide.verticalCenter(true);
			}else if(velocidad > 0){
					clearInterval(window.opener.rumoslide.auto);
					velocidad--;
					auto =  setInterval(window.opener.rumoslide.avanza,(velocidad * 1000));
			}	
		}
		if (keys['minus'].contains(key)){ // signo -
			if(!window.opener.rumoslide.play){
				window.opener.rumoslide.escala(-3);
				window.opener.rumoslide.verticalCenter(true);
			}else{
					clearInterval(window.opener.rumoslide.auto);
					velocidad++;
					auto =  setInterval(window.opener.rumoslide.avanza,(velocidad * 1000));
			}	
		}
		if(keys['timer'].contains(key)){ // timer...
			window.opener.rumoslide.actTimer();
		}
		document.getElementById('current').removeAttribute('id');
		document.getElementById('page_current').removeAttribute('id');
		slides[window.opener.actual].id = 'current';
		slides[window.opener.actual].parentNode.id = 'page_current';
		rumoslide.navgraf(window.opener.actual);
		rumoslide.verticalCenter(true);
		rumoslide.reText();
		return true;
	},
	cargaEstilos: function(){
		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {
			if(scripts[i].getAttribute('src') && scripts[i].getAttribute('src').indexOf('rumoslide_conf.js') > -1) {
				var ruta = scripts[i].src.replace('rumoslide_conf.js','') + 'css/rumoslide.css';
				var link_style = document.createElement('link');
				link_style.setAttribute('rel','stylesheet');
				link_style.setAttribute('type','text/css');
				link_style.setAttribute('href',ruta);
				rumoslide.insertAfter(scripts[i],link_style)
				link_style.setAttribute('media','projection,screen');
				var ruta = scripts[i].src.replace('rumoslide_conf.js','') + 'css/rumoslide_print.css';
				var link_style_print = document.createElement('link');
				link_style_print.setAttribute('rel','stylesheet');
				link_style_print.setAttribute('type','text/css');
				link_style_print.setAttribute('href',ruta);
				link_style_print.setAttribute('media','print');
				rumoslide.insertAfter(link_style,link_style_print)
				var ruta = scripts[i].src.replace('rumoslide_conf.js','') + 'css/rumoslide_moderador.css';
				var link_rumoslide_moderador = document.createElement('link');
				link_rumoslide_moderador.setAttribute('rel','stylesheet');
				link_rumoslide_moderador.setAttribute('type','text/css');
				link_rumoslide_moderador.setAttribute('href',ruta);
				link_rumoslide_moderador.setAttribute('media','projection,screen');
				rumoslide.insertAfter(link_style,link_rumoslide_moderador)
			}
			if(scripts[i].getAttribute('src') && scripts[i].getAttribute('src').indexOf('rumoslide') == -1) {
				//scripts[i].parentNode.removeChild(scripts[i])
			}
		}
		rumoslide.cargaContenidos()
	},
	cargaContenidos: function(){ 
		document.getElementsByTagName('head')[0].removeChild(document.getElementsByTagName('title')[0])
		//window.opener.jarl()
		document.getElementsByTagName('head')[0].appendChild(window.opener.document.getElementsByTagName('title')[0].cloneNode(true));
		document.getElementsByTagName('title')[0].appendChild(document.createTextNode(' - Vista Moderador'))
		document.getElementsByTagName('body')[0].parentNode.removeChild(document.getElementsByTagName('body')[0])
		document.getElementsByTagName('head')[0].parentNode.appendChild(window.opener.document.getElementsByTagName('body')[0].cloneNode(true));
//		var notas = rumoslide.getElementsByClassName(window.opener.document, 'div', 'notas');
//		for (var i = notas.length-1; i >= 0; i--) 
//			notas[i].parentNode.removeChild(notas[i]);
//		rumoslide.cargaEstilos;
		slides = rumoslide.getElementsByClassName(document, 'div', 'slide');
		fontsizedefaultHead = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'head')[0],'font-size'));
		fontsizedefaultContent = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'content')[0],'font-size'));
		fontsizedefaultFoot = parseFloat(rumoslide.getStyleElement(document.getElementById('foot'),'font-size'));
		fontsizedefaultCredits = parseFloat(rumoslide.getStyleElement(document.getElementById('credits'),'font-size'));
		if(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0]){
			fontsizedefaultObject = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0],'font-size'));
		}
		fontsizedefaultNavGraf = parseFloat(rumoslide.getStyleElement(document.getElementById('nav_graf'),'font-size'));
		rumoslide.NavGeneral();
		window.opener.focus();
		document.onkeydown = rumoslide.teclado;
		document.onclick = rumoslide.ratonClick;
		
		document.getElementsByTagName('body')[0].onresize = function() {
			rumoslide.verticalCenter(true);
			rumoslide.reText();
			return false;
		}
		rumoslide.fontsizedefaultHead = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'head')[0],'font-size'));
		rumoslide.fontsizedefaultContent = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'content')[0],'font-size'));
		rumoslide.fontsizedefaultFoot = parseFloat(rumoslide.getStyleElement(document.getElementById('foot'),'font-size'));
		rumoslide.fontsizedefaultCredits = parseFloat(rumoslide.getStyleElement(document.getElementById('credits'),'font-size'));
		if(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0]){
			rumoslide.fontsizedefaultObject = parseFloat(rumoslide.getStyleElement(rumoslide.getElementsByClassName(document, '*', 'bio_object')[0],'font-size'));
		}
		rumoslide.fontsizedefaultNavGraf = parseFloat(rumoslide.getStyleElement(document.getElementById('nav_graf'),'font-size'));
		window.opener.rumoslide.actTimer();
		if(!window.opener.micontrol)
			window.opener.rumoslide.controladora();
	}
}

var lang = window.opener.lang;
var slides = window.opener.slides;
var actual = window.opener.actual;
var ind_actual = window.opener.ind_actual;
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
addLoadEvent(rumoslide.cargaEstilos);
//addLoadEvent(rumoslide.cargaContenidos);
