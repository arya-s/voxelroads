class Skybox {

  static init() {

    let textureLoader = new THREE.CubeTextureLoader();
    textureLoader.setPath('assets/textures/');

    return textureLoader.load([
      'sky_px.png', 'sky_nx.png',
      'sky_py.png', 'sky_ny.png',
      'sky_pz.png', 'sky_nz.png'
    ]);

  }
  
}

export default Skybox;
