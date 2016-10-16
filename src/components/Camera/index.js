class Camera {

  static init() {

    let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(0, 400, 1200);
    camera.lookAt(0, 0, 0);

    return camera;

  }
  
}

export default Camera;
