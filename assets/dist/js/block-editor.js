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
/******/ 	return __webpack_require__(__webpack_require__.s = "./webpack/block-editor.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./assets/src/js/block/index.js":
/*!**************************************!*\
  !*** ./assets/src/js/block/index.js ***!
  \**************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vr_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vr/index */ "./assets/src/js/block/vr/index.js");
/* harmony import */ var _map_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map/index */ "./assets/src/js/block/map/index.js");
/* harmony import */ var _scss_block_editor_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../scss/block/editor.scss */ "./assets/src/scss/block/editor.scss");
/* harmony import */ var _scss_block_editor_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_scss_block_editor_scss__WEBPACK_IMPORTED_MODULE_2__);




/***/ }),

/***/ "./assets/src/js/block/map/edit.js":
/*!*****************************************!*\
  !*** ./assets/src/js/block/map/edit.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _jsxFileName = "/Users/kelvin/Local/kelvinxu/app/public/wp-content/plugins/VRPress/assets/src/js/block/map/edit.js";
/* eslint-disable camelcase */
/**
 * BLOCK: Tabs
 */
const {
  InspectorControls
} = wp.blockEditor;
const {
  PanelBody,
  SelectControl,
  RangeControl
} = wp.components;
const {
  useEffect,
  useState
} = wp.element;
const {
  __
} = wp.i18n;
const Edit = ({
  attributes,
  setAttributes
}) => {
  const {
    postID,
    width,
    height
  } = attributes;
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${ubc_vrpress_editor.site_address}/wp-json/wp/v2/ubcvrpress/`).then(res => res.json()).then(result => {
      setPosts(result.filter(post => {
        return 'google' === post.ubc_vr_type;
      }));
    }, error => {
      alert('An unexcepted error occured, please contact site administrator.');
    });
  }, []);

  /**
   * Render default gray box to insert url when source is empty.
   */
  function renderDefaultView() {
    const instance = posts.filter(post => {
      return post.id === postID;
    });
    const title = 1 === instance.length ? instance[0].title.rendered : '';
    return /*#__PURE__*/React.createElement("div", {
      className: "ubc-vrpress-default-view",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 40,
        columnNumber: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 41,
        columnNumber: 5
      }
    }, "VRPress Instance selected : ", /*#__PURE__*/React.createElement("strong", {
      style: {
        paddingLeft: '5px'
      },
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 41,
        columnNumber: 38
      }
    }, -1 === postID ? 'None' : title)));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderDefaultView(), /*#__PURE__*/React.createElement(InspectorControls, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50,
      columnNumber: 4
    }
  }, /*#__PURE__*/React.createElement(PanelBody, {
    title: "Settings",
    initialOpen: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 51,
      columnNumber: 5
    }
  }, /*#__PURE__*/React.createElement(SelectControl, {
    label: __('Select VRPress Streetview Instance:'),
    value: postID,
    onChange: newValue => {
      setAttributes({
        postID: parseInt(newValue)
      });
    },
    options: [{
      value: -1,
      label: 'None'
    }, ...posts.map(post => {
      return {
        value: post.id,
        label: post.title.rendered
      };
    })],
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 52,
      columnNumber: 21
    }
  }), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Map Width",
    value: width,
    min: 2,
    max: 3840,
    onChange: value => {
      setAttributes({
        width: value
      });
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70,
      columnNumber: 21
    }
  }), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Map Height",
    value: height,
    min: 2,
    max: 3840,
    onChange: value => {
      setAttributes({
        height: value
      });
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 81,
      columnNumber: 21
    }
  }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Edit);

/***/ }),

/***/ "./assets/src/js/block/map/index.js":
/*!******************************************!*\
  !*** ./assets/src/js/block/map/index.js ***!
  \******************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./assets/src/js/block/map/edit.js");
/**
 * BLOCK: UBC VRPress MAP.
 */


const {
  __
} = wp.i18n;
const {
  registerBlockType
} = wp.blocks;
registerBlockType('ubc/vrpress-map', {
  title: __('VRPress Google Map', 'ubc-vrpress'),
  description: __('Render google map associated with Streetview Panorama', 'ubc-vrpress'),
  icon: 'format-image',
  keywords: [__('360', 'ubc-vrpress'), __('Panorama', 'ubc-vrpress')],
  category: 'media',
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  save: () => null
});

/***/ }),

/***/ "./assets/src/js/block/vr/edit.js":
/*!****************************************!*\
  !*** ./assets/src/js/block/vr/edit.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var _jsxFileName = "/Users/kelvin/Local/kelvinxu/app/public/wp-content/plugins/VRPress/assets/src/js/block/vr/edit.js";
/* eslint-disable camelcase */
/**
 * BLOCK: Tabs
 */
const {
  InspectorControls
} = wp.blockEditor;
const {
  PanelBody,
  SelectControl,
  RangeControl
} = wp.components;
const {
  useEffect,
  useState
} = wp.element;
const {
  __
} = wp.i18n;
const Edit = ({
  attributes,
  setAttributes
}) => {
  const {
    postID,
    width,
    height
  } = attributes;
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${ubc_vrpress_editor.site_address}/wp-json/wp/v2/ubcvrpress/`).then(res => res.json()).then(result => {
      setPosts(result);
    }, error => {
      alert('An unexcepted error occured, please contact site administrator.');
    });
  }, []);

  /**
   * Render default gray box to insert url when source is empty.
   */
  function renderDefaultView() {
    const instance = posts.filter(post => {
      return post.id === postID;
    });
    const title = 1 === instance.length ? instance[0].title.rendered : '';
    return /*#__PURE__*/React.createElement("div", {
      className: "ubc-vrpress-default-view",
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 38,
        columnNumber: 4
      }
    }, /*#__PURE__*/React.createElement("div", {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39,
        columnNumber: 5
      }
    }, "VRPress Instance selected : ", /*#__PURE__*/React.createElement("strong", {
      style: {
        paddingLeft: '5px'
      },
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 39,
        columnNumber: 38
      }
    }, -1 === postID ? 'None' : title)));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderDefaultView(), /*#__PURE__*/React.createElement(InspectorControls, {
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 48,
      columnNumber: 4
    }
  }, /*#__PURE__*/React.createElement(PanelBody, {
    title: "Settings",
    initialOpen: true,
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49,
      columnNumber: 5
    }
  }, /*#__PURE__*/React.createElement(SelectControl, {
    label: __('Select VRPress Instance:'),
    value: postID,
    onChange: newValue => {
      setAttributes({
        postID: parseInt(newValue)
      });
    },
    options: [{
      value: -1,
      label: 'None'
    }, ...posts.map(post => {
      return {
        value: post.id,
        label: post.title.rendered
      };
    })],
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 50,
      columnNumber: 21
    }
  }), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Panel Width",
    value: width,
    min: 2,
    max: 3840,
    onChange: value => {
      setAttributes({
        width: value
      });
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 68,
      columnNumber: 21
    }
  }), /*#__PURE__*/React.createElement(RangeControl, {
    label: "Panel Height",
    value: height,
    min: 2,
    max: 3840,
    onChange: value => {
      setAttributes({
        height: value
      });
    },
    __self: undefined,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 79,
      columnNumber: 21
    }
  }))));
};
/* harmony default export */ __webpack_exports__["default"] = (Edit);

