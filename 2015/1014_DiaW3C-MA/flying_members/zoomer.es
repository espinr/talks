var debugFlag = false;
var debugObject = null;

// the namespace which is used everywhere

var svgns = "http://www.w3.org/2000/svg"
var xlinkns = "http://www.w3.org/1999/xlink";
var demons = "http://www.w3.org/2003/05/www2003demo";

// the SVG document

var doc = null;
var background = null;
var nodesG = null;
var nodes = new Array();

var env = this;

// create camera object
env.cam = {x:0, y:0, z:500, dx:0, dy:0, dz:-300};

// current marker
env.marker = 0;

// set environmental constants
env.fl = 1000;

// a string of words related to the wind
//env.somewords = "wind breeze storm stormy tornado text space three dimensional infinite recursive instance object distort environmental atmospheric blow gush whoosh thrash whirl push roar rush caress flow swoop";

//env.somewords = "CSS DOM XHTML MathML PNG QA RDF SMIL SOAP SVG TAG WAI XML XForms XQuery Web_Services Semantic_Web"

// convert the string of words into an array of words
env.wordList = new Array();
//env.wordList = env.somewords.split(" ");


SpaceWord.prototype.updateText = function() {

    this.text.firstChild.data = this.word.replace("_", " ");

}

SpaceWord.prototype.createGraphics = function() {

    this.node = doc.createElementNS(svgns, "g");
    this.node.setAttribute("pointer-events", "none");
    this.text = doc.createElementNS(svgns, "text");
    this.text.appendChild(doc.createTextNode(this.word.replace("_", " ")));

    this.button = doc.createElementNS(svgns, "rect");
    this.button.setAttribute("x", "-20");
    this.button.setAttribute("y", "-10");
    this.button.setAttribute("width", "40");
    this.button.setAttribute("height", "12");
    this.button.setAttribute("fill", "blue");
    this.button.setAttribute("fill-opacity", "0");
    //this.button.setAttribute("onclick", "pressed(" + nodes.length + ")");

    this.node.appendChild(this.text);
    this.node.appendChild(this.button);

    nodesG.appendChild(this.node);
}

SpaceWord.prototype.updateGraphics = function() {

    this.node.setAttribute("transform", "translate(" + this._x + "," + this._y + ") scale(" + this._scale + ")");
    this.node.setAttribute("fill-opacity", this._alpha);

}

// hack function to link button press to node

function pressed(i) {
    nodes[i].onPress();
}


// constructor
function SpaceWord(word, x, y, z) {

    this.x = x;
    this.y = y;
    this.z = z;
    this._x = x;
    this._y = y;
    this._z = z;
    this._scale = 1;
    this._alpha = 1;
    this.word = word;

    this.createGraphics();
    this.updateGraphics();

    this.onPress = function() {
	env.cam.dx = this.x;
	env.cam.dy = this.y;
	env.cam.dz = this.z+env.fl*.9;

// 	  this.enabled = false;
// 	  this._visible = false;
    };

}

SpaceWord.prototype.process = function() {
    var zActual = env.fl+this.z-env.cam.z;
    if (zActual>0) {
	// object is still visible
	// calculate scale
	var scale = env.fl/zActual;
        // set position using camera as an offset
	this._x = (this.x-env.cam.x)*scale;
	this._y = (this.y-env.cam.y)*scale;
        // set size
	this._scale = scale;
	// set fog
	this._alpha = (100 - 99 * zActual/env.fl*.5) / 100;
    } else {
	// object has moved behind camera
        // reposition further down the line
	this.z += env.fl*2;

	// replace word with next in list
	if (env.marker >= env.wordList.length) {
          env.marker = 0;
        }
	this.word = env.wordList[env.marker];
	this.updateText();
	env.marker++;
	
	// enable button
	//  this.btnSquare.enabled = true;
	//this.btnSquare._visible = true;
    }

    this.updateGraphics();
}

SpaceWord.prototype.setWord = function(s) {
    this.word = s;
};

SpaceWord.prototype.setPosition = function(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
};



function debugInit() {
    if (debugFlag) {
	debugObject = doc.createElementNS(svgns, "text");
	debugObject.setAttribute("x", "20");
	debugObject.setAttribute("y", "30");
	debugObject.setAttribute("font-size", "20");
	debugObject.setAttribute("fill", "black");
	debugObject.setAttribute("pointer-events", "none");
	var text = doc.createTextNode("debug message");
	debugObject.appendChild(text);
	doc.documentElement.appendChild(debugObject);
    }
}

function debug(message) {
    if (debugFlag) {
	debugObject.firstChild.data = message;
    }
}

function init() {
    
    doc = document;
    debugInit();

    nodesG = createNodesGroup();
    var items = doc.getElementsByTagNameNS(demons, "name");

    for (var i=0; i < items.length; i++) {
	env.wordList.push(items.item(i).getAttribute("label"));
    }

    env.marker = Math.round(Math.random() * (env.wordList.length - 1));
    for (var i = 0; i < 10; i++) {
	var word = env.wordList[env.marker];
	var x = random(500)-250;
	var y = random(300)-150;
	var z = random(env.fl * 2) - env.fl;

	var n = new SpaceWord(word, x, y, z);
	nodes.push(n);
        env.marker++;
	if (env.marker == env.wordList.length) {
	    env.marker = 0;
	}
    }

    setTimeout("displayLoop()", 10);
}

var count = 50000;

function displayLoop() {

    env.cam.dz+=.5;
    // move the camera to its destination
    env.cam.x += (env.cam.dx-env.cam.x)/10;
    env.cam.y += (env.cam.dy-env.cam.y)/10;
    env.cam.z += (env.cam.dz-env.cam.z)/30;

    for (var i = 0; i < nodes.length; i++) {
	var n = nodes[i];
	n.process();
    }

    if (count > 0) {
	setTimeout("displayLoop()", 10);
	count--;
        if (count % 80 == 40) {
	  pressed(Math.round(Math.random() * 9));
        }
    }

}


function random(max) {
    return Math.random()*max;
}

function createNodesGroup() {
    var g = doc.createElementNS(svgns, "g");
    g.setAttribute("transform", "translate(" + window.innerWidth/2 + "," + window.innerHeight/2 + ")");
    g.setAttribute("text-anchor", "middle");
    g.setAttribute("text-rendering", "geometricPrecision");
    g.setAttribute("font-family", "Trebuchet MS");
    g.setAttribute("font-weight", "bold");
    doc.documentElement.appendChild(g);
    return g;
}


