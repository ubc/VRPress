/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./webpack/tour-frontend-streetview.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/js/streetview-extend.js":
/*!********************************************!*\
  !*** ./assets/src/js/streetview-extend.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/**
 * Extend google map javascript API streetview.
 * Add custom modal html, controls and etc.
 */

/* eslint-disable camelcase */
(function ($) {
  window.generateStreetViewModalCtrl = () => {
    const mainDiv = document.createElement('DIV');
    mainDiv.classList.add('map-container__hotspot-modal');
    mainDiv.innerHTML = `
          <div class='map-container__hotspot-modal-heading'>
            <h2></h2>
            <button><img src='${ubc_vrpress_admin.plugin_url}assets/src/image/times-solid.svg' alt="" /></button>
          </div>
          <div class='map-container__hotspot-modal-content'></div>
      `;
    return mainDiv;
  };
  window.generatePanoNavigatorCtrl = (defaultMarker, markers, cb) => {
    const mainDiv = document.createElement('DIV');
    mainDiv.classList.add('map-container__pano-navigator');
    let navigatorHTML = '';
    markers.forEach(marker => {
      navigatorHTML += `<li lat="${marker.position.lat}" lng="${marker.position.lng}">${marker.title}</li>`;
    });
    mainDiv.innerHTML = `
        <div class="streetview__controls">
            <div class="streetview__controls--menu"><img src="${ubc_vrpress_admin.plugin_url + 'assets/src/image/bars-solid-gray.svg'}" alt=""></div>
            <div class="streetview__controls--home"><img src="${ubc_vrpress_admin.plugin_url + 'assets/src/image/home-solid-gray.svg'}" alt=""></div>
        </div>
        <div class="streetview__controls--menu-items">
            <nav aria-label="scene navigation">
                <ul>
                    ${navigatorHTML}
                </ul>
            </nav>
        </div>
      `;
    mainDiv.querySelector('.streetview__controls--menu').addEventListener('click', () => {
      mainDiv.querySelector('.streetview__controls--menu-items').classList.toggle('show');
    });
    mainDiv.querySelectorAll('.streetview__controls--menu-items li').forEach(item => {
      item.addEventListener('click', event => {
        const lat = parseFloat(event.target.getAttribute('lat'));
        const lng = parseFloat(event.target.getAttribute('lng'));
        cb(lat, lng);
        mainDiv.querySelector('.streetview__controls--menu-items').classList.remove('show');
      });
    });
    mainDiv.querySelector('.streetview__controls--home').addEventListener('click', () => {
      cb(defaultMarker.position.lat, defaultMarker.position.lng);
      mainDiv.querySelector('.streetview__controls--menu-items').classList.remove('show');
    });
    return mainDiv;
  };
  $(document).on('click', '.map-container__hotspot-modal button', function (e) {
    e.preventDefault();
    const modal = $(this).closest('.map-container__hotspot-modal');
    modal.find('.map-container__hotspot-modal-heading h2').html('');
    modal.find('.map-container__hotspot-modal-content').html('');
    modal.removeClass('show');
  });
})(jQuery);

/***/ }),

/***/ "./assets/src/js/streetview-init.js":
/*!******************************************!*\
  !*** ./assets/src/js/streetview-init.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _streetview_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streetview-extend */ "./assets/src/js/streetview-extend.js");
/* harmony import */ var _streetview_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_streetview_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _scss_streetview_extend_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../scss/streetview-extend.scss */ "./assets/src/scss/streetview-extend.scss");
/* harmony import */ var _scss_streetview_extend_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_scss_streetview_extend_scss__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Initiate all existing google map streetview instances on current page.
 */




