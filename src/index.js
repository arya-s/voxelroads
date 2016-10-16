import OBJModel from './components/OBJModel/index.js';
import Skybox from './components/Skybox/index.js';
import Camera from './components/Camera/index.js';
import PointerLock from './components/PointerLock/index.js';

let renderOn = document.querySelector('#content');
let camera, controls, renderer, scene, stats;

let init = () => {

  stats = new Stats();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderOn.appendChild(renderer.domElement);
  renderOn.appendChild(stats.dom);

  camera = Camera.init();
  controls = new THREE.PointerLockControls(camera);
  PointerLock.init(renderOn, controls);

  let ambient = new THREE.AmbientLight(0x444444);
  let directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(1, 1, 0).normalize();

  scene = new THREE.Scene();
  scene.background = Skybox.init();

  scene.add(new THREE.AxisHelper(1000));
  scene.add(controls.getObject());
  scene.add(ambient);
  scene.add(directionalLight);

  let shipmodel = new OBJModel('assets/models/ship.obj', 'assets/models/ship.mtl');
  shipmodel.load(ship => {

    ship.scale.set(40, 40, 40);
    ship.position.set(20, -120, 50);
    ship.rotation.y = -Math.PI / 2;
    scene.add(ship); 
      
  });

};

let render = () => {

  renderer.render(scene, camera);
  stats.update();
  window.requestAnimationFrame(render);

};

init();
render();
