(function () {
'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var objLoader = new THREE.OBJLoader();
var mtlLoader = new THREE.MTLLoader();

var OBJModel = function () {
  function OBJModel(obj) {
    var mtl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    classCallCheck(this, OBJModel);


    this.obj = obj;
    this.mtl = mtl;
  }

  createClass(OBJModel, [{
    key: "load",
    value: function load(done) {
      var _this = this;

      if (this.mtl) {

        mtlLoader.load(this.mtl, function (materials) {

          materials.preload();
          _this._loadObj(materials, done);
        });
      } else {
        this._loadObj(null, done);
      }
    }
  }, {
    key: "_loadObj",
    value: function _loadObj(materials, done) {

      if (materials) {
        objLoader.setMaterials(materials);
      }

      objLoader.load(this.obj, done);
    }
  }]);
  return OBJModel;
}();

var Skybox = function () {
  function Skybox() {
    classCallCheck(this, Skybox);
  }

  createClass(Skybox, null, [{
    key: 'init',
    value: function init() {

      var textureLoader = new THREE.CubeTextureLoader();
      textureLoader.setPath('assets/textures/');

      return textureLoader.load(['sky_px.png', 'sky_nx.png', 'sky_py.png', 'sky_ny.png', 'sky_pz.png', 'sky_nz.png']);
    }
  }]);
  return Skybox;
}();

var Camera = function () {
  function Camera() {
    classCallCheck(this, Camera);
  }

  createClass(Camera, null, [{
    key: "init",
    value: function init() {

      var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
      camera.position.set(0, 400, 1200);
      camera.lookAt(0, 0, 0);

      return camera;
    }
  }]);
  return Camera;
}();

var PointerLock = function () {
  function PointerLock() {
    classCallCheck(this, PointerLock);
  }

  createClass(PointerLock, null, [{
    key: 'init',
    value: function init(elm, controls) {

      var pointerlockchange = function pointerlockchange() {

        if (document.pointerLockElement === elm || document.mozPointerLockElement === elm || document.webkitPointerLockElement === elm) {
          controls.enabled = true;
        } else {
          controls.enabled = false;
        }
      };

      document.addEventListener('pointerlockchange', pointerlockchange, false);
      document.addEventListener('mozpointerlockchange', pointerlockchange, false);
      document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

      elm.addEventListener('click', function () {

        elm.requestPointerLock = elm.requestPointerLock || elm.mozRequestPointerLock || elm.webkitRequestPointerLock;

        if (/Firefox/i.test(navigator.userAgent)) {
          (function () {

            var fullscreenchange = function fullscreenchange() {

              if (document.fullscreenelm === elm || document.mozFullscreenelm === elm || document.mozFullScreenelm === elm) {

                document.removeEventListener('fullscreenchange', fullscreenchange);
                document.removeEventListener('mozfullscreenchange', fullscreenchange);
                elm.requestPointerLock();
              }
            };

            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);
          })();
        } else {

          elm.requestPointerLock();
        }
      }, false);
    }
  }]);
  return PointerLock;
}();

var renderOn = document.querySelector('#content');
var camera = void 0;
var controls = void 0;
var renderer = void 0;
var scene = void 0;
var stats = void 0;

var init$1 = function init$1() {

  stats = new Stats();
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderOn.appendChild(renderer.domElement);
  renderOn.appendChild(stats.dom);

  camera = Camera.init();
  controls = new THREE.PointerLockControls(camera);
  PointerLock.init(renderOn, controls);

  var ambient = new THREE.AmbientLight(0x444444);
  var directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(1, 1, 0).normalize();

  scene = new THREE.Scene();
  scene.background = Skybox.init();

  scene.add(new THREE.AxisHelper(1000));
  scene.add(controls.getObject());
  scene.add(ambient);
  scene.add(directionalLight);

  var shipmodel = new OBJModel('assets/models/ship.obj', 'assets/models/ship.mtl');
  shipmodel.load(function (ship) {

    ship.scale.set(40, 40, 40);
    ship.position.set(20, -120, 50);
    ship.rotation.y = -Math.PI / 2;
    scene.add(ship);
  });
};

var render = function render() {

  renderer.render(scene, camera);
  stats.update();
  window.requestAnimationFrame(render);
};

init$1();
render();

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL09CSk1vZGVsL2luZGV4LmpzIiwiLi4vLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94L2luZGV4LmpzIiwiLi4vLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhL2luZGV4LmpzIiwiLi4vLi4vc3JjL2NvbXBvbmVudHMvUG9pbnRlckxvY2svaW5kZXguanMiLCIuLi8uLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IG9iakxvYWRlciA9IG5ldyBUSFJFRS5PQkpMb2FkZXIoKTtcbmxldCBtdGxMb2FkZXIgPSBuZXcgVEhSRUUuTVRMTG9hZGVyKCk7XG5cbmNsYXNzIE9CSk1vZGVsIHtcblxuICBjb25zdHJ1Y3RvcihvYmosIG10bD1udWxsKSB7XG5cbiAgICB0aGlzLm9iaiA9IG9iajtcbiAgICB0aGlzLm10bCA9IG10bDtcblxuICB9XG5cbiAgbG9hZChkb25lKSB7XG5cbiAgICBpZiAodGhpcy5tdGwpIHtcblxuICAgICAgbXRsTG9hZGVyLmxvYWQodGhpcy5tdGwsIG1hdGVyaWFscyA9PiB7XG5cbiAgICAgICAgbWF0ZXJpYWxzLnByZWxvYWQoKTtcbiAgICAgICAgdGhpcy5fbG9hZE9iaihtYXRlcmlhbHMsIGRvbmUpO1xuXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9sb2FkT2JqKG51bGwsIGRvbmUpO1xuICAgIH1cblxuICB9XG5cbiAgX2xvYWRPYmoobWF0ZXJpYWxzLCBkb25lKSB7XG5cbiAgICBpZiAobWF0ZXJpYWxzKSB7XG4gICAgICBvYmpMb2FkZXIuc2V0TWF0ZXJpYWxzKG1hdGVyaWFscyk7XG4gICAgfVxuXG4gICAgb2JqTG9hZGVyLmxvYWQodGhpcy5vYmosIGRvbmUpO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBPQkpNb2RlbDtcbiIsImNsYXNzIFNreWJveCB7XG5cbiAgc3RhdGljIGluaXQoKSB7XG5cbiAgICBsZXQgdGV4dHVyZUxvYWRlciA9IG5ldyBUSFJFRS5DdWJlVGV4dHVyZUxvYWRlcigpO1xuICAgIHRleHR1cmVMb2FkZXIuc2V0UGF0aCgnYXNzZXRzL3RleHR1cmVzLycpO1xuXG4gICAgcmV0dXJuIHRleHR1cmVMb2FkZXIubG9hZChbXG4gICAgICAnc2t5X3B4LnBuZycsICdza3lfbngucG5nJyxcbiAgICAgICdza3lfcHkucG5nJywgJ3NreV9ueS5wbmcnLFxuICAgICAgJ3NreV9wei5wbmcnLCAnc2t5X256LnBuZydcbiAgICBdKTtcblxuICB9XG4gIFxufVxuXG5leHBvcnQgZGVmYXVsdCBTa3lib3g7XG4iLCJjbGFzcyBDYW1lcmEge1xuXG4gIHN0YXRpYyBpbml0KCkge1xuXG4gICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMDApO1xuICAgIGNhbWVyYS5wb3NpdGlvbi5zZXQoMCwgNDAwLCAxMjAwKTtcbiAgICBjYW1lcmEubG9va0F0KDAsIDAsIDApO1xuXG4gICAgcmV0dXJuIGNhbWVyYTtcblxuICB9XG4gIFxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW1lcmE7XG4iLCJjbGFzcyBQb2ludGVyTG9jayB7XG5cbiAgc3RhdGljIGluaXQoZWxtLCBjb250cm9scykge1xuXG4gICAgbGV0IHBvaW50ZXJsb2NrY2hhbmdlID0gKCkgPT4ge1xuXG4gICAgICBpZiAoZG9jdW1lbnQucG9pbnRlckxvY2tFbGVtZW50ID09PSBlbG0gfHxcbiAgICAgICAgICBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnQgPT09IGVsbSB8fFxuICAgICAgICAgIGRvY3VtZW50LndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCA9PT0gZWxtKSB7XG4gICAgICAgIGNvbnRyb2xzLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29udHJvbHMuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BvaW50ZXJsb2NrY2hhbmdlJywgcG9pbnRlcmxvY2tjaGFuZ2UsIGZhbHNlKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3pwb2ludGVybG9ja2NoYW5nZScsIHBvaW50ZXJsb2NrY2hhbmdlLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0cG9pbnRlcmxvY2tjaGFuZ2UnLCBwb2ludGVybG9ja2NoYW5nZSwgZmFsc2UpO1xuXG4gICAgZWxtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gICAgICBlbG0ucmVxdWVzdFBvaW50ZXJMb2NrID0gZWxtLnJlcXVlc3RQb2ludGVyTG9jayB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsbS5tb3pSZXF1ZXN0UG9pbnRlckxvY2sgfHwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxtLndlYmtpdFJlcXVlc3RQb2ludGVyTG9jaztcblxuICAgICAgaWYgKC9GaXJlZm94L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuXG4gICAgICAgIGxldCBmdWxsc2NyZWVuY2hhbmdlID0gKCkgPT4ge1xuXG4gICAgICAgICAgaWYgKGRvY3VtZW50LmZ1bGxzY3JlZW5lbG0gPT09IGVsbSB8fFxuICAgICAgICAgICAgICBkb2N1bWVudC5tb3pGdWxsc2NyZWVuZWxtID09PSBlbG0gfHxcbiAgICAgICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbmVsbSA9PT0gZWxtKSB7XG5cbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBmdWxsc2NyZWVuY2hhbmdlKTtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCBmdWxsc2NyZWVuY2hhbmdlKTtcbiAgICAgICAgICAgIGVsbS5yZXF1ZXN0UG9pbnRlckxvY2soKTtcblxuICAgICAgICAgIH1cblxuICAgICAgICB9O1xuXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBmdWxsc2NyZWVuY2hhbmdlLCBmYWxzZSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCBmdWxsc2NyZWVuY2hhbmdlLCBmYWxzZSk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgZWxtLnJlcXVlc3RQb2ludGVyTG9jaygpO1xuXG4gICAgICB9XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvaW50ZXJMb2NrO1xuIiwiaW1wb3J0IE9CSk1vZGVsIGZyb20gJy4vY29tcG9uZW50cy9PQkpNb2RlbC9pbmRleC5qcyc7XG5pbXBvcnQgU2t5Ym94IGZyb20gJy4vY29tcG9uZW50cy9Ta3lib3gvaW5kZXguanMnO1xuaW1wb3J0IENhbWVyYSBmcm9tICcuL2NvbXBvbmVudHMvQ2FtZXJhL2luZGV4LmpzJztcbmltcG9ydCBQb2ludGVyTG9jayBmcm9tICcuL2NvbXBvbmVudHMvUG9pbnRlckxvY2svaW5kZXguanMnO1xuXG5sZXQgcmVuZGVyT24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xubGV0IGNhbWVyYSwgY29udHJvbHMsIHJlbmRlcmVyLCBzY2VuZSwgc3RhdHM7XG5cbmxldCBpbml0ID0gKCkgPT4ge1xuXG4gIHN0YXRzID0gbmV3IFN0YXRzKCk7XG4gIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgcmVuZGVyT24uYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIHJlbmRlck9uLmFwcGVuZENoaWxkKHN0YXRzLmRvbSk7XG5cbiAgY2FtZXJhID0gQ2FtZXJhLmluaXQoKTtcbiAgY29udHJvbHMgPSBuZXcgVEhSRUUuUG9pbnRlckxvY2tDb250cm9scyhjYW1lcmEpO1xuICBQb2ludGVyTG9jay5pbml0KHJlbmRlck9uLCBjb250cm9scyk7XG5cbiAgbGV0IGFtYmllbnQgPSBuZXcgVEhSRUUuQW1iaWVudExpZ2h0KDB4NDQ0NDQ0KTtcbiAgbGV0IGRpcmVjdGlvbmFsTGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZWVkZCk7XG4gIGRpcmVjdGlvbmFsTGlnaHQucG9zaXRpb24uc2V0KDEsIDEsIDApLm5vcm1hbGl6ZSgpO1xuXG4gIHNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XG4gIHNjZW5lLmJhY2tncm91bmQgPSBTa3lib3guaW5pdCgpO1xuXG4gIHNjZW5lLmFkZChuZXcgVEhSRUUuQXhpc0hlbHBlcigxMDAwKSk7XG4gIHNjZW5lLmFkZChjb250cm9scy5nZXRPYmplY3QoKSk7XG4gIHNjZW5lLmFkZChhbWJpZW50KTtcbiAgc2NlbmUuYWRkKGRpcmVjdGlvbmFsTGlnaHQpO1xuXG4gIGxldCBzaGlwbW9kZWwgPSBuZXcgT0JKTW9kZWwoJ2Fzc2V0cy9tb2RlbHMvc2hpcC5vYmonLCAnYXNzZXRzL21vZGVscy9zaGlwLm10bCcpO1xuICBzaGlwbW9kZWwubG9hZChzaGlwID0+IHtcblxuICAgIHNoaXAuc2NhbGUuc2V0KDQwLCA0MCwgNDApO1xuICAgIHNoaXAucG9zaXRpb24uc2V0KDIwLCAtMTIwLCA1MCk7XG4gICAgc2hpcC5yb3RhdGlvbi55ID0gLU1hdGguUEkgLyAyO1xuICAgIHNjZW5lLmFkZChzaGlwKTsgXG4gICAgICBcbiAgfSk7XG5cbn07XG5cbmxldCByZW5kZXIgPSAoKSA9PiB7XG5cbiAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICBzdGF0cy51cGRhdGUoKTtcbiAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShyZW5kZXIpO1xuXG59O1xuXG5pbml0KCk7XG5yZW5kZXIoKTtcbiJdLCJuYW1lcyI6WyJvYmpMb2FkZXIiLCJUSFJFRSIsIk9CSkxvYWRlciIsIm10bExvYWRlciIsIk1UTExvYWRlciIsIk9CSk1vZGVsIiwib2JqIiwibXRsIiwiZG9uZSIsImxvYWQiLCJwcmVsb2FkIiwiX2xvYWRPYmoiLCJtYXRlcmlhbHMiLCJzZXRNYXRlcmlhbHMiLCJTa3lib3giLCJ0ZXh0dXJlTG9hZGVyIiwiQ3ViZVRleHR1cmVMb2FkZXIiLCJzZXRQYXRoIiwiQ2FtZXJhIiwiY2FtZXJhIiwiUGVyc3BlY3RpdmVDYW1lcmEiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJwb3NpdGlvbiIsInNldCIsImxvb2tBdCIsIlBvaW50ZXJMb2NrIiwiZWxtIiwiY29udHJvbHMiLCJwb2ludGVybG9ja2NoYW5nZSIsImRvY3VtZW50IiwicG9pbnRlckxvY2tFbGVtZW50IiwibW96UG9pbnRlckxvY2tFbGVtZW50Iiwid2Via2l0UG9pbnRlckxvY2tFbGVtZW50IiwiZW5hYmxlZCIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXF1ZXN0UG9pbnRlckxvY2siLCJtb3pSZXF1ZXN0UG9pbnRlckxvY2siLCJ3ZWJraXRSZXF1ZXN0UG9pbnRlckxvY2siLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiZnVsbHNjcmVlbmNoYW5nZSIsImZ1bGxzY3JlZW5lbG0iLCJtb3pGdWxsc2NyZWVuZWxtIiwibW96RnVsbFNjcmVlbmVsbSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJyZW5kZXJPbiIsInF1ZXJ5U2VsZWN0b3IiLCJyZW5kZXJlciIsInNjZW5lIiwic3RhdHMiLCJpbml0IiwiU3RhdHMiLCJXZWJHTFJlbmRlcmVyIiwic2V0U2l6ZSIsImFwcGVuZENoaWxkIiwiZG9tRWxlbWVudCIsImRvbSIsIlBvaW50ZXJMb2NrQ29udHJvbHMiLCJhbWJpZW50IiwiQW1iaWVudExpZ2h0IiwiZGlyZWN0aW9uYWxMaWdodCIsIkRpcmVjdGlvbmFsTGlnaHQiLCJub3JtYWxpemUiLCJTY2VuZSIsImJhY2tncm91bmQiLCJhZGQiLCJBeGlzSGVscGVyIiwiZ2V0T2JqZWN0Iiwic2hpcG1vZGVsIiwic2NhbGUiLCJyb3RhdGlvbiIsInkiLCJNYXRoIiwiUEkiLCJzaGlwIiwicmVuZGVyIiwidXBkYXRlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFZLElBQUlDLE1BQU1DLFNBQVYsRUFBaEI7QUFDQSxJQUFJQyxZQUFZLElBQUlGLE1BQU1HLFNBQVYsRUFBaEI7O0lBRU1DO29CQUVRQyxHQUFaLEVBQTJCO1FBQVZDLEdBQVUsdUVBQU4sSUFBTTs7OztTQUVwQkQsR0FBTCxHQUFXQSxHQUFYO1NBQ0tDLEdBQUwsR0FBV0EsR0FBWDs7Ozs7eUJBSUdDLE1BQU07OztVQUVMLEtBQUtELEdBQVQsRUFBYzs7a0JBRUZFLElBQVYsQ0FBZSxLQUFLRixHQUFwQixFQUF5QixxQkFBYTs7b0JBRTFCRyxPQUFWO2dCQUNLQyxRQUFMLENBQWNDLFNBQWQsRUFBeUJKLElBQXpCO1NBSEY7T0FGRixNQVNPO2FBQ0FHLFFBQUwsQ0FBYyxJQUFkLEVBQW9CSCxJQUFwQjs7Ozs7NkJBS0tJLFdBQVdKLE1BQU07O1VBRXBCSSxTQUFKLEVBQWU7a0JBQ0hDLFlBQVYsQ0FBdUJELFNBQXZCOzs7Z0JBR1FILElBQVYsQ0FBZSxLQUFLSCxHQUFwQixFQUF5QkUsSUFBekI7Ozs7SUFNSjs7SUN6Q01NOzs7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
