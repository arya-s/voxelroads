import {
  Scene, PerspectiveCamera, BoxGeometry,
  Mesh, MeshBasicMaterial, WebGLRenderer
} from 'three';

var container = document.querySelector('#content');

var scene, camera, renderer;
var geometry, material, mesh;

var stats = new Stats();
container.appendChild(stats.dom);


const init = () => {

  scene = new Scene();

  camera = new PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  geometry = new BoxGeometry(200, 200, 200);
  material = new MeshBasicMaterial({color: 0xff0000, wireframe: true});

  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  container.appendChild(renderer.domElement);

};

const run = () => {

  requestAnimationFrame(run);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render(scene, camera);

  stats.update();

};

init();
run();