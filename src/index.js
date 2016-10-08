var container = document.querySelector('#content');

var loader = new THREE.CubeTextureLoader();
loader.setPath('assets/textures/');

var skyCube = loader.load([
  'sky_px.png', 'sky_nx.png',
  'sky_py.png', 'sky_ny.png',
  'sky_pz.png', 'sky_nz.png'
]);

var stats = new Stats();
container.appendChild(stats.dom);

var scene, camera, renderer, controls;
var geometry, material, mesh, raycaster;
void(raycaster);

var element = document.body;
element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
element.requestPointerLock();

var pointerlockchange = () => {

  if (document.pointerLockElement === element ||
      document.mozPointerLockElement === element ||
      document.webkitPointerLockElement === element) {
    controls.enabled = true;
  } else {
    controls.enabled = false;
  }

};

document.addEventListener('pointerlockchange', pointerlockchange, false);
document.addEventListener('mozpointerlockchange', pointerlockchange, false);
document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

element.addEventListener('click', () => {

  element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

  if (/Firefox/i.test(navigator.userAgent)) {

    var fullscreenchange = () => {

      if (document.fullscreenElement === element ||
          document.mozFullscreenElement === element ||
          document.mozFullScreenElement === element) {

        document.removeEventListener('fullscreenchange', fullscreenchange);
        document.removeEventListener('mozfullscreenchange', fullscreenchange);
        element.requestPointerLock();

      }

    };

    document.addEventListener('fullscreenchange', fullscreenchange, false);
    document.addEventListener('mozfullscreenchange', fullscreenchange, false);

  } else {

    element.requestPointerLock();

  }

}, false);

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();

const init = () => {

  scene = new THREE.Scene();
  scene.background = skyCube;

  camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 100000);
  camera.position.z = 500;

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  var ambient = new THREE.AmbientLight(0xffffff);
  scene.add( ambient );

  var pointLight = new THREE.PointLight(0xffffff, 2);
  scene.add( pointLight );

  geometry = new THREE.BoxGeometry( 200, 200, 200 );
  material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

  mesh = new THREE.Mesh( geometry, material );
  scene.add( mesh );

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

  var onKeyDown = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = true;
        break;
      case 37: // left
      case 65: // a
        moveLeft = true;
        break;
      case 40: // down
      case 83: // s
        moveBackward = true;
        break;
      case 39: // right
      case 68: // d
        moveRight = true;
        break;
      case 32: // space
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  var onKeyUp = function(event) {
    switch (event.keyCode) {
      case 38: // up
      case 87: // w
        moveForward = false;
        break;
      case 37: // left
      case 65: // a
        moveLeft = false;
        break;
      case 40: // down
      case 83: // s
        moveBackward = false;
        break;
      case 39: // right
      case 68: // d
        moveRight = false;
        break;
    }
  };

  document.addEventListener( 'keydown', onKeyDown, false );
  document.addEventListener( 'keyup', onKeyUp, false );

  raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

};

const run = () => {

  requestAnimationFrame(run);

  var time = performance.now();
  var delta = (time - prevTime) / 1000;
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
  if (moveForward) velocity.z -= 400.0 * delta;
  if (moveBackward) velocity.z += 400.0 * delta;
  if (moveLeft) velocity.x -= 400.0 * delta;
  if (moveRight) velocity.x += 400.0 * delta;

  controls.getObject().translateX(velocity.x * delta);
  controls.getObject().translateY(velocity.y * delta);
  controls.getObject().translateZ(velocity.z * delta);

  if (controls.getObject().position.y < 10) {
    velocity.y = 0;
    controls.getObject().position.y = 10;
  }

  prevTime = time;

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render(scene, camera);
  stats.update();

};

init();
run();