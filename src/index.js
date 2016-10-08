import {
  Scene, PerspectiveCamera, BoxGeometry,
  Mesh, MeshBasicMaterial, WebGLRenderer
} from 'three';


var scene, camera, renderer;
var geometry, material, mesh;

const init = () => {

  scene = new Scene();

  camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 1000;

  geometry = new BoxGeometry(200, 200, 200);
  material = new MeshBasicMaterial({color: 0xff0000, wireframe: true});

  mesh = new Mesh(geometry, material);
  scene.add(mesh);

  renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  document.querySelector('#content').appendChild(renderer.domElement);

};

const run = () => {

  requestAnimationFrame(run);

  mesh.rotation.x += 0.01;
  mesh.rotation.y += 0.02;

  renderer.render(scene, camera);

};

init();
run();