/***/ }),

/***/ "./assets/src/js/block/vr/index.js":
/*!*****************************************!*\
  !*** ./assets/src/js/block/vr/index.js ***!
  \*****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./edit */ "./assets/src/js/block/vr/edit.js");
/**
 * BLOCK: UBC VRPress.
 */

// Import block dependencies and components.

const {
  __
} = wp.i18n;
const {
  registerBlockType
} = wp.blocks;
registerBlockType('ubc/vrpress', {
  title: __('VRPress', 'ubc-vrpress'),
  description: __('Render 360 panorama images with hotspots.', 'ubc-vrpress'),
  icon: 'format-image',
  keywords: [__('360', 'ubc-vrpress'), __('Panorama', 'ubc-vrpress')],
  category: 'media',
  edit: _edit__WEBPACK_IMPORTED_MODULE_0__["default"],
  save: () => null
});

/***/ }),

/***/ "./assets/src/scss/block/editor.scss":
/*!*******************************************!*\
  !*** ./assets/src/scss/block/editor.scss ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./webpack/block-editor.js":
/*!*********************************!*\
  !*** ./webpack/block-editor.js ***!
  \*********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _assets_src_js_block_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./../assets/src/js/block/index */ "./assets/src/js/block/index.js");


/***/ })

/******/ });
//# sourceMappingURL=block-editor.js.map