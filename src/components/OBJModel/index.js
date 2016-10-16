let objLoader = new THREE.OBJLoader();
let mtlLoader = new THREE.MTLLoader();

class OBJModel {

  constructor(obj, mtl=null) {

    this.obj = obj;
    this.mtl = mtl;

  }

  load(done) {

    if (this.mtl) {

      mtlLoader.load(this.mtl, materials => {

        materials.preload();
        this._loadObj(materials, done);

      });

    } else {
      this._loadObj(null, done);
    }

  }

  _loadObj(materials, done) {

    if (materials) {
      objLoader.setMaterials(materials);
    }

    objLoader.load(this.obj, done);

  }

}

export default OBJModel;
