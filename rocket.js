var canvas  = document.querySelector("canvas"); 
var surface  = canvas.getContext("2d");

//CONSTANTS
G = 1
timestep = 1
boost = 0.2
rock_m = 200
ship_m = 10

var RIGHT = 39;
var LEFT = 37;
var SPACE = 32;
var letter_R = 82
var boost_on = false

initial()

//INITIAL CONDITIONS
function initial(){
	rock_x = canvas.width*0.5
	rock_y = canvas.height*0.5
	ship_x = 100
	ship_y = 40
	ship_dir = 0
	ship_vx = 0
	ship_vy = 0
}

//LOAD IMAGES
var assetsToLoad = [];
var assetsLoaded = 0;

var rocket_img = new Image();
rocket_img.addEventListener("load", loadHandler, false);
rocket_img.src = "rocket/rocket_img.png";
assetsToLoad.push(rocket_img);

var rocket2_img = new Image();
rocket2_img.addEventListener("load", loadHandler, false);
rocket2_img.src = "rocket/rocket_img2.png";
assetsToLoad.push(rocket2_img);

var stars_img = new Image();
stars_img.addEventListener("load", loadHandler, false);
stars_img.src = "rocket/stars_img.png";
assetsToLoad.push(rocket_img);

var earth_img = new Image();
earth_img.addEventListener("load", loadHandler, false);
document.body.appendChild(earth_img);
earth_img.src = "rocket/earth_img.gif";
earth_img.style.width = 1;
earth_img.style.height = 1;
assetsToLoad.push(earth_img);

var expo_img = new Image();
expo_img.addEventListener("load", loadHandler, false);
document.body.appendChild(expo_img);
expo_img .src = "rocket/expo_img.gif";
expo_img.style.width = 1;
expo_img.style.height = 1;
assetsToLoad.push(earth_img);

function loadHandler(){
	assetsLoaded++;
	if(assetsLoaded === assetsToLoad.length){
		rocket_img.removeEventListener("load", loadHandler, false);
		rocket2_img.removeEventListener("load", loadHandler, false);
		stars_img.removeEventListener("load", loadHandler, false);
		earth_img.removeEventListener("load", loadHandler, false);
		expo_img.removeEventListener("load", loadHandler, false);
		earth_img.style.width = 100;
		earth_img.style.height = 100;
		earth_img.style.zIndex="2"
		earth_img.style.position = "absolute";
		earth_img.style.left = String(canvas.width*0.5 + canvas.offsetLeft - 50)+"px";
		earth_img.style.top = String(canvas.height*0.5 + canvas.offsetTop - 50)+"px";
		draw_rocket()
	}
}


function draw_rocket(){
	surface.clearRect(0,0,canvas.width,canvas.height);
	surface.drawImage(stars_img,0,0,canvas.width,canvas.height);
	loop = requestAnimationFrame(draw_rocket, canvas)
	
	radius = find_length(rock_x,rock_y,ship_x,ship_y)
	
	if(radius < 40){
		expo_img.src = "rocket/expo_img.gif";
		document.body.appendChild(expo_img);
		expo_img.style.position = "absolute";
		expo_img.style.width = 80;
		expo_img.style.height = 80;
		expo_img.style.zIndex="1"
		expo_img.style.left = String(ship_x - 40 + canvas.offsetLeft)+"px";
		expo_img.style.top = String(ship_y - 40 + canvas.offsetTop)+"px";
		cancelAnimationFrame(loop)
	}
	else{
		gravitation = G*rock_m*ship_m*Math.pow(radius,-2)
		gravitation_x = (rock_x - ship_x)/radius * gravitation
		gravitation_y = (rock_y - ship_y)/radius * gravitation

		ship_ax = gravitation_x/ship_m
		ship_ay = gravitation_y/ship_m

		ship_vx +=  ship_ax*timestep
		ship_vy +=  ship_ay*timestep

		ship_x += ship_vx*timestep
		ship_y += ship_vy*timestep

		surface.save();
		surface.translate(Math.floor(ship_x),Math.floor(ship_y));
		surface.rotate(ship_dir*Math.PI/180);
		
		if(boost_on === true){
			surface.drawImage(rocket2_img,-rocket_img.width/2,-rocket_img.height/2);
		}
		else{
			surface.drawImage(rocket_img,-rocket_img.width/2,-rocket_img.height/2);	
		}
		surface.restore();	

	}
}

window.addEventListener("keydown", keydownHandler, false);
function keydownHandler(event){
	if(event.keyCode === letter_R){
		restart_game();
	}
	if(event.keyCode === SPACE){
		ship_vx += find_dx(ship_dir,boost)
		ship_vy += -find_dy(ship_dir,boost)
		boost_on = true
	}
	if(event.keyCode === LEFT){
		ship_dir += -10
	}
	if(event.keyCode === RIGHT){
		ship_dir += +10
	}
}

window.addEventListener("keyup", keyupHandler, false);
function keyupHandler(event){
	if(event.keyCode === SPACE){
		boost_on = false
	}
}

function restart_game(){
	cancelAnimationFrame(loop)
	initial()
	draw_rocket()
}



//standard trig. functions
function find_length(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}
function find_dir(x1,y1,x2,y2){
	return Math.atan2(y1-y2,x2-x1)/(2*Math.PI)*360;
}
function find_dx(angle,length){
	return Math.cos(angle/360*(2*Math.PI))*length;
}
function find_dy(angle,length){
	return -Math.sin(angle/360*(2*Math.PI))*length;
}
