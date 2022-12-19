/**
 * This files provides helper functions to serve other components.
 */

export const uniqueID = () => {
    return Math.floor( Math.random() * 100000 );
};

export const getTranslateValues = ( element ) => {
    const style = window.getComputedStyle( element );
    const matrix = style.transform || style.webkitTransform || style.mozTransform;

    // No transform property. Simply return 0 values.
    if ( 'none' === matrix ) {
      return {
        x: 0,
        y: 0,
        z: 0
      };
    }

    // Can either be 2d or 3d transform
    const matrixType = matrix.includes( '3d' ) ? '3d' : '2d';
    const matrixValues = matrix.match( /matrix.*\((.+)\)/ )[1].split( ', ' );

    // 2d matrices have 6 values
    // Last 2 values are X and Y.
    // 2d matrices does not have Z value.
    if ( '2d' === matrixType ) {
      return {
        x: matrixValues[4],
        y: matrixValues[5],
        z: 0
      };
    }

    // 3d matrices have 16 values
    // The 13th, 14th, and 15th values are X, Y, and Z
    if ( '3d' === matrixType ) {
      return {
        x: matrixValues[12],
        y: matrixValues[13],
        z: matrixValues[14]
      };
    }
};

const sgn = (x) => {
  return x >= 0 ? 1 : -1;
}

const get3dFov = (zoom) => {
  return zoom <= 2 ?
      126.5 - zoom * 36.75 :  // linear descent
      195.93 / Math.pow(1.92, zoom); // parameters determined experimentally
};

/**
 * Given the current POV, this method calculates the target Pov on the
 * given offset X and Y cordinates. All credit for the math this method goes
 * to user3146587 on StackOverflow: http://goo.gl/0GGKi6
 *
 * @param {number} OffsetX horizontal offset of hotspot.
 *  * @param {number} OffsetY vertical offset of hotspot.
 * @param {StreetViewPov} currentPov POV of the viewport center.
 * @param {number} zoom The current zoom level.
 * @param {Element} viewport The current viewport containing the panorama.
 * @return {StreetViewPov} target pov
 */
export const pixel3dToPov = ( offSetX, offSetY, currentPov, zoom, viewport ) => {
  var PI = Math.PI;
  var cos = Math.cos;
  var sin = Math.sin;
  var tan = Math.tan;
  var sqrt = Math.sqrt;
  var atan2 = Math.atan2;
  var asin = Math.asin;

  // Gather required variables and convert to radians where necessary
  var width = viewport.offsetWidth;
  var height = viewport.offsetHeight;

  if((window.fullScreen) ||
    (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
      width = window.innerWidth;
      height = window.height;
  }

  var DEG_TO_RAD = PI / 180.0;
  var fov = get3dFov(zoom) * DEG_TO_RAD;

  var h0 = currentPov.heading * DEG_TO_RAD;
  var p0 = currentPov.pitch * DEG_TO_RAD;

  var f = 0.5 * width / tan(0.5 * fov);

  var x0 = f * cos(p0) * sin(h0);
  var y0 = f * cos(p0) * cos(h0);
  var z0 = f * sin(p0);

  var du = offSetX - width / 2;
  var dv = height / 2 - offSetY;

  var ux = sgn(cos(p0)) * cos(h0);
  var uy = -sgn(cos(p0)) * sin(h0);
  var uz = 0;

  var vx = -sin(p0) * sin(h0);
  var vy = -sin(p0) * cos(h0);
  var vz = cos(p0);

  var x = x0 + du * ux + dv * vx;
  var y = y0 + du * uy + dv * vy;
  var z = z0 + du * uz + dv * vz;

  var R = sqrt(x * x + y * y + z * z);
  var h = atan2(x, y);
  var p = asin(z / R);

  return {
    heading: h * 180.0 / PI,
    pitch: p * 180.0 / PI
  };
};

export const deepCopy = (inObject) => {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopy(value)
  }

  return outObject
}