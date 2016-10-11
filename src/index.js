var element = document.querySelector('#content');

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

var camera, controls, renderer, scene, stats;

let init = () => {

  let textureLoader = new THREE.CubeTextureLoader();
  textureLoader.setPath('assets/textures/');

  let skyCube = textureLoader.load([
    'sky_px.png', 'sky_nx.png',
    'sky_py.png', 'sky_ny.png',
    'sky_pz.png', 'sky_nz.png'
  ]);

  scene = new THREE.Scene();
  scene.background = skyCube;

  scene.add(new THREE.AxisHelper(1000));

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 400, 1200);
  camera.lookAt(0, 0, 0);

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  let ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  let directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);

  let mtlLoader = new THREE.MTLLoader();
  mtlLoader.setPath('assets/models/');
  mtlLoader.load('ship.mtl', (materials) => {

    materials.preload();

    let objLoader = new THREE.OBJLoader();

    objLoader.setMaterials(materials);
    objLoader.setPath('assets/models/');

    objLoader.load('ship.obj', (ship) => {

      ship.scale.set(40, 40, 40);
      ship.position.set(20, -120, 50);
      ship.rotation.y = -Math.PI / 2;
      scene.add(ship);

    });

  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  stats = new Stats();

  element.appendChild(renderer.domElement);
  element.appendChild(stats.dom);

};

let render = () => {

  renderer.render(scene, camera);
  stats.update();
  window.requestAnimationFrame(render);

};

init();
render();
