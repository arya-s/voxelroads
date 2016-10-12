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

var element = document.querySelector('#content');
var pointerlockchange = function pointerlockchange() {

  if (document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element) {
    controls.enabled = true;
  } else {
    controls.enabled = false;
  }
};

document.addEventListener('pointerlockchange', pointerlockchange, false);
document.addEventListener('mozpointerlockchange', pointerlockchange, false);
document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

element.addEventListener('click', function () {

  element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

  if (/Firefox/i.test(navigator.userAgent)) {

    var fullscreenchange = function fullscreenchange() {

      if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

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

var camera;
var controls;
var renderer;
var scene;
var stats;

var init = function init() {

  var textureLoader = new THREE.CubeTextureLoader();
  textureLoader.setPath('assets/textures/');

  var skyCube = textureLoader.load(['sky_px.png', 'sky_nx.png', 'sky_py.png', 'sky_ny.png', 'sky_pz.png', 'sky_nz.png']);

  scene = new THREE.Scene();
  scene.background = skyCube;

  scene.add(new THREE.AxisHelper(1000));

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
  camera.position.set(0, 400, 1200);
  camera.lookAt(0, 0, 0);

  controls = new THREE.PointerLockControls(camera);
  scene.add(controls.getObject());

  var ambient = new THREE.AmbientLight(0x444444);
  scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);

  var shipmodel = new OBJModel('assets/models/ship.obj', 'assets/models/ship.mtl');
  shipmodel.load(function (ship) {

    ship.scale.set(40, 40, 40);
    ship.position.set(20, -120, 50);
    ship.rotation.y = -Math.PI / 2;
    scene.add(ship);
  });

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);

  stats = new Stats();

  element.appendChild(renderer.domElement);
  element.appendChild(stats.dom);
};

var render = function render() {

  renderer.render(scene, camera);
  stats.update();
  window.requestAnimationFrame(render);
};

init();
render();

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb21wb25lbnRzL09CSk1vZGVsL2luZGV4LmpzIiwiLi4vLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCBvYmpMb2FkZXIgPSBuZXcgVEhSRUUuT0JKTG9hZGVyKCk7XG5sZXQgbXRsTG9hZGVyID0gbmV3IFRIUkVFLk1UTExvYWRlcigpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBPQkpNb2RlbCB7XG5cbiAgY29uc3RydWN0b3Iob2JqLCBtdGw9bnVsbCkge1xuXG4gICAgdGhpcy5vYmogPSBvYmo7XG4gICAgdGhpcy5tdGwgPSBtdGw7XG5cbiAgfVxuXG4gIGxvYWQoZG9uZSkge1xuXG4gICAgaWYgKHRoaXMubXRsKSB7XG5cbiAgICAgIG10bExvYWRlci5sb2FkKHRoaXMubXRsLCBtYXRlcmlhbHMgPT4ge1xuXG4gICAgICAgIG1hdGVyaWFscy5wcmVsb2FkKCk7XG4gICAgICAgIHRoaXMuX2xvYWRPYmoobWF0ZXJpYWxzLCBkb25lKTtcblxuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbG9hZE9iaihudWxsLCBkb25lKTtcbiAgICB9XG5cbiAgfVxuXG4gIF9sb2FkT2JqKG1hdGVyaWFscywgZG9uZSkge1xuXG4gICAgaWYgKG1hdGVyaWFscykge1xuICAgICAgb2JqTG9hZGVyLnNldE1hdGVyaWFscyhtYXRlcmlhbHMpO1xuICAgIH1cblxuICAgIG9iakxvYWRlci5sb2FkKHRoaXMub2JqLCBkb25lKTtcblxuICB9XG5cbn1cbiIsImltcG9ydCBPQkpNb2RlbCBmcm9tICcuL2NvbXBvbmVudHMvT0JKTW9kZWwvaW5kZXguanMnO1xuXG52YXIgZWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG52YXIgcG9pbnRlcmxvY2tjaGFuZ2UgPSAoKSA9PiB7XG5cbiAgaWYgKGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCA9PT0gZWxlbWVudCB8fFxuICAgICAgZG9jdW1lbnQubW96UG9pbnRlckxvY2tFbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICBkb2N1bWVudC53ZWJraXRQb2ludGVyTG9ja0VsZW1lbnQgPT09IGVsZW1lbnQpIHtcbiAgICBjb250cm9scy5lbmFibGVkID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBjb250cm9scy5lbmFibGVkID0gZmFsc2U7XG4gIH1cblxufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncG9pbnRlcmxvY2tjaGFuZ2UnLCBwb2ludGVybG9ja2NoYW5nZSwgZmFsc2UpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96cG9pbnRlcmxvY2tjaGFuZ2UnLCBwb2ludGVybG9ja2NoYW5nZSwgZmFsc2UpO1xuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignd2Via2l0cG9pbnRlcmxvY2tjaGFuZ2UnLCBwb2ludGVybG9ja2NoYW5nZSwgZmFsc2UpO1xuXG5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gIGVsZW1lbnQucmVxdWVzdFBvaW50ZXJMb2NrID0gZWxlbWVudC5yZXF1ZXN0UG9pbnRlckxvY2sgfHwgZWxlbWVudC5tb3pSZXF1ZXN0UG9pbnRlckxvY2sgfHwgZWxlbWVudC53ZWJraXRSZXF1ZXN0UG9pbnRlckxvY2s7XG5cbiAgaWYgKC9GaXJlZm94L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xuXG4gICAgdmFyIGZ1bGxzY3JlZW5jaGFuZ2UgPSAoKSA9PiB7XG5cbiAgICAgIGlmIChkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCA9PT0gZWxlbWVudCB8fFxuICAgICAgICAgIGRvY3VtZW50Lm1vekZ1bGxzY3JlZW5FbGVtZW50ID09PSBlbGVtZW50IHx8XG4gICAgICAgICAgZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnQgPT09IGVsZW1lbnQpIHtcblxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgZnVsbHNjcmVlbmNoYW5nZSk7XG4gICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCBmdWxsc2NyZWVuY2hhbmdlKTtcbiAgICAgICAgZWxlbWVudC5yZXF1ZXN0UG9pbnRlckxvY2soKTtcblxuICAgICAgfVxuXG4gICAgfTtcblxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBmdWxsc2NyZWVuY2hhbmdlLCBmYWxzZSk7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW96ZnVsbHNjcmVlbmNoYW5nZScsIGZ1bGxzY3JlZW5jaGFuZ2UsIGZhbHNlKTtcblxuICB9IGVsc2Uge1xuXG4gICAgZWxlbWVudC5yZXF1ZXN0UG9pbnRlckxvY2soKTtcblxuICB9XG5cbn0sIGZhbHNlKTtcblxudmFyIGNhbWVyYSwgY29udHJvbHMsIHJlbmRlcmVyLCBzY2VuZSwgc3RhdHM7XG5cbmxldCBpbml0ID0gKCkgPT4ge1xuXG4gIGxldCB0ZXh0dXJlTG9hZGVyID0gbmV3IFRIUkVFLkN1YmVUZXh0dXJlTG9hZGVyKCk7XG4gIHRleHR1cmVMb2FkZXIuc2V0UGF0aCgnYXNzZXRzL3RleHR1cmVzLycpO1xuXG4gIGxldCBza3lDdWJlID0gdGV4dHVyZUxvYWRlci5sb2FkKFtcbiAgICAnc2t5X3B4LnBuZycsICdza3lfbngucG5nJyxcbiAgICAnc2t5X3B5LnBuZycsICdza3lfbnkucG5nJyxcbiAgICAnc2t5X3B6LnBuZycsICdza3lfbnoucG5nJ1xuICBdKTtcblxuICBzY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICBzY2VuZS5iYWNrZ3JvdW5kID0gc2t5Q3ViZTtcblxuICBzY2VuZS5hZGQobmV3IFRIUkVFLkF4aXNIZWxwZXIoMTAwMCkpO1xuXG4gIGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSg3NSwgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsIDAuMSwgMTAwMDApO1xuICBjYW1lcmEucG9zaXRpb24uc2V0KDAsIDQwMCwgMTIwMCk7XG4gIGNhbWVyYS5sb29rQXQoMCwgMCwgMCk7XG5cbiAgY29udHJvbHMgPSBuZXcgVEhSRUUuUG9pbnRlckxvY2tDb250cm9scyhjYW1lcmEpO1xuICBzY2VuZS5hZGQoY29udHJvbHMuZ2V0T2JqZWN0KCkpO1xuXG4gIGxldCBhbWJpZW50ID0gbmV3IFRIUkVFLkFtYmllbnRMaWdodCgweDQ0NDQ0NCk7XG4gIHNjZW5lLmFkZChhbWJpZW50KTtcblxuICBsZXQgZGlyZWN0aW9uYWxMaWdodCA9IG5ldyBUSFJFRS5EaXJlY3Rpb25hbExpZ2h0KDB4ZmZlZWRkKTtcbiAgZGlyZWN0aW9uYWxMaWdodC5wb3NpdGlvbi5zZXQoMSwgMSwgMCkubm9ybWFsaXplKCk7XG4gIHNjZW5lLmFkZChkaXJlY3Rpb25hbExpZ2h0KTtcblxuICBsZXQgc2hpcG1vZGVsID0gbmV3IE9CSk1vZGVsKCdhc3NldHMvbW9kZWxzL3NoaXAub2JqJywgJ2Fzc2V0cy9tb2RlbHMvc2hpcC5tdGwnKTtcbiAgc2hpcG1vZGVsLmxvYWQoc2hpcCA9PiB7XG5cbiAgICBzaGlwLnNjYWxlLnNldCg0MCwgNDAsIDQwKTtcbiAgICBzaGlwLnBvc2l0aW9uLnNldCgyMCwgLTEyMCwgNTApO1xuICAgIHNoaXAucm90YXRpb24ueSA9IC1NYXRoLlBJIC8gMjtcbiAgICBzY2VuZS5hZGQoc2hpcCk7IFxuICAgICAgXG4gIH0pO1xuXG4gIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICBzdGF0cyA9IG5ldyBTdGF0cygpO1xuXG4gIGVsZW1lbnQuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIGVsZW1lbnQuYXBwZW5kQ2hpbGQoc3RhdHMuZG9tKTtcblxufTtcblxubGV0IHJlbmRlciA9ICgpID0+IHtcblxuICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gIHN0YXRzLnVwZGF0ZSgpO1xuICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlcik7XG5cbn07XG5cbmluaXQoKTtcbnJlbmRlcigpO1xuIl0sIm5hbWVzIjpbIm9iakxvYWRlciIsIlRIUkVFIiwiT0JKTG9hZGVyIiwibXRsTG9hZGVyIiwiTVRMTG9hZGVyIiwiT0JKTW9kZWwiLCJvYmoiLCJtdGwiLCJkb25lIiwibG9hZCIsInByZWxvYWQiLCJfbG9hZE9iaiIsIm1hdGVyaWFscyIsInNldE1hdGVyaWFscyIsImVsZW1lbnQiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJwb2ludGVybG9ja2NoYW5nZSIsInBvaW50ZXJMb2NrRWxlbWVudCIsIm1velBvaW50ZXJMb2NrRWxlbWVudCIsIndlYmtpdFBvaW50ZXJMb2NrRWxlbWVudCIsImVuYWJsZWQiLCJhZGRFdmVudExpc3RlbmVyIiwicmVxdWVzdFBvaW50ZXJMb2NrIiwibW96UmVxdWVzdFBvaW50ZXJMb2NrIiwid2Via2l0UmVxdWVzdFBvaW50ZXJMb2NrIiwidGVzdCIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImZ1bGxzY3JlZW5jaGFuZ2UiLCJmdWxsc2NyZWVuRWxlbWVudCIsIm1vekZ1bGxzY3JlZW5FbGVtZW50IiwibW96RnVsbFNjcmVlbkVsZW1lbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiY2FtZXJhIiwiY29udHJvbHMiLCJyZW5kZXJlciIsInNjZW5lIiwic3RhdHMiLCJpbml0IiwidGV4dHVyZUxvYWRlciIsIkN1YmVUZXh0dXJlTG9hZGVyIiwic2V0UGF0aCIsInNreUN1YmUiLCJTY2VuZSIsImJhY2tncm91bmQiLCJhZGQiLCJBeGlzSGVscGVyIiwiUGVyc3BlY3RpdmVDYW1lcmEiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiaW5uZXJIZWlnaHQiLCJwb3NpdGlvbiIsInNldCIsImxvb2tBdCIsIlBvaW50ZXJMb2NrQ29udHJvbHMiLCJnZXRPYmplY3QiLCJhbWJpZW50IiwiQW1iaWVudExpZ2h0IiwiZGlyZWN0aW9uYWxMaWdodCIsIkRpcmVjdGlvbmFsTGlnaHQiLCJub3JtYWxpemUiLCJzaGlwbW9kZWwiLCJzY2FsZSIsInJvdGF0aW9uIiwieSIsIk1hdGgiLCJQSSIsInNoaXAiLCJXZWJHTFJlbmRlcmVyIiwic2V0U2l6ZSIsIlN0YXRzIiwiYXBwZW5kQ2hpbGQiLCJkb21FbGVtZW50IiwiZG9tIiwicmVuZGVyIiwidXBkYXRlIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFZLElBQUlDLE1BQU1DLFNBQVYsRUFBaEI7QUFDQSxJQUFJQyxZQUFZLElBQUlGLE1BQU1HLFNBQVYsRUFBaEI7O0lBRXFCQztvQkFFUEMsR0FBWixFQUEyQjtRQUFWQyxHQUFVLHVFQUFOLElBQU07Ozs7U0FFcEJELEdBQUwsR0FBV0EsR0FBWDtTQUNLQyxHQUFMLEdBQVdBLEdBQVg7Ozs7O3lCQUlHQyxNQUFNOzs7VUFFTCxLQUFLRCxHQUFULEVBQWM7O2tCQUVGRSxJQUFWLENBQWUsS0FBS0YsR0FBcEIsRUFBeUIscUJBQWE7O29CQUUxQkcsT0FBVjtnQkFDS0MsUUFBTCxDQUFjQyxTQUFkLEVBQXlCSixJQUF6QjtTQUhGO09BRkYsTUFTTzthQUNBRyxRQUFMLENBQWMsSUFBZCxFQUFvQkgsSUFBcEI7Ozs7OzZCQUtLSSxXQUFXSixNQUFNOztVQUVwQkksU0FBSixF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
