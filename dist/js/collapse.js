(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _utils = require("./utils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var transitionEvent = (0, _utils.whichTransitionEvent)();
/**
 *  Default options
 */

var defaultOptions = {
  collapsingClass: 'is-collapsing',
  collapsedClass: 'is-collapsed',
  toggleData: 'data-open',
  openInitially: false,
  clearHeightShown: true,
  calcHeightShowFn: null,
  handlerShow: function handlerShow() {},
  handlerShown: function handlerShown() {},
  handlerBeforeShow: function handlerBeforeShow() {
    return true;
  },
  handlerHide: function handlerHide() {},
  handlerHidden: function handlerHidden() {},
  handlerBeforeHide: function handlerBeforeHide() {
    return true;
  },
  handlerDestroy: function handlerDestroy() {}
};

var WeberryCollapse =
/*#__PURE__*/
function () {
  function WeberryCollapse(elem, params) {
    _classCallCheck(this, WeberryCollapse);

    if (elem.WeberryCollapse) {
      return elem.WeberryCollapse;
    }

    var options = Object.assign({}, defaultOptions, params);
    this.elem = elem;
    this.options = options;
    this.isOpen = options.openInitially;
    this.showInProgress = false;
    this.hideInProgress = false;
    this.heightInitial = null;
    this.heightFinal = null;
    this.toggleElems = []; //---------------------------------PRIVATE DATA------------------------------------

    this._p = {
      transitionEvent: transitionEvent,
      showTimeout: null,
      hideTimeout: null,
      showTransitionFn: null,
      hideTransitionFn: null,
      toggleListener: null,
      eventsTag: 0,
      events: {}
    };
    elem.WeberryCollapse = this;
    this.init();
  }

  _createClass(WeberryCollapse, [{
    key: "prepareToShow",
    value: function prepareToShow() {
      this.heightInitial = this.elem.offsetHeight;
      this.heightFinal = this.options.calcHeightShowFn();
    }
  }, {
    key: "show",
    value: function show() {
      var hideInProgress = this.hideInProgress,
          options = this.options;

      if (options.handlerBeforeShow() === false) {
        return;
      }

      if (!hideInProgress) {
        this.prepareToShow();
      }

      if (this.heightInitial >= this.heightFinal) {
        return;
      }

      this.isOpen = true;
      this.toggleElemsSetState(true);
      /**
       *  Call listeners event SHOW
       */

      this.elem.dispatchEvent(eventShow);
      options.handlerShow();
      this.animateShow();
    }
  }, {
    key: "hide",
    value: function hide() {
      var elem = this.elem,
          options = this.options;

      if (options.handlerBeforeHide() === false) {
        return;
      }

      if (elem.offsetHeight <= this.heightInitial) {
        return;
      }

      (0, _utils.removeClass)(elem, options['collapsedClass']);
      this.isOpen = false;
      this.toggleElemsSetState(false);
      /**
       *  Call listeners event HIDE
       */

      elem.dispatchEvent(eventHide);
      options.handlerHide();
      this.animateHide();
    }
  }, {
    key: "setCalcHeightShowFn",
    value: function setCalcHeightShowFn() {
      var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.calcHeightDefault.bind(this);
      this.options.calcHeightShowFn = fn;
    }
  }, {
    key: "calcHeightDefault",
    value: function calcHeightDefault() {
      var elem = this.elem;
      elem.style.height = 'auto';
      elem.style.display = 'block';
      var height = elem.offsetHeight;
      elem.style.height = '';
      elem.style.display = '';
      return height;
    }
  }, {
    key: "toggle",
    value: function toggle() {
      this.isOpen ? this.hide() : this.show();
    }
  }, {
    key: "toggleElemsInit",
    value: function toggleElemsInit() {
      var _this = this;

      var elem = this.elem,
          isOpen = this.isOpen,
          options = this.options,
          _p = this._p;
      var toggleElems;
      var target = elem.getAttribute('id');
      toggleElems = Array.from(document.querySelectorAll("[href=\"#".concat(target, "\"],[data-target=\"#").concat(target, "\"]")));

      var toggleListener = function toggleListener(e) {
        e.preventDefault();

        _this.toggle();
      };

      _p.toggleListener = toggleListener;
      toggleElems.forEach(function (toggleElem) {
        toggleElem.setAttribute(options.toggleData, isOpen);
        toggleElem.addEventListener('click', toggleListener);
      });
      this.toggleElems = toggleElems;
    }
  }, {
    key: "toggleElemsDestroy",
    value: function toggleElemsDestroy() {
      var toggleElems = this.toggleElems,
          _p = this._p,
          options = this.options;
      toggleElems.forEach(function (toggleElem) {
        toggleElem.removeAttribute(options.toggleData);
        toggleElem.removeEventListener('click', _p.toggleListener);
      });
    }
  }, {
    key: "toggleElemsSetState",
    value: function toggleElemsSetState(state) {
      var options = this.options,
          toggleElems = this.toggleElems;
      toggleElems.forEach(function (toggleElem) {
        toggleElem.setAttribute(options.toggleData, state);
      });
    }
  }, {
    key: "init",
    value: function init() {
      if (this.options.calcHeightShowFn) {
        this.setCalcHeightShowFn(this.options.calcHeightShowFn);
      } else {
        this.setCalcHeightShowFn();
      }

      if (this.isOpen) {
        (0, _utils.removeClass)(this.elem, this.options['collapsedClass']);
        this.prepareToShow();
        (0, _utils.addClass)(this.elem, this.options['collapsedClass']);
      }

      this.setShowTransitionFn();
      this.setHideTransitionFn();
      this.toggleElemsInit();
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var options = this.options,
          elem = this.elem;
      this.clearEvents();
      this.toggleElemsDestroy();
      this.resetClassList();
      this.unBindShowTransitionFn();
      this.unBindHideTransitionFn();
      options.handlerDestroy(elem);
      delete elem.WeberryCollapse;
    }
  }, {
    key: "resetClassList",
    value: function resetClassList() {
      (0, _utils.removeClass)(this.elem, this.options['collapsingClass']);
      (0, _utils.removeClass)(this.elem, this.options['collapsedClass']);
    }
  }, {
    key: "reset",
    value: function reset() {
      var openInitially = this.options.openInitially;
      this.isOpen = openInitially;
      this.showInProgress = false;
      this.hideInProgress = false;
      this.setCalcHeightShowFn();
      this.toggleElemsSetState(openInitially);
      this.unBindShowTransitionFn();
      this.unBindHideTransitionFn();

      if (openInitially) {
        this.elem.style.display = '';
        this.elem.style.height = '';
        (0, _utils.removeClass)(this.elem, this.options['collapsingClass']);
        (0, _utils.addClass)(this.elem, this.options['collapsedClass']);
      } else {
        this.resetClassList();
      }
    }
  }]);

  return WeberryCollapse;
}(); //---------------------------------ANIMATE FUNCTIONS ------------------------------------


WeberryCollapse.prototype.animateShow = function () {
  var _this2 = this;

  var elem = this.elem,
      _p = this._p;

  if (this.hideInProgress) {
    this.unBindShowTransitionFn();
    this.unBindHideTransitionFn();
  }

  this.showInProgress = true;
  this.hideInProgress = false;
  /**
   * Set the height at which the animation begins
   */

  if (!this.hideInProgress) {
    elem.style.height = this.heightInitial + 'px';
  }

  this.bindShowTransitionFn();

  if (this.hideInProgress) {
    this.hideInProgress = false;
    elem.style.height = this.heightFinal + 'px';
  } else {
    (0, _utils.addClass)(elem, this.options['collapsingClass']);
    _p.showTimeout = setTimeout(function () {
      elem.style.height = _this2.heightFinal + 'px';
    }, 50);
  }
};

WeberryCollapse.prototype.animateHide = function () {
  var _this3 = this;

  var elem = this.elem,
      _p = this._p;

  if (this.showInProgress) {
    this.unBindShowTransitionFn();
    this.unBindHideTransitionFn();
  }

  this.showInProgress = false;
  this.hideInProgress = true;
  /**
   * Set the height at which the animation begins
   */

  elem.style.height = this.heightFinal + 'px';
  this.bindHideTransitionFn();

  if (this.showInProgress) {
    this.showInProgress = false;
    elem.style.height = this.heightInitial + 'px';
  } else {
    (0, _utils.addClass)(elem, this.options['collapsingClass']);
    _p.hideTimeout = setTimeout(function () {
      elem.style.height = _this3.heightInitial + 'px';
    }, 50);
  }
}; //---------------------------------TRANSITION END EVENT FUNCTIONS ------------------------------------


WeberryCollapse.prototype.bindShowTransitionFn = function () {
  var elem = this.elem,
      _p = this._p;
  elem.addEventListener(_p.transitionEvent, _p.showTransitionFn);
};

WeberryCollapse.prototype.unBindShowTransitionFn = function () {
  var elem = this.elem,
      _p = this._p;
  clearTimeout(_p.showTimeout);
  elem.removeEventListener(_p.transitionEvent, _p.showTransitionFn);
};

WeberryCollapse.prototype.bindHideTransitionFn = function () {
  var elem = this.elem,
      _p = this._p;
  elem.addEventListener(_p.transitionEvent, _p.hideTransitionFn);
};

WeberryCollapse.prototype.unBindHideTransitionFn = function () {
  var elem = this.elem,
      _p = this._p;
  clearTimeout(_p.hideTimeout);
  elem.removeEventListener(_p.transitionEvent, _p.hideTransitionFn);
};

WeberryCollapse.prototype.setShowTransitionFn = function () {
  var _this4 = this;

  var elem = this.elem,
      options = this.options,
      _p = this._p;

  _p.showTransitionFn = function () {
    /**
     * Checking if current height of elem not equal final height
     */
    if (_this4.elem.offsetHeight !== _this4.heightFinal) {
      return;
    }

    elem.removeEventListener(_p.transitionEvent, _p.showTransitionFn);
    (0, _utils.removeClass)(elem, options['collapsingClass']);
    (0, _utils.addClass)(elem, options['collapsedClass']);

    if (options.clearHeightShown) {
      elem.style.height = '';
    }

    _this4.showInProgress = false;
    /**
     *  Call listeners event SHOWN
     */

    elem.dispatchEvent(eventShown);
    options.handlerShown();
  };
};

WeberryCollapse.prototype.setHideTransitionFn = function () {
  var _this5 = this;

  var elem = this.elem,
      options = this.options,
      _p = this._p;

  _p.hideTransitionFn = function () {
    /**
     * Checking if current height of elem not equal initial height
     */
    if (_this5.elem.offsetHeight !== _this5.heightInitial) {
      return;
    }

    elem.removeEventListener(_p.transitionEvent, _p.hideTransitionFn);
    (0, _utils.removeClass)(elem, options['collapsingClass']);
    elem.style.height = '';
    _this5.hideInProgress = false;
    /**
     *  Call listeners event HIDDEN
     */

    elem.dispatchEvent(eventHidden);
    options.handlerHidden();
  };
}; //---------------------------------CUSTOM EVENTS------------------------------------


var eventMap = {
  show: 'wbry.collapse.show',
  shown: 'wbry.collapse.shown',
  hide: 'wbry.collapse.hide',
  hidden: 'wbry.collapse.hidden'
};
var eventShow = new CustomEvent(eventMap.show);
var eventShown = new CustomEvent(eventMap.shown);
var eventHide = new CustomEvent(eventMap.hide);
var eventHidden = new CustomEvent(eventMap.hidden);

WeberryCollapse.prototype.clearEvents = function () {
  var _this6 = this;

  var events = this._p.events;
  Object.keys(events).forEach(function (key) {
    var event = events[key].event;
    var fn = events[key].fn;

    _this6.off(event, fn);
  });
  this._p.events = {};
  this._p.eventsTag = 0;
};

WeberryCollapse.prototype.on = function (event, fn) {
  var _p = this._p;
  _p.events["event".concat(_p.eventsTag)] = {
    event: event,
    fn: fn
  };
  _p.eventsTag += 1;
  this.elem.addEventListener(eventMap[event], fn);
};

WeberryCollapse.prototype.off = function (event, fn) {
  this.elem.removeEventListener(eventMap[event], fn);
};

window.WeberryCollapse = WeberryCollapse;
var _default = WeberryCollapse;
exports["default"] = _default;

},{"./utils":3}],2:[function(require,module,exports){
"use strict";

var _utils = require("./utils");

var _collapse = _interopRequireDefault(require("./collapse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var collapseDom = (0, _utils.domById)('collapse');
var collapseDom1 = (0, _utils.domById)('collapse1');
window.addEventListener('load', function () {
  var collapse = new _collapse["default"](collapseDom, {
    openInitially: true
  });
  var collapse1 = new _collapse["default"](collapseDom1);
});

},{"./collapse":1,"./utils":3}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.whichTransitionEvent = exports.domById = exports.arrayByClass = exports.removeClass = exports.addClass = void 0;

var addClass = function addClass(elem, classname) {
  if (classname) {
    if (elem.classList) elem.classList.add(classname);else elem.className += ' ' + classname;
  }
};

exports.addClass = addClass;

var removeClass = function removeClass(elem, classname) {
  if (classname) {
    if (elem.classList) elem.classList.remove(classname);else elem.className = elem.className.replace(new RegExp('(^|\\b)' + classname.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

exports.removeClass = removeClass;

var arrayByClass = function arrayByClass(classname) {
  var instance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  var collection = instance.getElementsByClassName(classname);

  if (collection === undefined) {
    return collection;
  }

  return Array.from(collection);
};

exports.arrayByClass = arrayByClass;

var domById = function domById(id) {
  var instance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
  return document.getElementById(id);
};

exports.domById = domById;

var whichTransitionEvent = function whichTransitionEvent() {
  var t,
      el = document.createElement('fakeelement');
  var animations = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
};

exports.whichTransitionEvent = whichTransitionEvent;

},{}]},{},[2]);
