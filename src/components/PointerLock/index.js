class PointerLock {

  static init(elm, controls) {

    let pointerlockchange = () => {

      if (document.pointerLockElement === elm ||
          document.mozPointerLockElement === elm ||
          document.webkitPointerLockElement === elm) {
        controls.enabled = true;
      } else {
        controls.enabled = false;
      }

    };

    document.addEventListener('pointerlockchange', pointerlockchange, false);
    document.addEventListener('mozpointerlockchange', pointerlockchange, false);
    document.addEventListener('webkitpointerlockchange', pointerlockchange, false);

    elm.addEventListener('click', () => {

      elm.requestPointerLock = elm.requestPointerLock ||
                               elm.mozRequestPointerLock || 
                               elm.webkitRequestPointerLock;

      if (/Firefox/i.test(navigator.userAgent)) {

        let fullscreenchange = () => {

          if (document.fullscreenelm === elm ||
              document.mozFullscreenelm === elm ||
              document.mozFullScreenelm === elm) {

            document.removeEventListener('fullscreenchange', fullscreenchange);
            document.removeEventListener('mozfullscreenchange', fullscreenchange);
            elm.requestPointerLock();

          }

        };

        document.addEventListener('fullscreenchange', fullscreenchange, false);
        document.addEventListener('mozfullscreenchange', fullscreenchange, false);

      } else {

        elm.requestPointerLock();

      }

    }, false);

  }

}

export default PointerLock;