/* eslint-disable camelcase */
(function ($) {
  window.ubc_vrpress_streetview_init = () => {
    if (!window.ubc_vrpress_streetviews) {
      return;
    }
    function getHotspotIconByType(type, icon) {
      switch (type) {
        case 'Info':
          icon = 'vrpress-hotspot iconType-Info';
          break;
        case 'Link':
          icon = 'vrpress-hotspot iconType-Link';
          break;
        case 'Video':
          icon = 'vrpress-hotspot iconType-Video';
          break;
        case 'Image':
          icon = 'vrpress-hotspot iconType-Image';
          break;
        case 'oEmbed':
          icon = 'vrpress-hotspot iconType-oEmbed-' + icon;
          break;
      }
      return icon;
    }
    window.ubc_vrpress_streetviews.forEach(streetview => {
      const element = document.getElementById(streetview.element);
      const markers = streetview.markers ? streetview.markers.map(marker => {
        return _objectSpread(_objectSpread({}, marker), {}, {
          position: {
            lat: parseFloat(marker.position.lat),
            lng: parseFloat(marker.position.lng)
          }
        });
      }) : [];
      const hotspots = streetview.hotSpots ? streetview.hotSpots.map(hotspot => {
        return _objectSpread(_objectSpread({}, hotspot), {}, {
          pov: {
            heading: parseFloat(hotspot.pov.heading),
            pitch: parseFloat(hotspot.pov.pitch)
          }
        });
      }) : [];
      const defaultMarker = markers[parseInt(streetview.defaultMarker)];
      const panorama = new google.maps.StreetViewPanorama(element, {
        position: defaultMarker.position,
        linksControl: false,
        panControl: false,
        enableCloseButton: false,
        addressControl: false
      });
      const sv = new google.maps.StreetViewService();
      const modalControl = window.generateStreetViewModalCtrl();
      const navigatorControl = window.generatePanoNavigatorCtrl(defaultMarker, markers, function (lat, lng) {
        sv.getPanorama({
          location: {
            lat: lat,
            lng: lng
          },
          radius: 50
        }, function (data, status) {
          if ('OK' === status) {
            const location = data.location;
            panorama.setPano(location.pano);
          } else {
            console.error('Street View data not found for this location.');
          }
        });
      });
      panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(modalControl);
      panorama.controls[google.maps.ControlPosition.TOP_RIGHT].push(navigatorControl);
      let hotspotMarkers = [];

      // Add markers
      hotspots.forEach(hotspot => {
        const newHotSpot = new PanoMarker({
          position: {
            heading: hotspot.pov.heading,
            pitch: hotspot.pov.pitch
          },
          container: element,
          pano: panorama,
          anchor: new google.maps.Point(20, 20),
          size: new google.maps.Size(40, 40),
          className: getHotspotIconByType(hotspot.type, hotspot.iconType)
        });
        newHotSpot.panoID = hotspot.pano;
        google.maps.event.addListener(newHotSpot, 'click', function (hotspot, element) {
          return function (event) {
            if (!hotspot[hotspot.type]) {
              hotspot[hotspot.type] = {};
            }
            if ('Image' === hotspot.type) {
              hotspot[hotspot.type].content = `<div class="vrpress-modal-image-container"><img src="${hotspot.Image.url}" alt="${hotspot.Image.alt}" /><div class="vrpress-modal-image-container-caption">${hotspot.Image.caption}</div>`;
            }
            if ('Video' === hotspot.type) {
              hotspot[hotspot.type].content = `<video controls><source src="${hotspot.Video.url}" type="video/mp4">Your browser does not support the video tag.</video>`;
            }
            if ('oEmbed' === hotspot.type && !isNaN(hotspot.oEmbed.width) && !isNaN(hotspot.oEmbed.height)) {
              hotspot[hotspot.type].content = `<div class="pnlm-render-container__iframe-container" style="padding-bottom:${(hotspot.oEmbed.height / hotspot.oEmbed.width * 100).toFixed(2)}%;"><iframe src="${hotspot.oEmbed.embedUrl}" allowfullscreen /></div>`;
            }
            if ('Link' === hotspot.type) {
              window.open(hotspot.Link.URL);
            } else {
              const modalElement = element.querySelector('.map-container__hotspot-modal');
              const headingElement = modalElement.querySelector('.map-container__hotspot-modal-heading h2');
              const contentElement = modalElement.querySelector('.map-container__hotspot-modal-content');
              headingElement.innerHTML = hotspot.title;
              contentElement.innerHTML = hotspot[hotspot.type].content ? hotspot[hotspot.type].content : '';
              modalElement.classList.add('show');
            }
          };
        }(hotspot, element));
        hotspotMarkers.push(newHotSpot);
      });
      panorama.addListener('pano_changed', () => {
        const pano = panorama.getPano();
        hotspotMarkers.forEach(hotspot => {
          const hotspotPano = hotspot.panoID;
          if (pano == hotspotPano) {
            hotspot.setVisible(true);
          } else {
            hotspot.setVisible(false);
          }
        });

        // Changed pano clickToGo based on selection
        const currentPano = markers.filter(marker => {
          return marker.pano === panorama.pano;
        });
        if (0 !== currentPano.length && 'true' === currentPano[0].clickToGo) {
          panorama.setOptions({
            clickToGo: false
          });
        } else {
          panorama.setOptions({
            clickToGo: true
          });
        }
        if (0 !== currentPano.length) {
          panorama.setOptions({
            pov: {
              heading: parseFloat(currentPano[0].pov.heading),
              pitch: parseFloat(currentPano[0].pov.pitch),
              zoom: parseFloat(currentPano[0].pov.zoom)
            }
          });
        }
      });
    });
  };
})(jQuery);
window.ubc_vrpress_streetview_init();

