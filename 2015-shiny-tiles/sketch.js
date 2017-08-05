// ******************************
// Boilerplate to get you started
var scene = new THREE.Scene();

// We're going to use WebGL to render everything (if your browser does not support WebGL you can try the
// CanvasRenderer, although you will be more limited in what you can accomplish)
var renderer = new THREE.WebGLRenderer({ devicePixelRatio:window.devicePixelRatio, antialias: true});
// If you don't have WebGL use the line below.
// var renderer = new THREE.CanvasRenderer()

// Set the size of the renderer so that it fills the entire screen
renderer.setSize( window.innerWidth, window.innerHeight );

// This actually places the renderer on the screen where we will be able to see it
document.body.appendChild( renderer.domElement );

// This creates the camera through which we are going to look at the scene
// The first parameter says that the field of view of this camera will be 75 degrees,
// The second parameter defines the aspect ratio,
// The last two parameters define "clipping planes". We will only render objects that are further
// than the first distance, and closer than the second.
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// End of boilerplate
// *******************************

var rotateVector = new THREE.Vector3(1, 0, 0);
camera.rotateOnAxis(rotateVector, 0.5);

var scale = 0.5;
var columns = 30;
var rows = 20;
var depth = 1;
var margin = 1.05;

// Move the camera back 5 units, looking towards the origin
camera.position.z = 5;
camera.position.x = Math.floor(columns / 2) * scale;
camera.position.y = Math.floor(columns / 2) * scale - 6.5;

var center = {
    x: Math.floor(columns / 2) * scale,
    y: Math.floor(rows / 2) * scale
}

var bumpMap = new THREE.ImageUtils.loadTexture("bumps.png");

//var boxGeometry = new THREE.BoxGeometry( scale, scale, 0.001);
var boxGeometry = new THREE.PlaneGeometry( scale, scale, 8, 8);

// Bumpify
var count = 0;
boxGeometry.vertices.forEach(function(v) { 
    count++;
    v.z = (count % 2) * 0.0005;
    //v.z = Math.round(Math.random()) * 0.001;
});
boxGeometry.computeVertexNormals()
boxGeometry.computeFaceNormals()

// Let's make a large number of cubes, sharing the same
// basic geometry. We'll position them later.
var numCubes = columns * rows * depth;
//var materialColor = 0xdf8d01;
var materialColor = 0xffffff * Math.random();
// This will be an array containing all the cubes.
var cubes = [];
for (var i = 0; i < numCubes; i++) {
	// Construct the new cube
    materialColor+= Math.round(100000 * (0.5 - Math.random()));
    var material = new THREE.MeshPhongMaterial({
        color: materialColor, specular: 0xffffff, shininess: 100
    });
    material.shading = THREE.FlatShading;

	var cube = new THREE.Mesh(boxGeometry, material);
    cube._state = false;

	// And add it to the end of the array.
	cubes.push(cube);

	// Also add it to the scene.
	scene.add(cube);
}

//var light = new THREE.PointLight(0xffffff, 0.1, 50);
//light.rotateOnAxis(rotateVector, 0.8);
//light.position.set(center.x, center.y, 5);
//scene.add(light);
//
var light1 = new THREE.PointLight(0xffffff, 0.05);
light1.rotateOnAxis(rotateVector, 0.2);
light1.position.set(center.x, center.y+90, 150);
scene.add(light1);

var light2 = new THREE.PointLight(0xffffff, 0.05);
light2.rotateOnAxis(rotateVector, 0.2);
light2.position.set(center.x-columns-20, center.y+30, 100);
scene.add(light2);

var light3 = new THREE.PointLight(0xffffff, 0.05);
light3.rotateOnAxis(rotateVector, 0.2);
light3.position.set(center.x+columns+20, center.y+30, 100);
scene.add(light3);

var ambientLight = new THREE.AmbientLight(0x999999);
scene.add(ambientLight);

// *********************************
// Configure the animation
//
// This function repeatedly calls the render() function,
// causing an animation
function animate() {
	requestAnimationFrame(animate);
	render();
}


// This function is is called to draw the scene, and do any updates which
// need to happen every frame
var t = 0;
var speed = 1;
function render() {
	t++;
    //
	// Let's set the positions and sizes of the cubes using trig functions
	// varying them with time, as well as with their position in the list.
	for (var i = 0; i < cubes.length; i++) {
		//cubes[i].scale.set(0.05, 0.05*(Math.sin(i*0.1)+2), 0.05);
        var column = i % columns;
        var row = Math.floor(i / columns);
        var cube = cubes[i];

		cube.position.x = column * scale * margin;
		cube.position.y = row * scale * margin;
		cube.position.z = 1;

        if (cube._state != false) {
            cube.rotateOnAxis(rotateVector, Math.cos(cube._state)*0.015);
            cube._state += 0.02 * Math.PI;
            if (cube._state >= 6*Math.PI) {
                cube._state = false;
            }
        } else if (Math.random() < 0.01) {
            cube._state = 0.0001;
            //var neg = 0.5 - Math.random()
            //cubes[i].rotateOnAxis(rotateVector, rows % t / 100.0 * neg);
        }
	}
	renderer.render(scene, camera);
};

// Start animating!
animate();