/***/ }),

/***/ "./assets/src/js/streetview-map-init.js":
/*!**********************************************!*\
  !*** ./assets/src/js/streetview-map-init.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _streetview_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streetview-extend */ "./assets/src/js/streetview-extend.js");
/* harmony import */ var _streetview_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_streetview_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _scss_streetview_extend_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./../scss/streetview-extend.scss */ "./assets/src/scss/streetview-extend.scss");
/* harmony import */ var _scss_streetview_extend_scss__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_scss_streetview_extend_scss__WEBPACK_IMPORTED_MODULE_1__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * Initiate all existing google map instances associated with streetview on current page.
 */




/* eslint-disable camelcase */
(function ($) {
  window.ubc_vrpress_streetview_map_init = () => {
    if (!window.ubc_vrpress_streetviews_maps) {
      return;
    }
    window.ubc_vrpress_streetviews_maps.forEach(streetview_map => {
      const element = document.getElementById(streetview_map.element);
      const streetviewElement = document.getElementById(streetview_map.streetview_element);
      const markers = streetview_map.markers ? streetview_map.markers.map(marker => {
        return _objectSpread(_objectSpread({}, marker), {}, {
          position: {
            lat: parseFloat(marker.position.lat),
            lng: parseFloat(marker.position.lng)
          }
        });
      }) : [];
      const defaultMarker = markers[parseInt(streetview_map.defaultMarker)];
      const map = new google.maps.Map(element, {
        center: defaultMarker.position,
        zoom: 13
      });
      markers.forEach(marker => {
        const newMarker = new google.maps.Marker({
          position: marker.position,
          map: map
        });
        newMarker.addListener('click', () => {
          const navigatorItem = streetviewElement.querySelector('.streetview__controls--menu-items li[lat="' + marker.position.lat + '"][lng="' + marker.position.lng + '"]');
          if (navigatorItem) {
            $('html, body').animate({
              scrollTop: streetviewElement.offsetTop
            }, 1000, function () {
              navigatorItem.click();
            });
          }
        });
      });
    });
  };
})(jQuery);
window.ubc_vrpress_streetview_map_init();

/***/ }),

/***/ "./assets/src/scss/streetview-extend.scss":
/*!************************************************!*\
  !*** ./assets/src/scss/streetview-extend.scss ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./assets/src/scss/tour-frontend-streetview.scss":
/*!*******************************************************!*\
  !*** ./assets/src/scss/tour-frontend-streetview.scss ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./webpack/tour-frontend-streetview.js":
/*!*********************************************!*\
  !*** ./webpack/tour-frontend-streetview.js ***!
  \*********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_src_scss_tour_frontend_streetview_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/src/scss/tour-frontend-streetview.scss */ "./assets/src/scss/tour-frontend-streetview.scss");
/* harmony import */ var _assets_src_scss_tour_frontend_streetview_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_assets_src_scss_tour_frontend_streetview_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _assets_src_js_streetview_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../assets/src/js/streetview-extend */ "./assets/src/js/streetview-extend.js");
/* harmony import */ var _assets_src_js_streetview_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_assets_src_js_streetview_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _assets_src_js_streetview_init__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../assets/src/js/streetview-init */ "./assets/src/js/streetview-init.js");
/* harmony import */ var _assets_src_js_streetview_map_init__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../assets/src/js/streetview-map-init */ "./assets/src/js/streetview-map-init.js");





/***/ })

/******/ });
//# sourceMappingURL=tour-frontend-streetview.js.map